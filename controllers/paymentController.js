const paymentModel = require('../models/paymentModel');


// GETTING ALL REGISTERED USRS
const getAllPayments = async(req,res) =>{
    try {
        const getAllPayments = await paymentModel.find().populate(['order',{path:'customerId',select:'-password'}])
        if(!getAllPayments){
            return res.status(400).json({status:false,msg:"Failed"})
        }
        res.status(200).json({status:true,data:getAllPayments})

    } catch (error) {
        return res.status(500).json({status:false,msg:error.message})
    }
}

// GET SINGLE Payment
const getSinglePayment = (req,res) =>{
    try {
        
    } catch (error) {
        return res.status(500).json({status:false,msg:error.message})
    }
}


// GET LIST OF USER PAYMENTS
const getCustomerPayments = async(req, res) => {
    try {
        const {customerId} = req.params
        const findCustomerPayments = await paymentModel.find({customerId})

        if(findCustomerPayments.length <= 0 || findCustomerPayments == null){
            return res.status(404).json({status:false,msg:'No order found'})
        }

        res.status(200).json({status:true,data:findCustomerPayments})
    } catch (error) {
        
    }
}


// GET PAYMENT BY PAYMENT ID
const getPaymentByPaymentId = async(req,res)=>{
    try {
        const {paymentId} = req.params;
        // find order by status
        const findPaymentByPaymentId = await paymentModel.find({paymentId})

        if(findPaymentByPaymentId.length <=0 ){
            return res.status(404).json({status:false,msg:'No payment found'})
        }

        res.status(200).json({status:true,data:findPaymentByPaymentId})
    } catch (error) {
        res.status(500).json({status:false,msg:error.message})
    }
}

// ADDING NEW Payment
const addPayment = async(req,res) =>{
    try {
        const data = req.body 
        const addNewPayment = new paymentModel(data)
        if(!addNewPayment){
            return res.status(500).json({status:false,msg:'Payment Failed'})
        }

        await addNewPayment.save()
        res.status(201).json({message : true, msg : "Payment Successful"})
    } catch (error) {
        return res.status(500).json({status:false,msg:error.message})
    }
}

// EDIT Payment
const editPayment= (req,res) =>{
    res.send('Payment edited')
}

// DELETE Payment
const deletePayment= (req,res) =>{
    res.send('Payment deleted')
}





module.exports = {
    getAllPayments,
    getSinglePayment,
    addPayment,
    editPayment,
    deletePayment,
    getCustomerPayments,
    getPaymentByPaymentId
}