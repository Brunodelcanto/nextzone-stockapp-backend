import mongoose , { Schema, Document, Types } from 'mongoose';

interface ColorVariant {
    _id?: any;
    color: string | Types.ObjectId
    amount: number;
    priceCost: number;
    priceSell: number;
}

export interface Product extends Document {
    name: string;
    category: Types.ObjectId;
    variants: ColorVariant[];
    minStockAlert: number;
    isActive: boolean;
    image: {url: string; public_id: string;}
}

const ProductSchema = new Schema<Product>(
    {
        name: { type: String, required: true, unique: true, trim: true},
        category: { type: Schema.Types.ObjectId, ref: 'Category', required: true},
        variants: [
            {
                color: { type: Schema.Types.ObjectId, ref: 'Color', required: true},
                amount: { type: Number, required: true, min: 0},
                priceCost: { type: Number, required: true},
                priceSell: { type: Number, required: true}
            }
        ],
        minStockAlert: { type: Number, default: 5},
        isActive: { type: Boolean, default: true},
        image: {
            url: { type: String, required: true},
            public_id: { type: String, required: true}
        }
    },
    { timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
     }
);

ProductSchema.virtual('totalProfit').get(function(){
    return this.variants.reduce((acc, v) => acc + (v.priceSell - v.priceCost) * v.amount, 0);
});

const Product = mongoose.model<Product>("Product", ProductSchema);
export default Product;