import User from "../models/User.js";
import Session from "../models/Session.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const addUser = async (req, res) => {
    try {
        const alreadyExistingShops = []
        const { username, password, shops } = req.body;
        const [existingUsers, existingShops] = await Promise.all([
            User.findOne({username}),
            User.find({ shops: { $in: shops } }, {shops: 1})
        ]);
        if(existingUsers) {
                return res.status(400).json({
                    success: false,
                    message: 'This use already exists!'
            });
        }
        
        existingShops[0]?.shops.forEach(shop => {
            if(shops.includes(shop)) alreadyExistingShops.push(shop)
        })
        if(alreadyExistingShops.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Some shops already taken!',
                    alreadyExistingShops
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            password: hashedPassword,
            shops
        });

        await newUser.save();
        return res.status(201).json({ success: true, message: 'User registered successfully' });
    } catch (error) {
        console.error('Signin error:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

export const loginUser = async (req, res) => {
    try {
        const { username, password, rememberMe } = req.body;
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({success: false, message: 'User not found' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({success: false, message: 'Incorrect password' });
        }
        const expiresIn = rememberMe ? '7d' : '30m';

        const token = jwt.sign({ userId: user._id }, "my-secret", { expiresIn });
        user.userIdBase64 = Buffer.from(user?._id).toString('base64');
        await Promise.all([
            Session.findOneAndUpdate(
                {userId: user?._id},
                {$set: {token}},
                { upsert: true, new: true }
            ),
            user.save()
        ])
        res.cookie("user-cookie", user.userIdBase64, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", 
            sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
            maxAge: rememberMe ? 7 * 24 * 3600 * 1000 : 30 * 60 * 1000,
        });
        return res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            crypted: user.userIdBase64,
            expiresIn
        });
    } catch (error) {
        console.error('Signin error:', error);
        return res.status(500).json({ success: false, message: error });
    }
}

export const getAllUser = async (req, res) => {
    try {
        const user = await User.find({}, {password: 0})
        return res.json({message: user})
    } catch (error) {
        console.error('user fetching error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
}

export const getSingleUser = async (req, res) => {
    try {
        const userId = req.user.userId
        const userData = await User.findById(userId, {password: 0})
        return res.json({success: true, data: userData, cookie: req.cookies})
    } catch (error) {
        console.error('single user fetching error:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
}

export const authenticatesubdomain = async (req, res) => {
    try {
        const {v} = req.body
        const original = Buffer.from(v, 'base64url').toString();
        const sessionData = await Session.findOne({userId: original})
        if(!sessionData) {
            return res.json({success: false, message: "you are not authorized!"})
        }
        const {token} = await Session.findOne({userId: original})
        const {userId} = jwt.verify(token, "my-secret");
        const userData = await User.findById(userId, {password: 0})
        return res.json({success: true, message: "You have access!", data: userData})
    } catch (err) {
        console.log(err)
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: 'Token expired' });
        } else if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ success: false, message: 'Invalid token' });
        } else {
            return res.status(401).json({ success: false, message: 'Authentication failed' });
        }
    }
}

export const logoutUser = async (req, res) => {
    try {
        const base64 = req.cookies["user-cookie"]
        const original = Buffer.from(base64, 'base64url').toString();
        await Session.deleteOne({userId: original})
        return res.json({success: true, message: "You have access!"})
    } catch (error) {
        console.error('logout error:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
}