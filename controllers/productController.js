
const productModel = require('../models/productModel')
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});




// GETTING ALL REGISTERED USERS
const getAllProducts = async (req, res) => {
    try {
        const products = await productModel.find().populate('category')
        if (!products) {
            return res.status(400).json({ status: 'false', msg: 'No users found' });
        }
        res.status(200).json({ status: true, data: products })
    } catch (err) {
        res.status(400).json({ status: false, msg: err.message });
    }
}

const getfilterProducts =  async (req, res) => {
    try {
        // Build query object
        let query = {};

        // Filter by name (case-insensitive)
        if (req.query.name) {
            query.name = { $regex: req.query.name, $options: 'i' };
        }

        // Filter by SKU
        if (req.query.sku) {
            query.sku = req.query.sku;
        }

        // Filter by price range
        if (req.query.minPrice && req.query.maxPrice) {
            query.price = { $gte: req.query.minPrice, $lte: req.query.maxPrice };
        } else if (req.query.minPrice) {
            query.price = { $gte: req.query.minPrice };
        } else if (req.query.maxPrice) {
            query.price = { $lte: req.query.maxPrice };
        }

        // Filter by inStock
        if (req.query.inStock) {
            query.inStock = req.query.inStock === 'true';
        }

        // Filter by category
        // if (req.query.category) {
        //     query.category = { $in: [req.query.category] };
        // }

        if (req.query.category) {
            query.category = {
                $elemMatch: {
                    $regex: req.query.category,
                    $options: 'i'
                }
            };
        }

        // Filter by discount
        if (req.query.onDiscount) {
            query.onDiscount = req.query.onDiscount === 'true';
        }

        // Filter by size
        if (req.query.size) {
            query.itemSizes = req.query.size;
        }

        // Filter by color
        if (req.query.color) {
            query.itemColors = req.query.color;
        }

        // Pagination logic
        const page = parseInt(req.query.page) || 1; // Default page is 1
        const limit = parseInt(req.query.limit) || 10; // Default limit is 10 products per page
        const skip = (page - 1) * limit; // Calculate how many products to skip

        // Get total count of products that match the filter criteria
        const totalProducts = await productModel.countDocuments(query);

        // Execute the query with pagination
        const products = await productModel.find(query).skip(skip).limit(limit);

        // Respond with paginated products and additional information
        res.status(200).json({
            success: true,
            count: products.length,
            page,
            totalPages: Math.ceil(totalProducts / limit), // Total pages based on limit
            totalProducts, // Total products for this query
            data:products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching products",
            error: error.message
        });
    }
};





// GET SINGLE Product
const getSingleProduct = async (req, res) => {
    try {
        const { id } = req.params
        const product = await productModel.findOne({ _id: id })
        if (!product) {
            return res.status(400).json({ status: false, msg: 'User not found' });
        }
        res.status(200).json({ status: true, data: product })
    } catch (error) {
        res.status(500).json({ status: false, msg: error.message })
    }
}

// ADDING NEW Product
const addProduct = async (req, res) => {
    try {
        const data = req.body
        const files = req.files;
        const imageUrls = [];

        if (files) {
            // Upload each image to Cloudinary
            for (const file of files) {
                const result = await cloudinary.uploader.upload(file.path);
                imageUrls.push(result.secure_url);
            }
        }

        const createProduct = await productModel.create({ ...data, images: imageUrls })

        if (!createProduct) {
            return res.status(400).json({ status: false, message: 'Product not created' })
        }
        res.status(201).json({ status: true, data: createProduct })
    } catch (error) {
        res.status(500).json({ status: false, msg: error.message })
    }
}


// ADD MANY PRODUCTS
const addManyProducts = async (req, res) => {
    try {
        const productsData = req.body; // Products data with image files

        const createProducts = await productModel.insertMany(productsData)
        if (!createProducts) {
            return res.status(400).json({ status: false, message: 'Product not created' })
        }

        res.status(201).json({ status: true, data: createProducts })
    } catch (error) {
        res.status(500).json({ status: false, msg: error.message })
    }
}


// EDIT Product
// const editProduct = async (req, res) => {
//     try {
//         const { id } = req.params
        
//         const editProduct = await productModel.updateOne({ _id: id }, req.body)
//         res.json(editProduct)
//     } catch (error) {
//         res.status(500).json({ status: false, msg: error.message })
//     }
// }

// // DELETE Product
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        // Retrieve the product to get the image URLs
        const product = await productModel.findById(id);
        if (!product) {
            return res.status(404).json({ status: false, message: 'Product not found' });
        }
        

        // Extract public IDs from Cloudinary URLs
        const extractPublicId = (url) => {
            const parts = url?.split('/');
            const publicIdWithExtension = parts[parts?.length - 1];
            const publicId = publicIdWithExtension?.split('.')[0]; // Remove the file extension
            return publicId;
        };

        const imageUrls = product.images;
        const publicIds = imageUrls.map(url => extractPublicId(url));

        // Delete images from Cloudinary
        for (const publicId of publicIds) {
            await cloudinary?.uploader?.destroy(publicId);
        }

        // Delete the product from the database
        const deleteProduct = await productModel.deleteOne({ _id: id });

        res.json({ status: true, data: deleteProduct });
    } catch (error) {
        res.status(500).json({ status: false, msg: error.message });
    }
};


const editProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const files = req.files;
        const newImageUrls = [];

        // Retrieve the existing product data
        const existingProduct = await productModel.findById(id);
        if (!existingProduct) {
            return res.status(404).json({ status: false, message: 'Product not found' });
        }

        // Upload new images to Cloudinary if any
        if (files && files.length > 0) {
            for (const file of files) {
                const result = await cloudinary.uploader.upload(file.path);
                newImageUrls.push(result.secure_url);
            }
        }

        // Prepare updated images array
        let updatedImages = existingProduct.images;
        if (newImageUrls.length > 0) {
            // New images were uploaded, update the images array
            updatedImages = [...existingProduct.images, ...newImageUrls];
        }

        // Update the product with new data and updated images
        const updatedProductData = { ...data, images: updatedImages };
        const updatedProduct = await productModel.findByIdAndUpdate(id, updatedProductData, { new: true });

        if (!updatedProduct) {
            return res.status(400).json({ status: false, message: 'Product not updated' });
        }

        res.json({ status: true, data: updatedProduct });
    } catch (error) {
        res.status(500).json({ status: false, msg: error.message });
    }
};







module.exports = {
    getAllProducts,
    getSingleProduct,
    addProduct,
    editProduct,
    deleteProduct,
    addManyProducts,
    getfilterProducts
}