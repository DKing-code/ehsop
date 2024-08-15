const router = require('express').Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });


// const upload = multer({storage:multer.memoryStorage()})

// Set storage engine
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/'); // Set the destination folder for uploaded files
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname); // Use the original filename for the uploaded file
//   }
// });

// Initialize multer with options
// const upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 1024 * 1024 * 10 // Set the file size limit to 10 MB (in bytes)
//   }
// });

// IMPORT OF CONTROLLERS
const {addProduct,getAllProducts,getSingleProduct,editProduct,deleteProduct,addManyProducts,getfilterProducts} = require('../controllers/productController')

/**
 * @swagger
 * tags:
 *   - name: Product
 *     description: Endpoints related to product
*/


/**
 * @swagger
 * /product:
 *   get:
 *     summary: Get all products
 *     tags: [Product]
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '##/models/productModel'
 *       '500':
 *         description: Internal server error
 */
// GETTING ALL REGISTERED USRS
router.get('/',getAllProducts)

router.get('/filteredproduct',getfilterProducts)


/**
 * @swagger
 * /product/{id}:
 *   get:
 *     summary: Get all products
 *     tags: [Product]
 *     parameters:
 *       - in : path
 *         name : id
 *         required : true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               items:
 *                 $ref: '##/models/productModel'
 *       '500':
 *         description: Internal server error
 */
// GET SINGLE Product
router.get('/:id',getSingleProduct)



/**
 * @swagger
 * /product:
 *  post:
 *     summary: Add a new product
 *     tags: [Product]
 *     description: Endpoint for adding a new product
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               sku:
 *                 type: string
 *               desc:
 *                 type: string
 *               price:
 *                 type: number
 *               inStock:
 *                 type: boolean
 *               quantityInStock:
 *                 type: number
 *               summary:
 *                 type: string
 *               images:
 *                 type: array
 *                 name: images
 *                 items:
 *                   type: file
 *               onDiscount:
 *                 type: boolean
 *               discountPrice:
 *                 type: number
 *               discountStartDate:
 *                 type: string
 *                 format: date
 *               discountEndDate:
 *                 type: string
 *                 format: date
 *               hasSizes:
 *                 type: boolean
 *               itemSizes:
 *                 type: array
 *                 items:
 *                   type: string
 *               hasColors:
 *                 type: boolean
 *               itemColors:
 *                 type: array
 *                 items:
 *                   type: string
 *               category:
 *                 type: string
 *                 format: objectId
 *     responses:
 *       201:
 *         description: Product added successfully
 *       400:
 *         description: Bad request. Invalid product data.
 *       500:
 *         description: Internal server error
 */
// ADDING NEW Product
router.post("/",upload.array('images', 10), addProduct);


router.post("/addmanyproduct",upload.array('images', 10), addManyProducts);



/**
 * @swagger
 * /product/{id}:
 *   put:
 *     summary: Update a product by ID
 *     tags: [Product]
 *     description: Endpoint for updating an existing product by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product to update
 *     requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                  type: string
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       400:
 *         description: Bad request. Invalid product data.
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */


// EDIT Product
router.put('/:id',upload.array('images', 10),editProduct);


/**
 * @swagger
 * /product/{id}:
 *   delete:
 *     summary: Update a product by ID
 *     tags: [Product]
 *     description: Endpoint for updating an existing product by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product to update
 *       - in: formData
 *         name: name
 *         type: string
 *         required: true
 *         description: The new name of the product
 *       - in: formData
 *         name: sku
 *         type: string
 *         required: false
 *         description: The new SKU of the product
 *       # Include other parameters as needed
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       400:
 *         description: Bad request. Invalid product data.
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */

// DELETE Product
router.delete('/:id',deleteProduct);

module.exports = router