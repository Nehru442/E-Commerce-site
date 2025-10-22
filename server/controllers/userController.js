import bcrypt from "bcryptjs";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import 'dotenv/config.js'

export const register = async (req , res) =>{
    try {
        const {name,email,password} = req.body;

        if(!name || !email || !password){
            return res.json({ success: false , message:'Missing required fields'})
        }

        const existingUser = await User.findOne({email});

        if(existingUser){
            return res.json({ success: false , message:'User already exists'})
        }
       
        const hashedPassword = await bcrypt.hash(password,10);
        const user = await User.create({name,email,password:hashedPassword})
        
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '5d'})

        res.cookie('token' , token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict' ,
            maxAge : 5 * 24 * 60 * 60 * 1000 // 5 days

        })
        return res.json({ success: true , message:'User registered successfully', user:{name:user.name , email:user.email }})
    } catch (error) {
        console.log(error.message)
        return res.json({ success: false , message: error.message})
    }
} 

// api/user/login

export const login = async (req ,res) =>{
    try {
        const {email,password} = req.body;
          
        if(!email || !password)
            return res.json({ success : false , message: "Email and password are required"})

        const user = await User.findOne({email});

        if(!user){
            return res.json({ success : false , message: "Invalid email or password"})
        }

        const isMatch = await bcrypt.compare(password , user.password);

        if(!isMatch){
            return res.json({ success : false , message: "Invalid email or password"})
        }
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '5d'})

        res.cookie('token' , token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict' ,
            maxAge : 5 * 24 * 60 * 60 * 1000 // 5 days

        })
        return res.json({ success: true , message:'User registered successfully', user:{name:user.name , email:user.email }})

    } catch (error) {
         console.log(error.message)
        return res.json({ success: false , message: error.message})  
    } 
}   

// api/user/is-auth

export const isAuth = async (req,res) => {
    try {

        const userId = req.userId || (req.user && req.user._id);

        if(!userId) {
            return res.json({ success: false , message: 'Unauthorized'})
        }

        const user = await User.findById(userId).select('-password');
        
        return res.json({success : true , user, })
    } catch (error) {
          console.log(error.message)
        return res.json({ success: false , message: error.message})
    }
}

//api/user/logout
export const logout = async (req,res) => {
    try {
        res.clearCookie('token', {
            httpOnly:true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        })
        return res.json({ success: true , message: 'Logged out successfully'})
    } catch (error) {
          console.log(error.message)
        return res.json({ success: false , message: error.message})
    }
}