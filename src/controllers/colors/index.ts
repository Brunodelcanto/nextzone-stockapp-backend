import type { Request, Response } from 'express';
import Color from '../../models/color.js';
import Product from '../../models/product.js';

const createColor = async (req: Request, res: Response) => {
    try {
        const {name, hexCode} = req.body;

        const existingColor = await Color.findOne({
            name: { $regex: new RegExp(`^${name}`, 'i')}
        });

        if (existingColor) {
            return res.status(400).json({
                message: "Color with this name already exists",
                error: true,
            });
        }

        const color = new Color(req.body);
        await color.save();

        return res.status(201).json({
            message: "Color created successfully",
            data: color,
            error: false
        });
    } catch (error: any) {
        return res.status(400).json({
            error: error.message
        });
    }
}

const getColors = async (req: Request, res: Response) => {
    try {
        const colors = await Color.find();
        return res.status(200).json({
            message: "Colors retrieved successfully",
            data: colors,
            error: false
        });
    } catch (error: any) {
        return res.status(400).json({
            error: error.message
        })
    }
}

const getColorById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const color = await Color.findById(id);
        if (!color) {
            return res.status(404).json({
                message: "Color not found",
                error: true
            });
        }
        return res.status(200).json({
            message: "Color retrieved successfully",
            data: color,
            error: false
        })
    } catch (error: any) {
        return res.status(400).json({
            error: error.message
        });
    }
}

const deleteColor = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;

        const color = await Color.findByIdAndDelete(id);

        if (!color) {
            return res.status(404).json({
                message: "Color not found",
                error: true
            });
        }
        return res.status(200).json({
            message: "Color deleted successfully",
            error: false
        });

    } catch (error: any) {
        return res.status(400).json({
            error: error.message
        });
    }

}

const updateColor = async (req: Request, res: Response) => {
    try {
        const { name } = req.body;
         const id = req.params.id as string;

        const existingColor = await Color.findOne({
            name: { $regex: new RegExp(`^${name}$`, 'i') },
            _id: { $ne: id }
        });

        if (existingColor) {
            res.status(400).json({
                message: "Color with this name already exists",
                error: true,
            });
            return;
        }
        const color = await Color.findByIdAndUpdate(
            id,
            {
                $set: req.body
            },
            { new: true }
        );
        if (!color) {
            res.status(404).json({
                message: "Color not found",
                error: true,
            })
            return;
        }
        res.status(200).json({
            message: "Color updated successfully",
            data: color,
            error:false,
        });
    } catch (error: any) {
        res.status(400).json({
            error: error.message,
        });
    }
}

const deactivateColor = async (req: Request, res: Response) => {
        try {
        const id = req.params.id as string;

        const productsWithColor = await Product.find({ "variants.color": id });

        if (productsWithColor.length > 0) {
            return res.status(400).json({
                message: "Cannot deactivate this color because it is associated with products",
                error: true,
            });
        }

        const color = await Color.findByIdAndUpdate(
            id,
            { isActive: false },
            { new: true},
        )
        if (!color ) {
            res.status(404).json({
                message: "Color not found",
                error: true,
            });
            return;
        }
        res.status(200).json({
            message: "Color deactivated successfully",
            data: color,
            error: false,
        });
    } catch (error: any) {
        res.status(400).json({
            error: error.message,
        });
    }
}

const activateColor = async (req: Request, res: Response) => {
        try {
        const { id } = req.params;
        const color = await Color.findByIdAndUpdate(
            id,
            { isActive: true },
            { new: true },
        );
        if (!color) {
            res.status(404).json({
                message: "Color not found",
                error: true,
            });
            return;
        };
        res.status(200).json({
            message: "Color activated successfully",
            data: color,
            error: false,
        });
    } catch (error: any) {
        res.status(400).json({
            error: error.message,
        });
        
    }
}

export {
    createColor,
    getColors,
    getColorById,
    deleteColor,
    updateColor,
    deactivateColor,
    activateColor
}