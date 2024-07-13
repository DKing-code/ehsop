const router = require('express').Router()


const {getSetting,addSetting,editSetting} = require('../controllers/settingsController')


// GET SETTING DATA
router.get('/',getSetting)

// ADDING SETTING DATA
router.post('/',addSetting)


// EDIT SETTING DATA
router.put('/',editSetting)


module.exports = router