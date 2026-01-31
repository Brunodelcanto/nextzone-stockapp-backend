import mongoose, { Schema, Document} from "mongoose";

export interface Category extends Document {
    name: string;
    isActive?: boolean;
}

const CategorySchema = new Schema<Category>(
    {
        name: { type: String, unique: true, required: true},
        isActive: { type: Boolean, default: true},
    },
    { 
        timestamps: true 
    }
)

const Category = mongoose.model<Category>("Category", CategorySchema);
export default Category;