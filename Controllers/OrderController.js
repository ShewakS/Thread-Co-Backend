const Order = require("../Models/OrderModel");
const Product = require("../Models/ProductModel");

const getAllOrders = async (req, res) => {
    try {
        const { email, status } = req.query;
        const filter = {};
        if (email) filter.email = email;
        if (status) filter.status = status;
        
        const orders = await Order.find(filter).sort({ _id: -1 });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "Error fetching orders", error: error.message });
    }
};

const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findOne({ id });
        if (!order) {
            return res.status(404).json({ message: "Order not found." });
        }
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: "Error fetching order", error: error.message });
    }
};

const placeOrder = async (req, res) => {
    try {
        const {
            customer,
            email,
            total,
            address,
            paymentMethod,
            paymentId,
            paymentStatus,
            razorpayPaymentId,
            shippingMethod,
            shippingAmount,
            promoCode,
            discount,
            items
        } = req.body;
        
        if (!customer || !email || !total || !items || items.length === 0) {
            return res.status(400).json({ message: "Required order fields missing" });
        }
        
        for (const item of items) {
            const product = await Product.findOne({ id: item.id });
            if (product && item.size && product.stock) {
                if (product.stock[item.size] < item.quantity) {
                    return res.status(400).json({ 
                        message: `Insufficient stock for ${item.name} in size ${item.size}` 
                    });
                }
                product.stock[item.size] -= item.quantity;
                product.markModified('stock');
                await product.save();
            }
        }
        
        const id = `ORD-${Date.now().toString().slice(-6)}`;
        
        const newOrder = new Order({
            id,
            customer,
            email,
            total: Number(total),
            status: "Placed",
            date: new Date().toISOString().split('T')[0],
            address: address || "No Address Provided",
            paymentMethod: paymentMethod || "Cash on Delivery",
            paymentId: paymentId || null,
            paymentStatus: paymentStatus || (paymentMethod === "Cash on Delivery" ? "COD" : "Paid"),
            razorpayPaymentId: razorpayPaymentId || "",
            shippingMethod: shippingMethod || "standard",
            shippingAmount: Number(shippingAmount || 0),
            promoCode: promoCode || "",
            discount: Number(discount || 0),
            items
        });
        
        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (error) {
        res.status(500).json({ message: "Error placing order", error: error.message });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        const updatedOrder = await Order.findOneAndUpdate(
            { id },
            { $set: { status } },
            { new: true }
        );
        
        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found." });
        }
        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: "Error updating order status", error: error.message });
    }
};

const deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Order.findOneAndDelete({ id });
        if (!result) {
            return res.status(404).json({ message: "Order not found." });
        }
        res.status(200).json({ message: "Order deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: "Error deleting order", error: error.message });
    }
};

module.exports = {
    getAllOrders,
    getOrderById,
    placeOrder,
    updateOrderStatus,
    deleteOrder
};
