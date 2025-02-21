import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
    const { fullname, email, password } = req.body;
    try {
        if (!fullname || !email || !password) {
            return res.status(400).json({ message: "Please fill in all fields" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullname,
            email,
            password: hashedPassword,
        });

        await newUser.save(); // Önce kullanıcıyı kaydet

        generateToken(newUser._id, res); // Sonra token oluştur

        res.status(201).json({
            _id: newUser._id,
            fullname: newUser.fullname,
            email: newUser.email,
            profilePic: newUser.profilePic,
        });

    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
export const login=(req, res) => {
    res.send("Login Route");
};
export const logout=(req, res) => {
    res.send("Logout Route");
};