const deliveryPricesModel = require('../models/deliveryPricesModel')

const getAllDeliveryLocationPrices = async(req,res)=>{
    try {
        const getAllLocations = await deliveryPricesModel.find()
        if(!getAllLocations){
            return res.status(400).json({status:false,msg:"Failed"})
        }
        res.status(200).json({status:true,data:getAllLocations})

    } catch (error) {
        return res.status(500).json({status:false,msg:error.message})
    }
}


// ADDING NEW LOCATION PRICES
const addNewLocation = async(req,res)=>{
    try {
        const data = req.body 
        const addLocation = await deliveryPricesModel(data)

        if(!addLocation){
            return res.status(500).json({status:false,msg:'Not able to add location'})
        }

        await addLocation.save()
        res.status(201).json({message : true, msg : "Added Successful"})

    } catch (error) {
        return res.status(500).json({status:false,msg:error.message})
    }
}


// EDIT LOCATION
const editLocationPrice = async (req , res)=>{
    try {
        const {id} = req.params
        const editLocation = await deliveryPricesModel.updateOne({_id:id},req.body)
        res.json(editLocation)
    } catch (error) {
        res.status(500).json({status:false,msg:error.message})
    }
}


// EDIT LOCATION
const deleteLocationPrice = async (req , res)=>{
    try {
        const {id} = req.params
        const editLocation = await deliveryPricesModel.deleteOne({_id:id})
        res.json(editLocation)
    } catch (error) {
        res.status(500).json({status:false,msg:error.message})
    }
}



module.exports = {
    getAllDeliveryLocationPrices,
    addNewLocation,
    editLocationPrice,
    deleteLocationPrice
}