import type { Request, Response } from "express";
import Category from "../../models/category.js";
import Product from "../../models/product.js";


const createCategory = async (req: Request, res: Response) => {
    try {
        const { name } = req.body;

        const existingCategory = await Category.findOne ({
            name: { $regex: new RegExp(`^${name}$`, 'i')},
        });

        if (existingCategory) {
            return res.status(400).json({
                message: 'Category with this name already exists',
                error: true,
            })
        }

        const category = new Category(req.body);
        await category.save();

        return res.status(201).json({
            message: 'Category created successfully',
            data: category,
            error: false,
        });

    } catch (error: any) {
        return res.status(400).json({
            error: error.message
        })
    }
}

const getCategoryById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({
                message: 'Category not found',
                error: true,
            });
        }
        return res.status(200).json({
            message: 'Category fetched successfully',
            data: category,
            error: false,
        });
    } catch (error: any) {
        return res.status(400).json({
            error: error.message
        });
    }
}

const getCategories = async (req: Request, res: Response) => {
    try {
        const categories = await Category.find();
        return res.status(200).json({
            message: 'Categories retrieved successfully',
            data: categories,
            error: false,
        });
    } catch (error: any) {
        return res.status(400).json({
            error: error.message
        })
    }
}

const deleteCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const productsWithCategory = await Product.find({ category: id as string });

        if(productsWithCategory.length > 0) {
            return res.status(400).json({
                message: 'Cannot delete category because it is associated with existing products',
                error: true,
            })
        } 

        const category = await Category.findByIdAndDelete(id);
        if (!category) {
            return res.status(404).json({
                message: "Category not found",
                error: true,
            });
        }
             return res.status(200).json({
                message: "Category deleted successfully",
                error: false,
            });
    } catch (error: any) {
        return res.status(400).json({
            error: error.message
        });
    }
}

const updateCategory = async (req: Request, res: Response) => {
    try {
        const { name } = req.body;
        const  id  = req.params.id as string;
        
    const existingCategory = await Category.findOne ({
        name: { $regex: new RegExp(`^${name}$`, 'i')},
        _id: { $ne: id}
    });

    if (existingCategory) {
        return res.status(400).json({
            message: 'Category with this name already exists',
            error: true,
        })
    }

    const category = await Category.findByIdAndUpdate(
        id,
        {
            $set: req.body
        },
        { new: true }
    ); 
    if (!category) {
        return res.status(404).json({
            message: 'Category not found',
            error: true,
        });
    }
     return res.status(200).json({
        message: 'Category updated successfully',
        data: category,
        error: false,
    });

    } catch (error: any) {
        return res.status(400).json({
            error: error.message
        });
    }
}

const deactivateCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const productsWithCategory = await Product.find({ category: id as string });

        if(productsWithCategory.length > 0) {
            return res.status(400).json({
                message: 'Cannot deactivate category because ir is associated with products',
                error: true,
            })
        }
        const category = await Category.findByIdAndUpdate(
            id,
            { isActive: false },
            { new: true }
        )
        if (!category) {
            return res.status(404).json({
                message: "Category not found",
                error: true,
            });
        }
        return res.status(200).json({
            message: "Category deactivated successfully",
            data: category,
            error: false,
        })
    } catch (error: any) {
        return res.status(400).json({
            error: error.message
        });
    }
}

const activateCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const category = await Category.findByIdAndUpdate(
            id,
            { isActive: true },
            { new: true }
        )
        if (!category) {
            return res.status(404).json({
                message: "Category not found",
                error: true,
            });
        }
        return res.status(200).json({
            message: "Category activated successfully",
            data: category,
            error: false,
        });
    } catch (error: any) {
        return res.status(400).json({
            error: error.message
        });
    }
}

export {
    createCategory,
    getCategoryById,
    getCategories,
    deleteCategory,
    updateCategory,
    deactivateCategory,
    activateCategory
}
