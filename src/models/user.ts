import {Schema, Document} from 'mongoose';
import mongoose from 'mongoose';

export interface User extends Document {
    name: string;
    email: string;
    password: string;
    role: 'admin' | 'developer';
    isActive: boolean;
}

const userSchema = new Schema<User>(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, trim: true },
        password: { type: String, required: true },
        role: { type: String, enum: ['admin', 'developer'], default: 'developer' },
        isActive: { type: Boolean, default: true },
    },
    { 
        timestamps: true 
    }
)

const User = mongoose.model<User>('User', userSchema);

export default User;