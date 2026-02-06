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

const deleteProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndDelete(id);

        if(!product) {
            return res.status(400).json({
                message: 'Product not found',
                error: true,
            })
        }

        return res.status(200).json({
            message: 'Product deleted successfully',
            data: product,
            error: false
        })

    } catch (error: any) {
        return res.status(400).json({
            error: error.message
        })
    }
}

const updateProduct = async (req: Request, res: Response) => {
    try {
        const { name, category, minStockAlert, image } = req.body;
        const  id  = req.params.id as string;

        const existingProduct = await Product.findOne ({
            name: { $regex: new RegExp(`^${name}$`, 'i')},
            _id: { $ne: id }
        })

        if (existingProduct) {
            return res.status(400).json({
                message: 'Product with this name already exists',
                error: true
            })
        }

        const product = await Product.findByIdAndUpdate(
            id,
            {
                name, category, minStockAlert, image
            },
            { new: true }
        )
           return res.status(200).json({
            message: 'Product updated successfully',
            data: product,
            error: false
        })
    } catch (error: any) {
        return res.status(400).json({
            error: error.message
        })
    }
}

const deactivateProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndUpdate(
            id,
            {
                isActive: false
            },
            {new: true}
        )
        if (!product) {
            return res.status(404).json({
                message: 'Product not found',
                error: true,
            })
        }
        return res.status(200).json({
            message: 'Product deactivated successfully',
            error: false
        })
    } catch (error: any) {
        return res.status(400).json({
            error: error.message
        })
    }
}

const activateProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndUpdate(
            id,
            {
                isActive: true
            },
            {new: true}
        )
        if (!product) {
            return res.status(404).json({
                message: 'Product not found',
                error: true,
            })
        }
        return res.status(200).json({
            message: 'Product activated successfully',
            error: false
        })
    } catch (error: any) {
        return res.status(400).json({
            error: error.message
        })
    }
}

const updateVariantStock = async (req: Request, res: Response) => {
    try {
        const  id = req.params.id as string;
        const { color, quantity } = req.body;

        const updateProduct = await Product.findOneAndUpdate(
            {_id: id, 'variants.color': color},
            { $inc: { 'variants.$.amount': quantity } },
            { new: true }
        ).populate('category', 'name');

        if (!updateProduct) {
            return res.status(404).json({
                message: 'Product or variant not found',
                error: true,
            });
        }

        return res.status(200).json({
            message: 'Variant stock updated successfully',
            data: updateProduct,
            error: false,
        });
    } catch (error: any) {
        return res.status(400).json({
            error: error.message
        })
    }
}

export {
    createProducts,
    getProducts,
    deleteProduct,
    updateProduct,
    deactivateProduct,
    activateProduct,
    updateVariantStock
}