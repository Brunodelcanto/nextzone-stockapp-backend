import mongoose, { Schema, Document} from "mongoose";

export interface Color extends Document {
    name: string;
    hex?: string;
    isActive?: boolean;
}

const colorSchema = new Schema<Color>(
    {
        name: {type: String, unique: true, required: true, trim: true},
        hex: {type: String, trim: true},
        isActive: { type: Boolean, default: true},
    },
    {
        timestamps: true
    }
);

const Color =  mongoose.model<Color>("Color", colorSchema);
export default Color;