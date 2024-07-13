const mongoose = require('mongoose');

// Define a schema for the product items in the cart
const productItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product', // Reference to the Product model
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 1 // Default quantity is 1
  },
  total:{type:Number}
});


// CART SCHEMA
const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [productItemSchema],
  sender:{type:Object},
  total : {type:Number,default: 0}
});

const cartModel = mongoose.model('Cart', cartSchema);

module.exports = cartModel;
