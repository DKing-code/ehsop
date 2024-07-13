const router = require('express').Router();


const {
    getAllDeliveryLocationPrices,
    addNewLocation,
    editLocationPrice,
    deleteLocationPrice
} = require('../controllers/deliverPricesController')


// GET ALL LOACTION PRICES
router.get('/',getAllDeliveryLocationPrices)

// ADD NEW 
router.post('/',addNewLocation)


// EDIT LOCATION DETA
router.put('/:id',editLocationPrice)


// EDIT LOCATION DETA
router.delete('/:id',deleteLocationPrice)

module.exports = router