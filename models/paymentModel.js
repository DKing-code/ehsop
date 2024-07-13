/**  
 * MODEL FOR THE PAYMENT COLLECTION
 */

const mongoose = require('mongoose')

const paymentSchema = mongoose.Schema({
    orderId : {
        type : String,
        required : true
    },
    customerId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    paymentId : {type : String, required:true},
    amount : {type : Number},
    status : {type:String}
},{timestamps:true})

const paymentModel = mongoose.model('Payment',paymentSchema)

module.exports= paymentModel; 