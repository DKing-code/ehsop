/**  
 * MODEL FOR THE USER COLLECTION
 */



const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    email : {type : String},
    phone: { type : String ,unique:true,required:true},
    fullname : { type :String, required:true},
    password : {type:String},
    country : { type :String,default:'ghana'},
    city: { type :String},
    address : { type :String},
    role : { type :String,
        enum:['admin','user'],
         default:'user'
    } // admin or client 

},{timestamps:true})


const  userModel = mongoose.model('User',userSchema)

module.exports = userModel

