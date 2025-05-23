import Stripe from 'stripe'
import cartModel from '../../../DB/model/Cart.model.js'
import couponModel from '../../../DB/model/Coupon.model.js'
import orderModel from '../../../DB/model/Order.model.js'
import productModel from '../../../DB/model/Product.model.js'
import payment from '../../utils/payment.js'
import {createInvoice} from '../../utils/pdfkit.js'
import sendEmail from '../../utils/sendEmail.js'
import { validationCoupon } from '../coupon/coupon.controller.js'

export const createOrder = async (req, res, next) => {
  const userId = req.user._id
  const { products, couponCode, address, phone, paymentMethod } = req.body
  // coupon validation
  if (couponCode) {
    const coupon = await couponModel.findOne({ code: couponCode })
    if (!coupon) {
      return next(new Error('in-valid coupon code', { cause: 400 }))
    }
    const { matched, exceed, expired } = validationCoupon(coupon, userId)

    if (expired) {
      return next(new Error('this coupon is expired', { cause: 400 }))
    }
    // if (!matched) {
    //   return next(
    //     new Error('this coupon is not assgined to you', { cause: 400 }),
    //   )
    // }
    if (exceed) {
      return next(
        new Error('you exceed the max usage of this coupon', { cause: 400 }),
      )
    }
    req.body.coupon = coupon
  }

  if (!products?.length) {
    const cartExist = await cartModel.findOne({ userId })
    if (!cartExist?.products?.length) {
      return next(new Error('empty cart', { cause: 400 }))
    }
    req.body.isCart = true
    req.body.products = cartExist.products
  }
  // products validation
  // [{ productId , quantity}]
  let subTotal = 0
  let finalProducts = []
  let productIds = []
  for (let product of req.body.products) {
    productIds.push(product.productId)
    const findProduct = await productModel.findOne({
      _id: product.productId,
      stock: { $gte: product.quantity },
      isDeleted: false,
    })
    if (!findProduct) {
      return next(new Error('invalid product or out of stock', { cause: 400 }))
    }
    if (req.body.isCart) {
      product = product.toObject()
    }
    product.name = findProduct.name
    product.productPrice = findProduct.priceAfterDiscount
    product.finalPrice = Number.parseFloat(
      findProduct.priceAfterDiscount * product.quantity,
    ).toFixed(2)
    finalProducts.push(product)
    subTotal += parseInt(product.finalPrice)
  }

  paymentMethod == 'cash'
    ? (req.body.orderStatus = 'placed')
    : (req.body.orderStatus = 'pending')

  const orderObject = {
    userId,
    products: finalProducts,
    address,
    phone,
    paymentMethod,
    orderStatus: req.body.orderStatus,
    subTotal,
    couponId: req.body.coupon?._id,
    totalPrice: Number.parseFloat(
      subTotal * (1 - (req.body.coupon?.amount || 0) / 100),
    ).toFixed(2),
  }

  const order = await orderModel.create(orderObject)
  if (order) {
    // increement usageCount => 1
    if (req.body.coupon) {
      // for (const user of req.body.coupon?.usagePerUser) {
      //   if (user.userId.toString() == userId.toString()) {
      //     user.usageCount += 1
      //   }
      // }
      req.body.coupon.usageCount += 1
      await req.body.coupon.save()
    }
    // decrement stock => quantity
    for (const product of req.body.products) {
      await productModel.findByIdAndUpdate(product.productId, {
        $inc: { stock: -parseInt(product.quantity) },
      })
    }
    // remove product from cart
    await cartModel.updateOne(
      { userId },
      {
        $pull: { products: { productId: { $in: productIds } } },
      },
    )


        // generateOrderInvoice
    
        const invoice = {
          shipping: {
            name: req.user.userName.firstName + ' ' + req.user.userName.lastName,
            address: order.address,
            city: 'Cairo',
            state: 'Cairo',
            country: 'Egypt',
            postal_code: 94111,
          },
          items: order.products,
          subtotal: order.subTotal,
          total: order.totalPrice,
          invoice_nr: order._id,
          date: order.createdAt,
        }
    
        //  await createInvoice(invoice, 'invoice.pdf')

        // await sendEmail({
        //   // to: req.user.email,
        //   to: 'sabah.abdelbaset@gmail.com',
        //   message: 'please check you invoice pdf',
        //   subject: 'Order Invoice',
        //   attachments: [{ path: 'invoice.pdf' }],
        // })
        
    // payment

    if (order.paymentMethod == 'card') {
      if (req.body.coupon) {
        const stripe = new Stripe(process.env.STRIPE_SERCET_KEY)
        const coupon = await stripe.coupons.create({
          percent_off: req.body.coupon.amount,
        })
        req.body.couponId = coupon.id
      }
      const session = await payment({
        payment_method_types: [order.paymentMethod],
        mode: 'payment',
        customer_email: req.user.email,
        metadata: {
          type: 'order',
          orderId: order._id.toString(),
        },
        cancel_url: `${process.env.CANCEL_URL}/${order._id}`,
        success_url: `${process.env.SUCCESS_URL}/${order._id}`,
        discounts: req.body.couponId ? [{ coupon: req.body.couponId }] : [],
        line_items: order.products.map((product) => {
          return {
            price_data: {
              currency: 'EGP',
              product_data: {
                name: product.name,
              },
              unit_amount: Math.round(product.productPrice * 100),
            },
            quantity: product.quantity,
          }
        }),
      })
      return res.status(201).json({ message: 'Done', order, url: session.url })
    }
  }
  return res.status(201).json({ message: 'Done', order })
}

// ===========================cancel Order=========================
export const cancelOrder = async (req, res, next) => {
  const { orderId } = req.params
  const { reason } = req.body
  const order = await orderModel.findById(orderId)
  if (
    (order?.orderStatus != 'placed' && order?.paymentMethod == 'cash') ||
    (order?.orderStatus != 'pending' && order?.paymentMethod == 'card')
  ) {
    return next(
      new Error(
        `you canot cancell this order with status ${order.orderStatus}`,
        { cause: 400 },
      ),
    )
  }
  order.orderStatus = 'cancelled'
  order.reason = reason
  order.upadtedBy = req.user._id
  const orderCancelled = await order.save()
  if (orderCancelled) {
    if (order.couponId) {
      const coupon = await couponModel.findById(order.couponId)
      coupon.usageCount -= 1
      // for (const user of coupon?.usagePerUser) {
      //   if (user.userId.toString() == order.userId.toString()) {
      //     user.usageCount -= 1
      //   }
      // }
      await coupon.save()
    }
    // decrement stock => quantity
    for (const product of order.products) {
      await productModel.findByIdAndUpdate(product.productId, {
        $inc: { stock: parseInt(product.quantity) },
      })
    }
    res.status(200).json({ message: 'order cancelled succesfully' })
  }
}

// =================== get Order By Id ============
export const getAllOrders = async (req, res, next) => {
  const orders = await orderModel.find().populate('products.productId')
  if (!orders) {
    return next(new Error('no orders', { cause: 404 }))
  }
  res.status(200).json({ message: 'Done', orders })
}

// ================== update Order Status ============
export const updateOrderStatus = async (req, res, next) => {
  const { orderId } = req.params
  const { status } = req.body
  const order = await orderModel.findById(orderId)
  if (!order) {
    return next(new Error('no order', { cause: 404 }))
  }
  if (
    order.orderStatus == 'delivered' ||
    order.orderStatus == 'cancelled' ||
    order.orderStatus == 'rejected'
  ) {
    return next(new Error('you can not update this order', { cause: 400 }))
  }
  order.orderStatus = status
  order.upadtedBy = req.user._id
  const orderUpdated = await order.save()
  if (orderUpdated) {
    return res.status(200).json({ message: 'order updated succesfully', orderUpdated });
  }
}


/////

export const webHooks = async (req, res, next) => {
  const stripe = new Stripe(process.env.STRIPE_SERCET_KEY)
  const sig = req.headers['stripe-signature']

  let event

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.endpointSecret,
    )
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }
  const {type} = event.data.object.metadata;
  // Handle the event
  if (type === 'donation') {
    if ( event.data.object.metadata.donateId != null ) {
      const { donateId } = event.data.object.metadata;
      if (event.type == 'checkout.session.completed' || event.type == 'checkout.session.async_payment_succeeded') {
  
        await donateModel.findOneAndUpdate({ _id: donateId }, { status: 'closed' })
        return res.status(200).json({ message: 'payment Done' })

    }     return res.status(400).json({ message: 'please try to pay again, or u pay for general Donation' })

    }
  }
  const { orderId } = event.data.object.metadata;
  if (event.type == 'checkout.session.completed' || event.type == 'checkout.session.async_payment_succeeded') {
    await orderModel.findOneAndUpdate(
      { _id: orderId },
      {
        orderStatus: 'confirmed',
      },
    )
    return res.status(200).json({ message: 'Done' })
  }
  await orderModel.findOneAndUpdate(
    { _id: orderId },
    {
      orderStatus: 'payment failed',
    },
  )
  return res.status(400).json({ message: 'please try to pay again' })
}
//////////////