const categoryModel = require('../models/categoryModel')



// GETTING ALL REGISTERED USRS
const getAllCategories = async(req,res) =>{
    try{
        const categories = await categoryModel.find()
        if(!categories){
            return res.status(400).json({status:'false',msg:'No users found'});
        }
        res.status(200).json({status:true,data:categories})
    }catch(err){
        res.status(400).json({status:false,msg:err.message});
    }
}

// GET SINGLE Category
const getSingleCategory = async(req,res) =>{
    try{
        const {id} = req.params
        const category = await categoryModel.findOne({_id:id})
        if(!category){
            return res.status(400).json({status:'false',msg:'Category not found'});
        }
        res.status(200).json({status:true,data:category})
    }catch(err){
        res.status(400).json({status:false,msg:err.message});
    }
}

// ADDING NEW Category
const addCategory = async(req,res) =>{
    try {
        const {category} = req.body
        const checkIfCategoryExist = await categoryModel.find({category: category})

        if(checkIfCategoryExist.length <= 0){
            // CREATE NEW CATEROTY
            const newCategory = await categoryModel.create({category: category})
            return res.status(201).json(newCategory); 
        }else{
            return res.status(400).json({status: false, msg: 'Category already exists'});  
        }

    } catch (error) {
        res.status(500).json({status:false,msg:error.message});
    }
}



// EDIT Category
const editCategory= async(req,res) =>{
    try {
        const {id} = req.params
        const editCateogry = await categoryModel.updateOne({_id:id},req.body)
        if(!editCateogry){
            return res.status(500).json({status:false, msg:'Error updating category'})
        }
        res.status(200).json({status:true,msg:'Category updated successfully'})
    } catch (error) {
        res.status(500).json({status:false,msg:error.message})
    }
}



// DELETE Category
const deleteCategory= async(req,res) =>{
    try {
        const {id} = req.params
        const deletedCategory = await categoryModel.deleteOne({_id : id})
        if(!deletedCategory){
            return res.status(400).json({status: true, msg:"Failed to delete"})
        }
        res.status(200).json({status: true, msg:'Deleted successfully'})
    } catch (error) {
        res.status(500).json({status:false,msg:error.message})
    }
}


module.exports = {
    getAllCategories,
    getSingleCategory,
    addCategory,
    editCategory,
    deleteCategory
}