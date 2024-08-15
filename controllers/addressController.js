const addressModel = require('../models/addressModel')


// GETTING ALL REGISTERED USRS
const getAllAddresss = async(req,res) =>{
    try{
        const address = await addressModel.find().populate({path:'user',select:'-password'})
        if(!address){
            return res.status(400).json({status:'false',msg:'No users found'});
        }
        res.status(200).json({status:true,data:address})
    }catch(err){
        res.status(400).json({status:false,msg:err.message});
    }
}

// GET USER ADDRESSES
const getUserAddress = async(req,res) =>{
    try{
        const {id} = req.params
        // {path:'user',select:'-password'}
        const address = await addressModel.find({user:id})
        if(!address){
            return res.status(400).json({status:'false',msg:'No users found'});
        }
        res.status(200).json({status:true,data:address})
    }catch(err){
        res.status(400).json({status:false,msg:err.message});
    }
}


// GET USER SINGLE Address
const getSingleAddress = async(req,res) =>{
    try {
        const {id} = req.params
        const address = await addressModel.findOne({_id:id})
        if(!address){
            return res.status(400).json({status:false, msg:'User not found'});
        }
        res.status(200).json({status:true, data:address})
    } catch (error) {
        res.status(500).json({status:false,msg:error.message})
    }
}

// ADDING NEW Address
const addAddress = async(req,res) =>{
    try {
        const data = req.body 
        // const createAddress = 
        // CHECK IF USER RECORD IS ALREADY ADDRESS COLLECTION
        let checkIfUserHasAddress = await addressModel.findOne({user:data.user})

        // IF USER DOSE NOT HAVE ANY ADDRESS CREATE A NEW ADDRESS RECORD 
        if (!checkIfUserHasAddress) {
            const createAddress = await addressModel.create(data)
            res.status(201).json({status:true, data:createAddress})
        }else{
            checkIfUserHasAddress = await addressModel.findOneAndUpdate(
                { user: data.user },{ $push: { addresses:data.addresses[0] } }, // Update the entire address object with the new data
                { new: true } // Return the updated document
            );

            return res.status(200).json({ status: true, data: checkIfUserHasAddress });
        }

    } catch (error) {
        res.status(500).json({status:false,msg:error.message})
    }
}

// EDIT OLD ADDRESS
const editAddress= async(req,res) =>{
    try {
        const { index } = req.params;
        const { user, updatedAddress } = req.body;

        // Find the address document
        const addressDoc = await addressModel.findOne({ user });

        // Check if the address document exists
        if (!addressDoc) {
            return res.status(404).json({ status: false, message: 'Address not found' });
        }

        // Check if the index is valid
        if (index < 0 || index >= addressDoc.addresses.length) {
            return res.status(400).json({ status: false, message: 'Invalid address index' });
        }

        // Update the address at the specified index
        addressDoc.addresses[index] = updatedAddress;

        // Save the updated document
        await addressDoc.save();

        res.status(200).json({ status: true, message: 'Address updated successfully' });
    } catch (error) {
        console.error('Error updating address:', error);
        res.status(500).json({ status: false, message: 'Internal server error' });
    }
}


// DELETE / REMOVE  OLD ADDRESS
const removeAddress = async(req, res) => {
    try {
        const { index } = req.params;
        const { user } = req.body;

        // Find the address document
        const addressDoc = await addressModel.findOne({ user });

        // Check if the address document exists
        if (!addressDoc) {
            return res.status(404).json({ status: false, message: 'Address not found' });
        }

        // Check if the index is valid
        if (index < 0 || index >= addressDoc.addresses.length) {
            return res.status(400).json({ status: false, message: 'Invalid address index' });
        }

        // Remove the address at the specified index
        addressDoc.addresses.splice(index, 1);

        // Save the updated document
        await addressDoc.save();

        res.status(200).json({ status: true, message: 'Address deleted successfully' });
    } catch (error) {
        console.error('Error deleting address:', error);
        res.status(500).json({ status: false, message: 'Internal server error' });
    }
}

// DELETE Address
const deleteAddress= async(req,res) =>{
    try {
        const {id} = req.params
        const deleteAddress = await addressModel.deleteOne({_id:id})
        res.json(deleteAddress)
    } catch (error) {
        res.status(500).json({status:false,msg:error.message})
    }
}





module.exports = {
    getAllAddresss,
    getSingleAddress,
    addAddress,
    editAddress,
    deleteAddress,
    getUserAddress,
    removeAddress
}