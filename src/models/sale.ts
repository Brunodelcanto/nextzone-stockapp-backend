import { Schema, model, Document, Types } from 'mongoose';

interface ISaleItem {
    productId: Types.ObjectId;
    variantId: Types.ObjectId;
    name: string;
    quantity: number;
    priceAtSale: number;
    priceCostAtSale: number;
}

interface ISale extends Document {
    items: ISaleItem[];
    totalAmount: number;
    totalProfit?: number;
    comment?: string;
    createdAt: Date;
}

const SaleSchema = new Schema<ISale>({
    items: [{
        productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        variantId: { type: Schema.Types.ObjectId, required: true },
        name: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1},
        priceAtSale: { type: Number, required: true, min: 0 },
        priceCostAtSale: { type: Number, required: true, min: 0 },
    }],
    totalAmount: { type: Number, required: true},
    totalProfit: { type: Number, required: false, default: 0 },
    comment: { type: String},
}, {timestamps: true})

export default model<ISale>('Sale', SaleSchema);    