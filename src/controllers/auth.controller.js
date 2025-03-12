import User from "../models/user.model.js";
import { generateToken } from "../lib/utils.js";
import Order from "../models/order.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";
import Captain from "../models/captain.model.js"

export const signup = async (req, res)=>{
    try {
        const { fullName, username, email, password } = req.body;
        if (!username || !email || !password || !fullName) {
            return res.status(400).json({ error: "All fields are required" });
        }
        if(password.length < 6){
            return res.status(400).json({ error: "Password must be at least 6 characters" });
        }

        const user = await User.findOne({ email });
        if(user) return res.status(400).json({ error: "User already exists" });
        
        const salt = await bcrypt.genSalt(10);
        const hashedpassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            username,
            email,
            password: hashedpassword,
        });

        if(newUser){
            //generating token here
            generateToken(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                username: newUser.username,
                email: newUser.email,
                profilePic: newUser.profilePic
            });
            
        } else {
            res.status(400).json({ error: "Invalid user data" });
        }
    } catch (error) {
        console.log("error in signup", error.message);
        res.status(500).json({message:"Internal server error"});
    }
};


export const login = async (req, res)=>{
    try {
        const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }
    const user = await Captain.findOne({ email });
    if(!user) return res.status(400).json({ error: "User does not exist or Invalid Credentials" });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if(!isPasswordCorrect) return res.status(400).json({ error: "Invalid Credentials" });

    generateToken(user._id, res);

    res.status(200).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        profilePic: user.profilePic
    });

    } catch (error) {
        console.log("error in login", error.message);
        res.status(500).json({message:"Internal server error"});
    }
}


export const logout = (req, res)=>{
    try {
        res.status(201).json({message:"logout successfully"});
    } catch (error) {
        console.log("error in logout", error.message);
        res.status(500).json({message:"Internal server error"});
        
    }
};

export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("error in checking auth", error.message);
        res.status(500).json({message:"Internal server error"});        
    }
};

export const captainsignup = async (req, res) => {
    try {
        const { fullName, username, email, password, vehicle } = req.body;
        if (!username || !email || !password || !fullName) {
            return res.status(400).json({ error: "All fields are required" });
        }
        if (!vehicle.number || !vehicle.name) {
            return res.status(400).json({ error: "All fields are required" });
        }

        if(password.length < 6){
            return res.status(400).json({ error: "Password must be at least 6 characters" });
        }

        const captain = await Captain.findOne({ email });
        if(captain) return res.status(400).json({ error: "User already exists" });
        
        const salt = await bcrypt.genSalt(10);
        const hashedpassword = await bcrypt.hash(password, salt);

        const newCaptain = new Captain({
            fullName,
            username,
            email,
            password: hashedpassword,
            vehicle:{
                number:vehicle.number,
                name:vehicle.name
            }
        });

        if(newCaptain){
            //generating token here
            generateToken(newCaptain._id, res);
            await newCaptain.save();

            res.status(201).json({
                _id: newCaptain._id,
                fullName: newCaptain.fullName,
                username: newCaptain.username,
                email: newCaptain.email,
                profilePic: newCaptain.profilePic,
                vehicle: {
                    color: newCaptain.vehicle.color,
                    number: newCaptain.vehicle.number,
                    name: newCaptain.vehicle.name
                },
            });
            
        } else {
            res.status(400).json({ error: "Invalid user data" });
        }
    } catch (error) {
        console.log("error in signup", error.message);
        res.status(500).json({message:"Internal server error"});
    }
};


export const captainlogin = async (req, res) => {
    try {
        const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }
    const captain = await Captain.findOne({ email });
    if(!captain) return res.status(400).json({ error: "Captain does not exist or Invalid Credentials" });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if(!isPasswordCorrect) return res.status(400).json({ error: "Invalid Credentials" });

    generateToken(captain._id, res);

    res.status(200).json({
        _id: captain._id,
        username: captain.username,
        email: captain.email,
        profilePic: captain.profilePic
    });

    } catch (error) {
        console.log("error in login", error.message);
        res.status(500).json({message:"Internal server error"});
    }
}

