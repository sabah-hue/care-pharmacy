## Care Pharmacy
Backend REST API for the Care Pharmacy platform built with Node.js, Express, and MongoDB.

👨‍💻 Author
    Sabah Ahmed - GitHub: Sabah-hue - sabah.abdelbaset@gmail.com

## 🛠️ Tech Stack
Node.js - JavaScript runtime
Express.js - Web framework
MongoDB - NoSQL database
Mongoose - MongoDB ODM
JWT - Authentication & authorization
Joi - Request validation
Multer - File upload handling
Cloudinary - Cloud storage for images
Bcrypt - Password hashing
Morgan - HTTP request logger
Nodemailer - Email sending
Stripe - Payment processing

## 📁 Project Structure
care-pharmacy/
├── DB/
│   ├── model/           # Database models
│   └── connection.js    # MongoDB connection
├── src/
│   ├── middleware/      # Middleware functions
│   │   ├── auth.js      # Authentication middleware  
│   │   └── validation.js # Request validation
│   ├── modules/         # Feature modules
│   │   ├── auth/        # Authentication module
│   │   ├── blog/        # blog articles
│   │   ├── coupon/      # Coupone discount
│   │   ├── reviews/     # review shipping product
│   │   ├── user/        # User management
│   │   ├── category/    # Categories management
│   │   ├── product/     # Products management
│   │   ├── cart/        # Shopping cart
│   │   ├── order/       # Order processing
│   │   └── wishlist/    # Wishlist management
│   ├── utils/           # Utility functions
│   │   ├── email.js     # Email templates & sending
│   │   ├── apiFeatures.js # API features (pagination, filtering)
│   │   ├── cloudinary.js  # Cloudinary configuration
│   │   └── errorHandling.js # Error handling
│   └── app.js           # Express app setup
├── config
│   └── config.env       # Environment variables                 
├── index.js             # Application entry point
└── package.json         # Dependencies & scripts

## 🚀 Getting Started
Prerequisites
Node.js (v14 or higher)
MongoDB
npm or yarn

## Installation
1. Clone the repository:
git clone https://github.com/sabah-hue/care-pharmacy.git
cd care-pharmacy

2. Install dependencies:
npm install

3.Set up environment variables: Create a config folder inside it add config.env file in the root directory.

4. Start the server:
    # Development mode
        npm run dev
    # Production mode
        npm start

## 📝 API Documentation
    The API documentation is available at postman.
    link: https://www.postman.com/supply-physicist-71661888/workspace/my-workspace/collection/40111362-4e1532ae-a13c-435c-aeff-86b7d2131506?action=share&creator=40186319


🔐 Authentication Flow
        Registration: User signs up with email/password
        Confirmation: Email sent with verification link/code
        Login: User provides credentials and receives JWT
        Authorization: JWT used for protected route access
        Password Reset: User requests reset code via email

📊 Database Models
    User: Personal information, auth details, roles
    Category: Product categorization
    Product: Product details, pricing, stock
    Cart: Shopping cart items
    Order: Order details, shipping, payment
    Review: Product reviews and ratings
    Wishlist: User's saved products
    Coupone: discount codes
    Donate: donation by money or device or medicine

🚢 Deployment
    using Versel
    link: https://care-pharmacy.vercel.app/


🤝 Acknowledgements
    MongoDB Atlas for database hosting
    Cloudinary for image storage
    Stripe for payment processing

📄 License
    This project is licensed under the MIT License.