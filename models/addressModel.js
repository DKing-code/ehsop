const mongoose = require('mongoose')

const detailSchema = mongoose.Schema({
    country:{type: String,require:true},
    fullname : {type: String,require:true},
    phone : {type: String,require:true},
    city: { type:String , require:true},
    town : {type: String,require:true},
    address : {type: String,require:true},
    isDefault: {type:Boolean},
})

const addressSchema = mongoose.Schema({
    user: {
        type:mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    addresses : []
})

const addressModel = mongoose.model('Address',addressSchema)

module.exports= addressModel;