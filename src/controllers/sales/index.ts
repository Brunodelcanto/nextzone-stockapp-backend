import type { Request, Response } from 'express';
import Sale from '../../models/sale.js';
import Product from '../../models/product.js';

const createSale = async (req: Request, res: Response) => {
    try {
        const { items, comment } = req.body;
        let totalAmount = 0;
        let totalProfit = 0; 
        const processedItems = [];

        for (const item of items) {
            const product = await Product.findById(item.productId);

            if(!product) {
                return res.status(404).json({ message: `Producto con ID ${item.productId} no encontrado` })
            }

            const variant = product.variants.find(v => v._id.toString() === item.variantId);

            if (!variant) {
                return res.status(404).json({ message: `Variante no encontrada para el producto ${product.name}` });
            }

            if (variant.amount < item.quantity) {
                return res.status(400).json({ 
                    message: `Stock insuficiente para ${product.name} (${variant.amount} disponibles)` 
                }); 
            }

            const subtotal = variant.priceSell * item.quantity;
            const subtotalCost = variant.priceCost * item.quantity; 
            
            totalAmount += subtotal;
            totalProfit += (subtotal - subtotalCost); 

            processedItems.push({
                productId: item.productId,
                variantId: item.variantId,
                name: product.name,
                quantity: item.quantity,
                priceAtSale: variant.priceSell,
                priceCostAtSale: variant.priceCost 
            });

            await Product.findOneAndUpdate(
                {_id: item.productId, 'variants._id': item.variantId},
                { $inc: {'variants.$.amount': -item.quantity}}
            );
        }
        const newSale = new Sale({
            items: processedItems,
            totalAmount,
            totalProfit,
            comment
        });

        await newSale.save();

        return res.status(201).json({
            message: "Sale registered successfully",
            data: newSale,
            error: false
        });

    } catch (error: any) {
        return res.status(400).json({
            message: "Error processing sale",
            error: error.message
        });
    }
};

const getSales = async (req: Request, res: Response) => {
    try {
        const { startDate, endDate } = req.query;
        let query = {};

        if (startDate && endDate) {
            query = {
                createdAt: {
                    $gte: new Date(startDate as string),
                    $lte: new Date(endDate as string)
                }
            };
        }
        const sales = await Sale.find(query)
            .populate('items.productId', 'name')
            .sort({ createdAt: -1 })
            .lean();

        if (!Array.isArray(sales) || sales.length === 0) {
            return res.status(200).json({
                message: "No sales found or the format is incorrect",
                totalRevenue: 0,
                totalProfit: 0,
                data: [],
                error: false
            });
        }

        const totals = sales.reduce((acc, sale) => {
            return {
                revenue: acc.revenue + (sale.totalAmount || 0),
                profit: acc.profit + (sale.totalProfit || 0) 
            };
        }, { revenue: 0, profit: 0 });

        return res.status(200).json({
            message: "Report generated successfully",
            count: sales.length,
            totalRevenue: totals.revenue,
            totalProfit: totals.profit,
            data: sales,
            error: false
        });

    } catch (error: any) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};

const deleteSale = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const sale = await Sale.findById(id);

        if (!sale) {
            return res.status(404).json({
                message: "Sale not found",
                error: true
            })
        }
            for (const item of sale.items) {
                await Product.findOneAndUpdate(
                    {_id: item.productId, "variants._id": item.variantId},
                    {
                        $inc: { "variants.$.amount": item.quantity}
                    }
                )
            }
            await Sale.findByIdAndDelete(id)

            return res.status(200).json({
                message: "Sale deleted successfully",
                error: false
            })
        } catch (error: any) {
            return res.status(400).json({
                message: "Error deleting sale",
                error: error.message
            })
        }

    }


export { createSale, getSales, deleteSale };