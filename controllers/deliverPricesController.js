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

        // Validate the request body (optional but recommended)
        if (!data.city || !data.towns || !Array.isArray(data.towns)) {
            return res.status(400).json({ status: false, msg: 'Invalid data. Please provide a city name and an array of towns.' });
        }

        await addLocation.save()
        res.status(201).json({message : true, msg : "Added Successful"})

    } catch (error) {
        return res.status(500).json({status:false,msg:error.message})
    }
}


// EDIT LOCATION
const editLocationPrice = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Validate the request body (optional but recommended)
        if (!updateData || (updateData.towns && !Array.isArray(updateData.towns))) {
            return res.status(400).json({ status: false, msg: 'Invalid data. Please provide valid data to update.' });
        }

        // Update the location
        const editLocation = await deliveryPricesModel.findByIdAndUpdate(id, updateData, { new: true });

        // Check if the location was found and updated
        if (!editLocation) {
            return res.status(404).json({ status: false, msg: 'Location not found or not updated' });
        }

        res.json({ status: true, msg: 'Location updated successfully', data: editLocation });
    } catch (error) {
        console.error('Error updating location:', error);
        res.status(500).json({ status: false, msg: error.message });
    }
};


const addTownsToCity = async (req, res) => {
    try {
        const { id } = req.params; // City ID
        const newTowns = req.body.towns; // Array of new towns to be added

        // Validate the input
        if (!newTowns || !Array.isArray(newTowns) || newTowns.length === 0) {
            return res.status(400).json({ status: false, msg: 'Invalid data. Please provide an array of towns.' });
        }

        // Update the city by adding new towns to the existing towns array
        const updatedCity = await deliveryPricesModel.findByIdAndUpdate(
            id,
            { $push: { towns: { $each: newTowns } } },
            { new: true, runValidators: true } // Return the updated document
        );

        if (!updatedCity) {
            return res.status(404).json({ status: false, msg: 'City not found or not updated' });
        }

        res.json({ status: true, msg: 'Towns added successfully', data: updatedCity });
    } catch (error) {
        console.error('Error adding towns to city:', error);
        res.status(500).json({ status: false, msg: error.message });
    }
};


const removeTownFromCity = async (req, res) => {
    try {
        const { id } = req.params; // City ID
        const { townName } = req.body; // Town name to be removed

        // Validate the input
        if (!townName) {
            return res.status(400).json({ status: false, msg: 'Invalid data. Please provide the town name.' });
        }

        // Update the city by pulling the specific town from the towns array
        const updatedCity = await deliveryPricesModel.findByIdAndUpdate(
            id,
            { $pull: { towns: { name: townName } } },
            { new: true, runValidators: true } // Return the updated document
        );

        if (!updatedCity) {
            return res.status(404).json({ status: false, msg: 'City not found or not updated' });
        }

        res.json({ status: true, msg: 'Town removed successfully', data: updatedCity });
    } catch (error) {
        console.error('Error removing town from city:', error);
        res.status(500).json({ status: false, msg: error.message });
    }
};



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
    deleteLocationPrice,
    addTownsToCity,
    removeTownFromCity
}