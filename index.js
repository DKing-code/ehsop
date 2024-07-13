const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const runCronJob = require('./utils/cronjob');


const app = express();
dotenv.config()

// MIDDLEWARES
app.use(express.json({ limit: '100mb' }));
app.use(cors({
    origin: '*', // Allow requests from any origin (replace '*' with specific origin if needed)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allow specified HTTP methods
    allowedHeaders: 'Content-Type,Authorization', // Allow specified headers
    preflightContinue: false, // Disable preflight requests caching
    optionsSuccessStatus: 204 // Set the status code for successful OPTIONS requests
}));

// MONGODB CONNECTION
mongoose.connect(process.env.DB_URL).then(()=>{
    console.log('DB connected');
    // RUN CRON JOB
    runCronJob()
    app.listen(5000, ()=>{
        console.log('Server running...')
    })
}).catch(error=>{
    console.log("Server eror")
})

/********* SWAGGER API CONFIGS */

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Your API Documentation',
            version: '1.0.0',
            description: 'API documentation for your Express application',
        },
    },
    apis: ['./routes/*.js'], // Path to the API routes
};
const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

/********* SWAGGER API CONFIGS */



// ROUTES IMPORTS
const userRoute = require('./routes/userRoute')
const productRoutes = require('./routes/productRoute')
const orderRoutes = require('./routes/orderRoute')
const paymentRoute = require('./routes/paymentRoute')
const addressRoute = require('./routes/addressRoute')
const categoryRoute = require('./routes/categoryRoute')
const cartRoute = require('./routes/cartRoute')
const deliveryPricesRoute = require('./routes/deliveryPricesRoute')
const settingsRoute = require('./routes/settingsRoute');




// ROUTES
app.use('/user', userRoute) 
app.use('/product', productRoutes)
app.use('/order', orderRoutes)
app.use('/payment', paymentRoute)
app.use('/address', addressRoute)
app.use('/category', categoryRoute)
app.use('/cart', cartRoute)
app.use('/deliveryPrices', deliveryPricesRoute)
app.use('/settings',settingsRoute)



