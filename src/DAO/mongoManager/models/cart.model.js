import mongoose from 'mongoose';

const cartCollection = 'carts';

const cartSchema = new mongoose.Schema({
    products: {
        type: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "products"
                },
                id: String,
                quantity: Number
            }
        ],
        default: []
    }
});

// Populate Middleware
cartSchema.pre('findOne', function() {
    this.populate('products.product');
})

const cartModel = mongoose.model(cartCollection, cartSchema);

export default cartModel;