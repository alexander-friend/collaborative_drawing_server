import mongoose from "mongoose";

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/collaborative_drawings';

const connectDB = async () => {
    try {
        await mongoose.connect(mongoURI, {});
        console.log('MongoDB connected');
    } catch (e) {
        console.error('MongoDB connection failed:', e);
    }
}

export default connectDB;