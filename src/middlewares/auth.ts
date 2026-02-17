import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

interface AuthenticatedRequest extends Request {
    userId?: string;
}

export const protect = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    let token = req.cookies?.jwt || req.headers.authorization?.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'No autorizado' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key') as { id: string };
        req.userId = decoded.id;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token inválido' });
    }
};

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key') as { id: string};

        (req as any).userId = decoded.id;
        next();

    } catch (error) {
        return res.status(401).json({ message: 'Invalid token or token expired' });
    }
}

export const isAdmin = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.userId);
        if (user && (user.role === 'admin' || user.role === 'developer')) {
            next();
        } else {
            res.status(403).json({ message: 'Acceso denegado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error de validación' });
    }
}