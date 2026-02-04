import type { Request, Response } from 'express';
import User from '../../models/user.js'
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const createToken = (id: string) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret_key', {
        expiresIn: '8h'
    });
};

const registerUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' })

        const user = await User.create({
            name,
            email,
            password,
            role: 'seller'
        });

        const token = createToken(user._id.toString());

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role}
        })
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Email or password is incorrect' });
        }

        const token = createToken(user._id.toString());

        res.status(200).json({
            message: 'Login successful',
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role}
        });

    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export { registerUser, loginUser };