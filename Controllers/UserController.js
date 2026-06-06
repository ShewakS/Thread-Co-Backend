const User = require("../Models/UserModel");
const Wishlist = require("../Models/WishlistModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const signupUser = async (req, res) => {
    try {
        let { firstname, lastname, name, email, phone, password } = req.body;
        
        if (!firstname && name) {
            const parts = name.trim().split(/\s+/);
            firstname = parts[0] || "";
            lastname = parts.slice(1).join(" ") || "";
        }
        
        if (!firstname || !email || !password) {
            return res.status(400).json({ message: "Required fields missing" });
        }
        
        const normalizedEmail = String(email).trim().toLowerCase();
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(400).json({ message: "An account with this email already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const NewUser = new User({
            firstname,
            lastname: lastname || "User",
            email: normalizedEmail,
            phone: phone || "",
            password: hashedPassword,
        });
        const SavedUser = await NewUser.save();
        
        const token = jwt.sign(
            { id: SavedUser._id, email: SavedUser.email, role: SavedUser.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );
        
        res.status(200).json({
            message: "User Registered successfully",
            token,
            data: {
                id: SavedUser._id,
                firstname: SavedUser.firstname,
                lastname: SavedUser.lastname,
                email: SavedUser.email,
                phone: SavedUser.phone,
                role: SavedUser.role,
                cart: SavedUser.cart,
                wishlist: SavedUser.wishlist,
                addresses: SavedUser.addresses
            }
        });
    } catch (error) {
        res.status(500).json({
            message: "Error Registering User",
            error: error.message,
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password required" });
        }
        
        const normalizedEmail = String(email).trim().toLowerCase();
        const user = await User.findOne({ email: normalizedEmail });
        
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials." });
        }
        
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials." });
        }
        
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );
        
        res.status(200).json({
            message: "Login successful",
            token,
            data: {
                id: user._id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                phone: user.phone,
                role: user.role,
                cart: user.cart,
                wishlist: user.wishlist,
                addresses: user.addresses
            }
        });
    } catch (error) {
        res.status(500).json({
            message: "Error logging in user",
            error: error.message
        });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching users",
            error: error.message
        });
    }
};

const updateUserProfile = async (req, res) => {
    try {
        const { email, firstname, lastname, phone, addresses } = req.body;
        const normalizedEmail = String(email).trim().toLowerCase();
        const user = await User.findOneAndUpdate(
            { email: normalizedEmail },
            { $set: { firstname, lastname, phone, addresses } },
            { new: true }
        );
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        res.status(200).json({
            message: "Profile updated successfully",
            data: user
        });
    } catch (error) {
        res.status(500).json({
            message: "Error updating profile",
            error: error.message
        });
    }
};

const syncUserCartAndWishlist = async (req, res) => {
    try {
        const { email, cart, wishlist } = req.body;
        const normalizedEmail = String(email).trim().toLowerCase();
        const user = await User.findOneAndUpdate(
            { email: normalizedEmail },
            { $set: { cart, wishlist } },
            { new: true }
        );
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        await Wishlist.findOneAndUpdate(
            { userEmail: normalizedEmail },
            { $set: { items: Array.isArray(wishlist) ? wishlist : [] } },
            { upsert: true }
        );

        res.status(200).json({
            message: "Cart and wishlist synced successfully",
            data: user
        });
    } catch (error) {
        res.status(500).json({
            message: "Error syncing cart/wishlist",
            error: error.message
        });
    }
};

const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching user",
            error: error.message
        });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await User.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).json({ message: "User not found." });
        }
        res.status(200).json({ message: "User deleted successfully." });
    } catch (error) {
        res.status(500).json({
            message: "Error deleting user",
            error: error.message
        });
    }
};

module.exports = {
    signupUser,
    loginUser,
    getAllUsers,
    getUserById,
    updateUserProfile,
    syncUserCartAndWishlist,
    deleteUser
};
