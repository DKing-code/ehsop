const mongoose  = require('mongoose')


const settingsSchema = mongoose.Schema({
    logo : {type:String},
    shopName : {type:String,required:true,unique:true},
    currency : {type:String,required:true},
    address: {
        town: String,
        city: String,
        country: String,
        postalCode: String
    },
    email: {type:String,required:true},
    phone : {type:String,required:true},
    isOnlineShop : {type:Boolean,required:true},
    
})

const settingModel = mongoose.model('Setting', settingsSchema);
module.exports = settingModel;
