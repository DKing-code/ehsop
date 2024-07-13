/** 
 * SCHEMA OF THE ORDER COLLECTION
 */
const mongoose = require('mongoose');


const orderSchema = mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: [{
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        quantity: {
          type: Number,
          required: true,
          min: 1
        },
        size :{type: String},
        color:{type:String}
    }],
    deliveryAddress : {
        type : Object
    },
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered','received','cancelled'],
        default: 'pending'
    },
    shippingCost:{
        type: Number,
        default: 0
    }
},{timestamps:true})

const orderModel = mongoose.model('Order',orderSchema);

module.exports = orderModel