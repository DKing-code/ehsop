const settingsModel = require('../models/settingsModel')


//GET SETTING 
const getSetting = async(req,res)=>{
    try {
        const setting = await settingsModel.find()
        if(!setting || setting.length <= 0){
            return res.status(404).json({status:false, message:'No settings'})
        }

        res.status(200).json({status:true,data:setting})
    } catch (error) {
        return res.status(500).json({status:false,message:error.message})
    }
}



// ADD SETTINGS
const addSetting = async(req,res)=>{
    try {
        const data = req.body 
        const addSetting = await settingsModel.create(data)
        if(!addSetting){
            return res.status(400).json({status:false,msg:'Setting not created'})
        }

        res.status(200).json({status:true,data:addSetting})
    } catch (error) {
        return res.status(500).json({status:false,message:error.message})
    }
}


// EDIT SETTING
const editSetting = async(req,res)=>{
    try {
        const data = req.body 
        const addSetting = await settingsModel.updateOne(data)
        if(!addSetting){
            return res.status(400).json({status:false,msg:'Setting not created'})
        }

        res.status(200).json({status:true,data:addSetting})
    } catch (error) {
        return res.status(500).json({status:false,message:error.message})
    }
}

module.exports = {
    getSetting,
    addSetting,
    editSetting,

}