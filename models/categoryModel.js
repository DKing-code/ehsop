/**  
 * MODEL FOR CATEGORY COLLECTION
 */

const mongoose = require('mongoose');

const catergorySchema = mongoose.Schema({
    category : {type: String, required: true},
})

const categoryModel = mongoose.model('Category',catergorySchema)

module.exports = categoryModel