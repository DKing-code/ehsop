/**
 * SCHEMA OF THE PRODUCT COLLECTION
 */
const { types } = require('joi');
const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    name: { type: String, required: true },
    sku: {type:String} ,
    desc : {type:String,required:true},
    price : {type:Number, required:true},
    inStock :{type:Boolean},
    quantityInStock :{type:Number},
    summary : {type:String},
    images : {type:[String]} ,
    itemsList : {type:[String]} ,
    onDiscount : {type:Boolean},
    discountPrice : {type:Number},
    discountStartDate : {type:Date},
    discountEndDate : {type:Date},
    hasSizes : {type:Boolean},
    itemSizes : {type:[]},
    hasColors : {type:Boolean},
    itemColors : {type:[String]},
    category : {
        // type: mongoose.Schema.Types.ObjectId,
        type: [Object]
        // ref: 'Category',
        // required: true
      },// The name of the product
},{timestamps:true})

const productModel = mongoose.model('Product',productSchema)

module.exports=productModel;