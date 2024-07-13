// ENCRYPT PASSWORD
const bcrypt = require('bcryptjs')

// ENCRYPT PASSWORD
async function encrypt(password){
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password,salt)
    return hashedPassword;
}


// DECRYPT PASSWORD
async function decrypt(hashedPassword,plainpassword){
    const validatePassword = await bcrypt.compare(hashedPassword,plainpassword)
    return validatePassword;
}


module.exports = {
    encrypt,
    decrypt
}
