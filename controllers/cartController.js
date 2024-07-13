const cartModel = require('../models/cartModel')
const productModel = require('../models/productModel')


const getAllCarts = async(req,res)=>{
    try {
        const cartItems = await cartModel.find()
        if(!cartItems){
            return res.status(400).json({status:false,msg:"Failed"})
        }
        res.status(200).json({status:true,msg:cartItems})
    } catch (error) {
        return res.status(500).json({status:false,msg:error.message})
    }
}



// GETTING ONE USER CART
const getUserCart = async (req, res) => {
    try {
        const { userId } = req.params;

        // Find the user's cart and populate the 'items.productId' field
        const userCart = await cartModel.findOne({ userId }).populate('items.productId');

        if (!userCart) {
            return res.json({ status: false, msg: 'Cart is empty' });
        }

        res.status(200).json({ status: true, data: userCart });
    } catch (error) {
        res.status(500).json({ status: false, msg: error.message });
    }
};




// Function to update user's cart data
const addToCart = async(req,res)=> {
    try {
        const { userId, newItem ,sender} = req.body;
        console.log(userId,newItem);

        // Find the cart for the provided userId
        let cart = await cartModel.findOne({ userId });

        // If cart doesn't exist, create a new one
        if (!cart ) {
            cart = new cartModel({ userId, items: [],sender });
        }

        // Check if the item already exists in the cart
        const existingItem = cart?.items.find(item => item.productId.toString() === newItem.productId);

        if (existingItem) {
            return res.status(200).json({ status: false, msg: "Item already added to cart." });
        } else {
        // If the item doesn't exist, add it to the items array in the cart
            cart?.items.push(newItem);
        }

        // Save the updated cart
        await cart.save();

        res.status(200).json({status: true, msg: "Item added to cart successfully.", cart });

    } catch (error) {
        return res.status(500).json({status:false,msg:error.message})
    }
}




// REMOVE ITEM FROM CART
const removeFromCart = async (req, res) => {
    try {
        const { userId, productId } = req.body;

        // Find the user's cart
        let cart = await cartModel.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ status: false, message: 'Cart is empty' });
        }

        // Find the index of the item in the cart's items array
        const existingItem = cart.items.find(item => item.productId.toString() === productId.toString());

        if (!existingItem) {
            return res.status(404).json({ status: false, message: 'Not Found' });
        }

        // Remove the item from the cart's items array
        cart.items.splice(existingItem, 1);

        // Save the updated cart
        const updatedCart = await cart.save();
        
        res.status(200).json({ status: true, msg: "Removed Successfully" });
    } catch (error) {
        console.error('Error removing item from cart:', error);
        res.status(500).json({ status: false, message: 'Internal Server Error' });
    }
}





// INCREASE OR DECREASE QUANTITY OF ITEM
const updateQuantity = async (req, res) => {
    try {
        const { userId, productId,operator } = req.body;

        // Find the cart for the provided userId
        let cart = await cartModel.findOne({ userId });

        // If cart doesn't exist, return an error
        if (!cart) {
            return res.status(404).json({ status: false, msg: "Cart not found for the user." });
        }

        // Find the item in the cart
        const existingItem = cart.items.find(item => item.productId.toString() === productId.toString());

        // If the item doesn't exist, return an error
        if (!existingItem) {
            return res.status(404).json({ status: false, msg: "Item not found in the cart." });
        }

        if(operator === '+'){ 
          // Increase the quantity of the existing item by 1
            existingItem.quantity++;
        }

        if(operator === '-'){ 
            // Check if the quantity is greater than 1. If it isn't, return
            if(existingItem.quantity < 2){
                return res.status(400).json({ status:false ,msg:"The quantity should be more than one"});
            }else{
                // Increase the quantity of the existing item by 1
                existingItem.quantity--;
            }
        }

        // Save the updated cart
        await cart.save();

        res.status(200).json({ status: true, msg: `${operator=='+'? 'increased':'decreased'}` });

    } catch (error) {
        res.status(500).json({ status: false, msg: "Internal server error." });
    }
};



module.exports = {
    getAllCarts,
    addToCart,
    getUserCart,
    removeFromCart,
    updateQuantity
}