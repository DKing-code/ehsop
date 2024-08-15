const router = require('express').Router();

// IMPORT OF CONTROLLERS
const {addAddress,getAllAddresss,getSingleAddress,editAddress,deleteAddress,getUserAddress,removeAddress} = require('../controllers/addressController')


// GETTING ALL REGISTERED USRS
router.get('/',getAllAddresss)

// GET A USER ADDRESS
router.get('/useraddress/:id',getUserAddress)

// GET SINGLE Address
router.get('/:id',getSingleAddress)


// REMOVE USERS ADDRESS
router.delete("/removeaddress/:index",removeAddress)

// ADDING NEW Address
router.post("/", addAddress);

// EDIT Address
router.put('/:index',editAddress);


// DELETE Address
router.delete('/:id',deleteAddress);

module.exports = router