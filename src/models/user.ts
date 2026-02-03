import {Schema, Document, model} from 'mongoose';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

export interface User extends Document {
    name: string;
    email: string;
    password: string;
    role: 'admin' | 'seller' | 'developer';
    isActive: boolean;
}

const UserSchema = new Schema({
    name: { type: String, required: true},
    email: { type: String, required: true, unique: true, lowercase: true},
    password: { type: String, required: true},
    role: {
        type: String,
        enum: ['admin', 'seller', 'developer'],
        default: 'admin'
    }
}, { timestamps: true });

UserSchema.pre('save', async function(){
    if (!this.isModified('password')) return;

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (error: any) {
        throw error;
    }
})

const User = mongoose.model<User>('User', UserSchema);

export default User;