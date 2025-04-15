// import fs from 'fs'
// import PDFDocument from 'pdfkit'

// export async function createInvoice(invoice, path) {
//   let doc = new PDFDocument({ size: 'A4', margin: 50 })

//   generateHeader(doc)
//   generateCustomerInformation(doc, invoice)
//   generateInvoiceTable(doc, invoice)
//   generateFooter(doc)

//   doc.end()
//   doc.pipe(fs.createWriteStream(path))
// }

// function generateHeader(doc) {
//   doc
//     .image('https://res.cloudinary.com/dps8pco1z/image/upload/v1743806515/Pharmacy/Logo_smaxb7.png', 50, 45, { width: 50 })
//     .fillColor('#444444')
//     .fontSize(20)
//     .text('care+ pharmacy', 110, 45)
//     .fillColor('#09c')
//     .fontSize(10)
//     .text('care+ pharmacy', 200, 50, { align: 'right' })
//     .text('6 Dokkii street', 200, 65, { align: 'right' })
//     .text('Cairo,Egypt', 200, 80, { align: 'right' })
//     .moveDown()
// }

// function generateCustomerInformation(doc, invoice) {
//   doc.fillColor('#444444').fontSize(20).text('Invoice', 50, 160)

//   generateHr(doc, 185)

//   const customerInformationTop = 200

//   doc
//     .fontSize(10)
//     .text('Invoice Number:', 50, customerInformationTop)
//     .font('Helvetica-Bold')
//     .text(invoice.invoice_nr, 150, customerInformationTop)
//     .font('Helvetica')
//     .text('Invoice Date:', 50, customerInformationTop + 30)
//     .text(formatDate(new Date(invoice.date)), 150, customerInformationTop + 30)
//     .font('Helvetica-Bold')
//     .text(invoice.shipping.name, 300, customerInformationTop)
//     .font('Helvetica')
//     .text(invoice.shipping.address, 300, customerInformationTop + 15)
//     .text(
//       invoice.shipping.city +
//         ', ' +
//         invoice.shipping.state +
//         ', ' +
//         invoice.shipping.country,
//       300,
//       customerInformationTop + 30,
//     )
//     .moveDown()

//   generateHr(doc, 252)
// }

// function generateInvoiceTable(doc, invoice) {
//   let i
//   const invoiceTableTop = 330

//   doc.font('Helvetica-Bold')
//   generateTableRow(
//     doc,
//     invoiceTableTop,
//     'Item',
//     'Unit Cost',
//     'Quantity',
//     'Line Total',
//   )
//   generateHr(doc, invoiceTableTop + 20)
//   doc.font('Helvetica')

//   for (i = 0; i < invoice.items.length; i++) {
//     const item = invoice.items[i]
//     const position = invoiceTableTop + (i + 1) * 30
//     generateTableRow(
//       doc,
//       position,
//       item.name,
//       formatCurrency(item.productPrice),
//       item.quantity,
//       formatCurrency(item.finalPrice),
//     )

//     generateHr(doc, position + 20)
//   }

//   const subtotalPosition = invoiceTableTop + (i + 1) * 30
//   generateTableRow(
//     doc,
//     subtotalPosition,
//     '',
//     '',
//     'Subtotal',
//     '',
//     formatCurrency(invoice.subtotal),
//   )

//   const paidToDatePosition = subtotalPosition + 20
//   generateTableRow(
//     doc,
//     paidToDatePosition,
//     '',
//     '',
//     'Paid To Date',
//     '',
//     formatCurrency(invoice.total),
//   )

//   doc.font('Helvetica')
// }

// function generateFooter(doc) {
//   doc
//     .fontSize(10)
//     .text(
//       'Payment is due within 14 days. Thank you for your business.',
//       50,
//       780,
//       { align: 'center', width: 500 },
//     )
// }

// function generateTableRow(
//   doc,
//   y,
//   item,
//   description,
//   unitCost,
//   quantity,
//   lineTotal,
// ) {
//   doc
//     .fontSize(10)
//     .text(item, 50, y)
//     .text(description, 150, y)
//     .text(unitCost, 280, y, { width: 90, align: 'right' })
//     .text(quantity, 370, y, { width: 90, align: 'right' })
//     .text(lineTotal, 0, y, { align: 'right' })
// }

// function generateHr(doc, y) {
//   doc.strokeColor('#aaaaaa').lineWidth(1).moveTo(50, y).lineTo(550, y).stroke()
// }

// function formatCurrency(cents) {
//   return '$' + cents
// }

// function formatDate(date) {
//   const day = date.getDate()
//   const month = date.getMonth() + 1
//   const year = date.getFullYear()

//   return year + '/' + month + '/' + day
// }

// // export default createInvoice


import fs from 'fs'
import axios from 'axios'
import PDFDocument from 'pdfkit'

export async function createInvoice(invoice, path) {
  const doc = new PDFDocument({ size: 'A4', margin: 50 })

  await generateHeader(doc)
  generateCustomerInformation(doc, invoice)
  generateInvoiceTable(doc, invoice)
  generateFooter(doc)

  doc.end()
  doc.pipe(fs.createWriteStream(path))
}

async function generateHeader(doc) {
  const imageUrl = 'https://res.cloudinary.com/dps8pco1z/image/upload/v1743806515/Pharmacy/Logo_smaxb7.png'

  try {
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' })
    const imageBuffer = Buffer.from(response.data, 'base64')

    doc
      .image(imageBuffer, 50, 45, { width: 50 })
      .fillColor('#444444')
      .fontSize(20)
      .text('care+ pharmacy', 110, 45)
      .fillColor('#09c')
      .fontSize(10)
      .text('care+ pharmacy', 200, 50, { align: 'right' })
      .text('6 Dokkii street', 200, 65, { align: 'right' })
      .text('Cairo, Egypt', 200, 80, { align: 'right' })
      .moveDown()
  } catch (error) {
    console.error('Error loading image:', error.message)
  }
}

function generateCustomerInformation(doc, invoice) {
  doc.fillColor('#444444').fontSize(20).text('Invoice', 50, 160)

  generateHr(doc, 185)

  const top = 200

  doc
    .fontSize(10)
    .text('Invoice Number:', 50, top)
    .font('Helvetica-Bold')
    .text(invoice.invoice_nr, 150, top)
    .font('Helvetica')
    .text('Invoice Date:', 50, top + 30)
    .text(formatDate(new Date(invoice.date)), 150, top + 30)
    .font('Helvetica-Bold')
    .text(invoice.shipping.name, 300, top)
    .font('Helvetica')
    .text(invoice.shipping.address, 300, top + 15)
    .text(
      `${invoice.shipping.city}, ${invoice.shipping.state}, ${invoice.shipping.country},
      300,
      top + 30`
    )
    .moveDown()

  generateHr(doc, 252)
}

function generateInvoiceTable(doc, invoice) {
  let i
  const top = 330

  doc.font('Helvetica-Bold')
  generateTableRow(doc, top, 'Item', 'Unit Cost', 'Quantity', 'Line Total')
  generateHr(doc, top + 20)
  doc.font('Helvetica')

  for (i = 0; i < invoice.items.length; i++) {
    const item = invoice.items[i]
    const position = top + (i + 1) * 30
    generateTableRow(
      doc,
      position,
      item.name,
      formatCurrency(item.productPrice),
      item.quantity,
      formatCurrency(item.finalPrice)
    )
    generateHr(doc, position + 20)
  }

  const subtotalPosition = top + (i + 1) * 30
  generateTableRow(doc, subtotalPosition, '', '', 'Subtotal', formatCurrency(invoice.subtotal))

  const paidPosition = subtotalPosition + 20
  generateTableRow(doc, paidPosition, '', '', 'Paid To Date', formatCurrency(invoice.total))
}

function generateFooter(doc) {
  doc
    .fontSize(10)
    .text('Payment is due within 14 days. Thank you for your business.', 50, 780, {
      align: 'center',
      width: 500
    })
}

function generateTableRow(doc, y, item, unitCost, quantity, lineTotal) {
  doc
    .fontSize(10)
    .text(item, 50, y)
    .text(unitCost, 280, y, { width: 90, align: 'right' })
    .text(quantity, 370, y, { width: 90, align: 'right' })
    .text(lineTotal, 0, y, { align: 'right' })
}

function generateHr(doc, y) {
  doc.strokeColor('#aaaaaa').lineWidth(1).moveTo(50, y).lineTo(550, y).stroke()
}

function formatCurrency(amount) {
  return '$' + amount.toFixed(2)
}

function formatDate(date) {
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()
  return ${year}/${month}/${day}
}