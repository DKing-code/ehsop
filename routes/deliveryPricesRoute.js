const router = require('express').Router();


const {
    getAllDeliveryLocationPrices,
    addNewLocation,
    editLocationPrice,
    deleteLocationPrice,
    addTownsToCity,
    removeTownFromCity
} = require('../controllers/deliverPricesController')


// GET ALL LOACTION PRICES
router.get('/',getAllDeliveryLocationPrices)

// ADD NEW 
router.post('/',addNewLocation)


// EDIT LOCATION DETA
router.put('/:id',editLocationPrice)


//ADD MORE TOWNS
router.put('/addTowns/:id',addTownsToCity)


//REMOVE TOWN 
router.put('/removeTowns/:id',removeTownFromCity)


// EDIT LOCATION DETA
router.delete('/:id',deleteLocationPrice)

module.exports = router