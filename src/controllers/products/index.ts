import type { Request, Response } from "express"; 
import Product from "../../models/product.js"
import {cloudinary } from "../../config/cloudinary.js";

interface MulterRequest extends Request {
    file?: any;
}

const createProducts = async (req: MulterRequest, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: 'Image is required',
                error: true,
            });
        }

        if (typeof req.body.variants === 'string') {
            req.body.variants = JSON.parse(req.body.variants);
        }

        const { name, category, variants, minStockAlert } = req.body;

        const existingProduct = await Product.findOne({
            name: { $regex: new RegExp(`^${name}$`, 'i') }
        });

        if (existingProduct) {
            return res.status(400).json({
                message: 'Product with this name already exists',
                error: true,
            });
        }
        const product = new Product({
            name,
            category,
            minStockAlert,
            variants: typeof variants === 'string' ? JSON.parse(variants) : variants,
            image: {
                url: (req.file as any).path,
                public_id: (req.file as any).filename
            }
        });

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
        const products = await Product.find()
            .populate('category', 'name')
            .populate('variants.color');

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

const getProductById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id)
            .populate('category', 'name')
             .populate('variants.color');  

        if (!product) {
            return res.status(404).json({
                message: 'Product not found',
                error: true
            });
        }

        return res.status(200).json({
            message: 'Product retrieved successfully',
            data: product,
            error: false
        });
    } catch (error: any) {
        return res.status(500).json({
            message: 'Error retrieving product',
            error: error.message
        });
    }
};

const deleteProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);

        if(!product) {
            return res.status(400).json({
                message: 'Product not found',
                error: true,
            })
        }

        if (product.image?.public_id) {
            await cloudinary.uploader.destroy(product.image.public_id);
        }

        await Product.findByIdAndDelete(id);

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
        const id = req.params.id as string;
        const { name, category, minStockAlert, variants } = req.body;

        const existingProduct = await Product.findOne({
            name: { $regex: new RegExp(`^${name}$`, 'i') },
            _id: { $ne: id } 
        });

        if (existingProduct) {
            return res.status(400).json({
                message: 'Product with this name already exists',
                error: true
            });
        }
        const updateData: any = {
            name,
            category,
            minStockAlert,
        };

        if (variants) {
            updateData.variants = typeof variants === 'string' ? JSON.parse(variants) : variants;
        }


        if (req.file) {
            console.log("Archivo recibido:", req.file); 
            updateData.image = {
                url: (req.file as any).path || (req.file as any).secure_url, 
                public_id: (req.file as any).filename || (req.file as any).public_id
            };
        }

        const product = await Product.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        ).populate('category', 'name').populate('variants.color');

        if (!product) {
            return res.status(404).json({
                message: 'Product not found',
                error: true
            });
        }

        return res.status(200).json({
            message: 'Product updated successfully',
            data: product,
            error: false
        });

    } catch (error: any) {
        return res.status(400).json({
            message: 'Error updating product',
            error: error.message
        });
    }
};

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
        ).populate('category', 'name')
        .populate('variants.color');

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

const searchProductsByNameAndCategory = async (req: Request, res: Response) => {
    const name = (req.query.name as string) || '';
    try {
        const products = await Product.find({
            name: { $regex: name, $options: "i"}
        }).populate('category', 'name');

        res.status(200).json({
            message: "Products obtained successfully",
            data: products,
            error: false,
        });
    } catch (error: any) {
        res.status(400).json({
            error: error.message,
        })
    }
}

export {
    createProducts,
    getProducts,
    getProductById,
    deleteProduct,
    updateProduct,
    deactivateProduct,
    activateProduct,
    updateVariantStock
}