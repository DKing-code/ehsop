const mongoose = require('mongoose');

const deliverPriceSchema = mongoose.Schema({
    city : {type:String , required:true},
    town : {type:String , required:true},
    price : {type:Number, required:true}
})


const deliveryPricesModel = mongoose.model('DeliveryPrice',deliverPriceSchema)

module.exports = deliveryPricesModel

