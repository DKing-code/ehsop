const router = require('express').Router();

// IMPORT OF CONTROLLERS
const {addToCart,getAllCarts,getUserCart,removeFromCart,updateQuantity} = require('../controllers/cartController')


// GETTING ALL REGISTERED USRS
router.get('/',getAllCarts)

// GET SINGLE Order
router.get('/:userId',getUserCart)

router.post('/removeItem',removeFromCart)


// ADDING NEW Order
router.post("/",addToCart);


// ADDING NEW Order
router.post("/updatequantity",updateQuantity);


// DELETE Order
// router.delete('/:id',deleteOrder);

module.exports = router