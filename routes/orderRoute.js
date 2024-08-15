const router = require('express').Router();
const  { verifyToken } =  require('../utils/jwt');

/**
 * @swagger
 * tags:
 *   - name: Order
 *     description: Endpoints related to orders
*/

// IMPORT OF CONTROLLERS
const {addOrder,getAllOrders,getSingleOrder,
    editOrder,deleteOrder,updateOrderStatus,
    getOrderByStatus,getCustomerOrders,getOrderByOrderId,
    getDailyOrders,getTotalSalesShipped,getTotalSaleForToday,
    getMonthlySalesData,getMonthlyOrderCounts} = require('../controllers/orderController')


/**
 * @swagger
 * /order:
 *   get:
 *     summary: Get all registered users
 *     tags: [Order]
 *     responses:
 *       200:
 *         description: A list of all orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '##/models/orderModel'
 */
// GETTING ALL REGISTERED USRS
router.get('/',getAllOrders)





// GET TOTAL SALES OF SHIPPED PRODUCTS
router.get('/getTotalSalesShipped',getTotalSalesShipped)



//GET TOTAL SALES FOR TODAY WHERE STATUS IS SHIPPED
router.get('/getTotalSaleForToday',getTotalSaleForToday)

// GET SINGLE Order
router.get('/:id',getSingleOrder)


// GET DAILY ORDER
router.post('/getDailyOrders', getDailyOrders)

// GET ORDER BY STATUS
router.get('/getOrderByStatus/:status',getOrderByStatus)

// GET ORDER BY order id
router.get('/getOrderByOrderId/:orderId',getOrderByOrderId)


// GET ORDER BY THE CUSTOMERS ID
router.get('/getCustomerOrders/:customerId',getCustomerOrders)

// GET MONTHLY SALES
router.post('/getMonthlySalesData',getMonthlySalesData)

// GETTING MONTHLY ORDERS
router.post('/getMonthlyOrderCounts',getMonthlyOrderCounts)


// ADDING NEW Order
router.post("/", addOrder);

// ORDER STATUS
router.post('/updateOrderStatus',updateOrderStatus)

// EDIT Order
router.put('/:id',editOrder);


// DELETE Order
router.delete('/:id',deleteOrder);

module.exports = router