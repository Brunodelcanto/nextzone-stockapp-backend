import type { Request, Response } from "express"; 
import Product from "../../models/product.js";

const createProducts = async (req: Request, res: Response) => {
    try {
        const { name } = req.body;

        const existingProduct = await Product.findOne ({
            name: { $regex: new RegExp(`^${name}$`, 'i')}
        });

        if (existingProduct) {
            return res.status(400).json({
                message: 'Product with this name already exists',
                error: true,
            });
        }

        const product = new Product(req.body);
        await product.save();

        return res.status(201).json({
            message: 'Product created successfully',
            data: product,
            error: false,
        });
        
    } catch (error: any) {
        return res.status(400).json({
            error: error.message
        });
    }
}

const getProducts = async (req: Request, res: Response) => {
    try {
        const products = await Product.find().populate('category', 'name');

        return res.status(200).json({
            message: 'Products retrieved successfully',
            data: products,
            error: false,
        });
    } catch (error: any) {
        return res.status(400).json({
            error: error.message
        });
    }
}

export {
    createProducts,
    getProducts
}