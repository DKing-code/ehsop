const orderModel =require('../models/orderModel')


// GETTING ALL REGISTERED USRS
const getAllOrders = async(req,res) =>{
    try{
        const orders = await orderModel.find().populate('customerId').populate('products.productId').sort({ createdAt: -1 });
        if(!orders){
            return res.status(400).json({status:'false',msg:'No users found'});
        }
        res.status(200).json({status:true,data:orders})
    }catch(err){
        res.status(400).json({status:false,msg:err.message});
    }
}

// GET DAILY ORDERS
const getDailyOrders = async (req, res) => {
    try {
        // Get the current date
        const today = new Date();
        // Set the start of the day to 00:00:00
        today.setHours(0, 0, 0, 0);
        // Set the end of the day to 23:59:59
        const endOfDay = new Date(today);
        endOfDay.setHours(23, 59, 59, 999);

        // Find orders created between start and end of the day
        const dailyOrderCount = await orderModel.countDocuments({
            createdAt: {
                $gte: today,
                $lte: endOfDay
            }
        });

        return res.status(200).json({ status: true, data: dailyOrderCount });
    } catch (error) {
        console.error('Error fetching daily order count:', error);
        return res.status(500).json({ status: false, msg: 'Internal server error' });
    }
};


// GET SINGLE Order
const getSingleOrder = async(req,res) =>{
    try {
        const {id} = req.params
        const getOrder = await orderModel.findOne({_id:id})
        if(!getOrder){
            return res.status(400).json({status:false, msg:'User not found'});
        }
        res.status(200).json({status:true, data:getOrder})
    } catch (error) {
        res.status(500).json({status:false,msg:error.message})
    }
}


// GET USER ORDERS

const getCustomerOrders = async(req, res) => {
    try {
        const {customerId} = req.params
        const findCustomerOrders = await orderModel.find({customerId}).populate('products.productId').sort({ createdAt: -1 });

        if(findCustomerOrders.length <= 0 || findCustomerOrders == null){
            return res.status(404).json({status:false,msg:'No order found'})
        }
        res.status(200).json({status:true,data:findCustomerOrders})

    } catch (error) {
        res.status(500).json({status:false,msg:error.message})
    }
}



// GET ORDER BY THEIR STATUS
const getOrderByStatus = async(req,res)=>{
    try {
        const {status} = req.params;
        // find order by status
        const filterOrder = await orderModel.find({status:status.toLowerCase()}).populate('customerId').populate('products.productId').sort({ createdAt: -1 });

        if(filterOrder.length <=0 || !filterOrder ){
            return res.status(200).json({status:false,data: []})
        }
        res.status(200).json({status:true,data:filterOrder})
    } catch (error) {
        res.status(500).json({status:false,msg:error.message})
    }
}


// GET MONTHLY SALES OF SHIPPED ORDERS
async function getMonthlySalesData(req,res) {
    try {
        const {year } = req.body
        const salesData = [];

        for (let month = 1; month <= 12; month++) {
            const startDate = new Date(year, month - 1, 1);
            const endDate = new Date(year, month, 0);

            const orders = await orderModel.find({
                status: 'shipped',
                createdAt: {
                    $gte: startDate,
                    $lte: endDate,
                },
            });

            const totalSales = orders.reduce((total, order) => total + order.totalAmount, 0);
            salesData.push(totalSales);
        }
        res.status(200).json({status:true,data:salesData})

        // return salesData;
    } catch (error) {
        return res.status(500).json({status:false, msg:error.message})
        // throw new Error('Failed to fetch sales data');
    }
}


// GET MONTHLY ORDERS
async function getMonthlyOrderCounts(req,res) {
    try {
        const {year} = req.body
        const monthlyOrderCounts = [];

        for (let month = 1; month <= 12; month++) {
            const startDate = new Date(year, month - 1, 1);
            const endDate = new Date(year, month, 0);

            const orderCount = await orderModel.countDocuments({
                createdAt: {
                    $gte: startDate,
                    $lte: endDate,
                },
            });

            monthlyOrderCounts.push( orderCount );
        }

        res.status(200).json(monthlyOrderCounts)
        // return monthlyOrderCounts;
    } catch (error) {
        res.status(500).json({status:false,msg:error.message})
    }
}





// GET ORDER BY THEIR ORDER ID
const getOrderByOrderId = async(req,res)=>{
    try {
        const {orderId} = req.params;
        // find order by status
        const filterOrder = await orderModel.find({orderId}).populate('customerId').populate('products.productId').sort({ createdAt: -1 });

        if(filterOrder.length <=0 ){
            return res.status(404).json({status:false,msg:'No order found'})
        }

        res.status(200).json({status:true,data:filterOrder})
    } catch (error) {
        res.status(500).json({status:false,msg:error.message})
    }
}


// ADDING NEW Order
const addOrder = async(req,res) =>{
    try {
        const data= req.body
        const createOrder = await orderModel.create(data)
        if(!createOrder){
            return res.status(400).json({status: false,msg:'User not created'})
        }
        res.status(201).json({status:true,data:createOrder})
    } catch (error) {
        res.status(500).json({status:false,msg:error.message})
    }
}


// GET TOTAL SALE OF SHIPPED PRODUCT
const getTotalSalesShipped = async (req, res) => {
    try {
        // Aggregate orders with status "shipped" and calculate total sales
        const totalSales = await orderModel.aggregate([
            {
                $match: { status: "shipped" || 'delivered' }
            },
            {
                $group: {
                    _id: null,
                    totalSales: { $sum: "$totalAmount" }
                }
            }
        ]);

        // Extract the total sales value from the result
        const salesAmount = totalSales.length > 0 ? totalSales[0].totalSales : 0;

        return res.status(200).json({ status: true, data: salesAmount });
    } catch (error) {
        console.error('Error fetching total sales:', error);
        return res.status(500).json({ status: false, msg: 'Internal server error' });
    }
};


// GET TOTAL SALE FOR TODAY WHERE STATUS IS SHIPPED
const getTotalSaleForToday = async (req, res) => {
    try {
        // Get the current date
        const today = new Date();
        // Set the start of the day to 00:00:00
        today.setHours(0, 0, 0, 0);
        // Set the end of the day to 23:59:59
        const endOfDay = new Date(today);
        endOfDay.setHours(23, 59, 59, 999);

        // Aggregate orders created today and calculate total sales
        const totalSalesToday = await orderModel.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: today,
                        $lte: endOfDay
                    },
                    status: "shipped"
                }
            },
            {
                $group: {
                    _id: null,
                    totalSales: { $sum: "$totalAmount" }
                }
            }
        ]);

        // Extract the total sales value from the result
        const salesAmountToday = totalSalesToday.length > 0 ? totalSalesToday[0].totalSales : 0;

        return res.status(200).json({ status: true, data: salesAmountToday });
    } catch (error) {
        console.error('Error fetching total sales for today:', error);
        return res.status(500).json({ status: false, msg: 'Internal server error' });
    }
};



// EDIT Order
const editOrder= (req,res) =>{
    res.send('Order edited')
}

// ORDER STATUS UPDATING
const updateOrderStatus = async(req,res) =>{
    try {
        const {orderId,status} = req.body;
        const updateOrder = await orderModel.findOneAndUpdate({orderId},{$set:{status}})

        if(!updateOrder){
            return res.status(404).json({status:false,msg:'Order not found'});
        }

        res.status(200).json({status:true,msg:'Order updated'})
    } catch (error) {
        res.status(500).json({status:false,msg:error.message})
    }
}

// DELETE Order
const deleteOrder= async(req,res) =>{
    try {
        const {id} = req.params
        const deletedOrder = await orderModel.deleteOne({_id : id})
        if(!deletedOrder){
            return res.status(400).json({status: true, msg:"Not Deleted"})
        }


        res.status(200).json({status: true, msg:'Deleted'})
    } catch (error) {
        res.status(500).json({status:false,msg:error.message})
    }
}



module.exports = {
    getAllOrders,
    getSingleOrder,
    addOrder,
    editOrder,
    deleteOrder,
    updateOrderStatus,
    getOrderByStatus,
    getCustomerOrders,
    getOrderByOrderId,
    getDailyOrders,
    getTotalSalesShipped,
    getTotalSaleForToday,
    getMonthlySalesData,
    getMonthlyOrderCounts
}