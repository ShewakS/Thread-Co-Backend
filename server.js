const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
const allowedOrigins = (process.env.CORS_ORIGIN || "").split(",").map(o => o.trim()).filter(Boolean);
app.use(cors({
    origin: (origin, cb) => (!origin || allowedOrigins.includes(origin) ? cb(null, true) : cb(new Error("Not allowed by CORS"))),
    credentials: true
}));

// Health check route
app.get("/", (req, res) => {
    res.json({ message: "ThreadCo Backend API is running", status: "OK" });
});

// Mount routers
const userroutes = require("./Routers/UserRoute");
app.use("/api/user", userroutes);

const productroutes = require("./Routers/ProductRoute");
app.use("/api/products", productroutes);

const orderroutes = require("./Routers/OrderRoute");
app.use("/api/orders", orderroutes);

const offerroutes = require("./Routers/OfferRoute");
app.use("/api/offers", offerroutes);

// Error handling middleware
const { errorHandler, notFound } = require("./Utils/errorHandler");
app.use(notFound);
app.use(errorHandler);

// Seed data constants
const DEFAULT_PRODUCTS = [
  { id: 'p1', name: 'Classic Linen Shirt', category: 'Men', price: 1299, image: 'images/lenin%20shirt.jpg', rating: 4.5, stock: { S: 10, M: 15, L: 8, XL: 5 } },
  { id: 'p2', name: 'Cotton Cargo Shorts', category: 'Men', price: 1499, image: 'images/Cotton%20Cargo%20Shorts.jpg', rating: 4.0, stock: { S: 10, M: 15, L: 8, XL: 5 } },
  { id: 'p3', name: 'Relaxed Beige Blazer', category: 'Women', price: 2399, image: 'images/Relaxed%20Beige%20Blazer.jpg', rating: 4.5, stock: { S: 10, M: 15, L: 8, XL: 5 } },
  { id: 'p4', name: 'Soft Knit Co-ord Set', category: 'Women', price: 2699, image: 'images/Soft%20Knit%20Co-ord%20Set.webp', rating: 5.0, stock: { S: 10, M: 15, L: 8, XL: 5 } },
  { id: 'p5', name: 'Coastal Straw Hat', category: 'Accessories', price: 899, image: 'images/Hat.webp', rating: 3.5, stock: { S: 10, M: 15, L: 8, XL: 5 } },
  { id: 'p6', name: 'Minimal Leather Belt', category: 'Accessories', price: 699, image: 'images/Minimal%20Leather%20Belt.webp', rating: 4.0, stock: { S: 10, M: 15, L: 8, XL: 5 } },
  { id: 'p7', name: 'Daily Denim Jacket', category: 'Men', price: 1999, image: 'images/Daily%20Denim%20Jacket.jpg', rating: 4.5, stock: { S: 10, M: 15, L: 8, XL: 5 } },
  { id: 'p8', name: 'Flow Midi Dress', category: 'Women', price: 2199, image: 'images/Flow%20Midi%20Dress.webp', rating: 4.5, stock: { S: 10, M: 15, L: 8, XL: 5 } },
  { id: 'p9', name: 'Kids Cotton Tee', category: 'Kids', price: 799, image: 'images/download.webp', rating: 4.0, stock: { S: 10, M: 15, L: 8, XL: 5 } },
  { id: 'p10', name: 'Kids Casual Set', category: 'Kids', price: 1299, image: 'images/adv1.jpg', rating: 4.5, stock: { S: 10, M: 15, L: 8, XL: 5 } },
  { id: 'p11', name: "Men's Shirts Collection", category: 'Men', price: 1799, image: 'images/men%20shirts.jpg', rating: 4.0, stock: { S: 10, M: 15, L: 8, XL: 5 } },
  { id: 'p12', name: "Women's Dress", category: 'Women', price: 1999, image: 'images/women%20dress.avif', rating: 4.5, stock: { S: 10, M: 15, L: 8, XL: 5 } }
];

const DEFAULT_ORDERS = [
  { id: 'ORD-3001', customer: 'Aarav', email: 'aarav@threadco.com', total: 2498, status: 'Pending', date: '2026-05-28', address: '123 Park Street, Kolkata', paymentMethod: 'Cash on Delivery', items: [{ id: 'p1', name: 'Classic Linen Shirt', price: 1299, quantity: 1 }, { id: 'p8', name: 'Flow Midi Dress', price: 2199, quantity: 1 }] },
  { id: 'ORD-3002', customer: 'Mira', email: 'mira@threadco.com', total: 1299, status: 'Delivered', date: '2026-05-29', address: '456 MG Road, Bangalore', paymentMethod: 'Card', items: [{ id: 'p1', name: 'Classic Linen Shirt', price: 1299, quantity: 1 }] },
  { id: 'ORD-3003', customer: 'Kabir', email: 'kabir@threadco.com', total: 3598, status: 'Pending', date: '2026-05-30', address: '789 Link Road, Mumbai', paymentMethod: 'UPI', items: [{ id: 'p3', name: 'Relaxed Beige Blazer', price: 2399, quantity: 1 }, { id: 'p10', name: 'Kids Casual Set', price: 1299, quantity: 1 }] },
  { id: 'ORD-3004', customer: 'Riya', email: 'riya@threadco.com', total: 899, status: 'Shipped', date: '2026-06-01', address: '101 Ring Road, Delhi', paymentMethod: 'Cash on Delivery', items: [{ id: 'p5', name: 'Coastal Straw Hat', price: 899, quantity: 1 }] }
];

const DEFAULT_OFFERS = [
  { code: 'SAVE10', discount: 10, startDate: '2026-06-01', endDate: '2026-06-30', active: true, status: 'Active' },
  { code: 'FREESHIP', discount: 0, startDate: '2026-06-01', endDate: '2026-06-30', active: true, status: 'Active' },
  { code: 'SUMMER20', discount: 20, startDate: '2026-06-01', endDate: '2026-08-31', active: true, status: 'Active' }
];

const seedDatabase = async () => {
    try {
        const User = require("./Models/UserModel");
        const Product = require("./Models/ProductModel");
        const Order = require("./Models/OrderModel");
        const Offer = require("./Models/OfferModel");

        // Seed Admin User with hashed password
        const adminEmail = "admin@threadco.com";
        const adminExists = await User.findOne({ email: adminEmail });
        if (!adminExists) {
            const hashedPassword = await bcrypt.hash("admin123", 10);
            await new User({
                firstname: "Thread",
                lastname: "Admin",
                email: adminEmail,
                password: hashedPassword,
                role: "admin",
                phone: "9876543210",
                addresses: []
            }).save();
            console.log(" Admin user seeded (email: admin@threadco.com, password: admin123)");
        }

        // Seed Products
        const productCount = await Product.countDocuments();
        if (productCount === 0) {
            await Product.insertMany(DEFAULT_PRODUCTS);
            console.log(` ${DEFAULT_PRODUCTS.length} products seeded`);
        }

        // Seed Orders
        const orderCount = await Order.countDocuments();
        if (orderCount === 0) {
            await Order.insertMany(DEFAULT_ORDERS);
            console.log(` ${DEFAULT_ORDERS.length} orders seeded`);
        }

        // Seed Offers
        const offerCount = await Offer.countDocuments();
        if (offerCount === 0) {
            await Offer.insertMany(DEFAULT_OFFERS);
            console.log(` ${DEFAULT_OFFERS.length} offers seeded`);
        }
    } catch (err) {
        console.error(" Error seeding database:", err.message);
    }
};

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL)
    .then(async () => { 
        console.log("\n✓ Connected to MongoDB successfully"); 
        await seedDatabase();
        
        // Start server after DB connection
        app.listen(PORT, () => {
            console.log(`\n Server running on port ${PORT}`);
            console.log(`API URL: ${process.env.BACKEND_URL || `http://localhost:${PORT}`}`);
            console.log("\n=== ThreadCo Backend Ready ===");
        });
    })
    .catch((err) => { 
        console.error("\n MongoDB connection failed:", err.message); 
        process.exit(1);
    });