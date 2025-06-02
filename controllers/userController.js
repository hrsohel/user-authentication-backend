import User from "../models/User.js";
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
                message: 'This use already exists!'
            });
        }
        
        existingShops[0]?.shops.forEach(shop => {
            if(shops.includes(shop)) alreadyExistingShops.push(shop)
        })
        if(alreadyExistingShops.length > 0) {
                return res.status(400).json({
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
        return res.status(201).json({ message: 'User registered successfully' });
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
            return res.status(404).json({ message: 'User not found' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Incorrect password' });
        }
        const expiresIn = rememberMe ? '7d' : '30m';

        const token = jwt.sign({ userId: user._id }, "my-secret", { expiresIn });

        return res.status(200).json({
            message: 'Login successful',
            token,
            expiresIn
        });
    } catch (error) {
        console.error('Signin error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
}