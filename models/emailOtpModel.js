const { required } = require('joi')
const mongoose = require('mongoose')



const emailOtpSchema = mongoose.Schema({
    email: {type:String,required:true},
    otpCode : {type:String,required:true}
},{timestamps:true})


const emailOtpModel = mongoose.model('Otp',emailOtpSchema)


module.exports = emailOtpModel;