import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

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
            profilePicture: newUser.profilePicture,
        });

    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
export const login= async   (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "İnvalid credentials" });
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "İnvalid credentials" });
        }
        generateToken(user._id, res);
        res.status(200).json({
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            profilePic: user.profilePic,
        });

        
    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
        
    }
};
export const logout=(req, res) => {

    try {
        res.cookie("jwt", "", {maxAge:0})
        res.status(200).json({message:"User logged out"});
        
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
        
    }
};
export const updateProfile=async  (req, res) => {
    try {
        const {profilePicture} = req.body;
        const userId=req.user._id;
        

        if (!profilePicture) {
            return res.status(400).json({message:"Profile picture provided"});
        }
        

        const uploadResponse=await cloudinary.uploader.upload(profilePicture)
        const updateUser= await User.findByIdAndUpdate(userId, {profilePicture:uploadResponse.secure_url}, {new:true});
        res.status(200).json(updateUser)
        
     } catch (error) {
        console.log("Error in updateProfile controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
        
    }

};
export const checkAuth=(req, res) => {
    try {
        res.status(200).json(req.user);
        
    } catch (error) {
        console.log("Error in checkAuth controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
        
    }
}