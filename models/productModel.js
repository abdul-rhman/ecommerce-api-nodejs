const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
{
    name: {
        type: String,
        required: [true, "Product name is required"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Product description is required"]
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
        min: [0, "Price cannot be negative"]
    },
    category: {
        type: String,
        enum: ['Electronics', 'Clothing', 'Books', 'Home & Kitchen', 'Toys', 'Sports'],
        required: [true, "Category is required"]
        },
    stock: {
        type: Number,
        required: [true, "Stock quantity is required"],
        min: [0, "Stock cannot be negative"],
        default: 0
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Seller is required"]
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    times_sold: {
        type: Number,
        default: 0
    }
});


ProductSchema.methods.isQuantityAvailable = function(quantity)
{
    return this.stock >= quantity;
};

ProductSchema.methods.sellProduct = async function(quantity)
{
    this.stock -= quantity;
    this.times_sold += quantity;
    return await this.save({validateBeforeSave: false})
};

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;