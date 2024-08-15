const router = require('express').Router();

// IMPORT OF CONTROLLERS
const {addCategory,getAllCategories,getSingleCategory,editCategory,deleteCategory} = require('../controllers/categoryController')


// GETTING ALL REGISTERED USRS
router.get('/',getAllCategories)

// GET SINGLE Category 
router.get('/:id',getSingleCategory)


// ADDING NEW Category
router.post("/", addCategory);

// EDIT Category
router.put('/:id',editCategory);

// DELETE Category
router.delete('/:id',deleteCategory);

module.exports = router