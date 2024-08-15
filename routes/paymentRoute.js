const router = require('express').Router();

// IMPORT OF CONTROLLERS
const {addPayment,getAllPayments,getSinglePayment,editPayment,deletePayment,getCustomerPayments,getPaymentByPaymentId} = require('../controllers/paymentController')


// GETTING ALL REGISTERED USRS
router.get('/',getAllPayments)

// GET SINGLE Payment
router.get('/:id',getSinglePayment)

router.get('/getCustomerPayments/:customerId',getCustomerPayments)

// GET PAYMENT BY PAYMENT ID
router.get('/getPaymentByPaymentId/:paymentId',getPaymentByPaymentId)


// ADDING NEW Payment
router.post("/", addPayment);

// EDIT Payment
router.put('/:id',editPayment);

// DELETE Payment
router.delete('/:id',deletePayment);

module.exports = router