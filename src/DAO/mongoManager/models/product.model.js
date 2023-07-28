import mongoose from 'mongoose';

const prodCollection = 'products';

const prodSchema = new mongoose.Schema({
    title: String,
    description: String,
    code: String,
    price: Number,
    status: Boolean,
    stock: Number,
    category: String,
    thumbnails: String
});

const prodModel = mongoose.model(prodCollection, prodSchema);

export default prodModel;