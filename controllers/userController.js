const userModel = require('../models/userModel')
const otpModel = require('../models/emailOtpModel')
const {encrypt,decrypt} = require('../utils/encryption')
const {createToken} = require('../utils/jwt');
const { generateOTP,verifyOTP } = require('../utils/otp');
const generateUniqueId = require('generate-unique-id');
const sendEmail  = require('../utils/email')


// GETTING ALL REGISTERED USRS
const getAllUsers = async(req,res) =>{

    try{
        const users = await userModel.find({}).select('-password');
        if(!users){
            return res.status(400).json({status:'false',msg:'No users found'});
        }
        res.status(200).json({status:true,data:users})
    }catch(err){
        res.status(400).json({status:false,msg:err.message});
    }
}

const getUserCount = async (req, res) => {
    try {
        // Get the total number of users
        const userCount = await userModel.countDocuments();

        return res.status(200).json({ status: true, data: userCount });
    } catch (error) {
        console.error('Error fetching user count:', error);
        return res.status(500).json({ status: false, msg: 'Internal server error' });
    }
};

// GET SINGLE USER
const getSingleUser = async(req,res) =>{
    try {
        const {id} = req.params
        const getUser = await userModel.findOne({_id:id}).select('-password')
        if(!getUser){
            return res.status(400).json({status:false, msg:'User not found'});
        }
        res.status(200).json({status:true, data:getUser})
    } catch (error) {
        res.status(500).json({status:false,msg:error.message})
    }
}

// ADDING NEW USER
const addUser = async(req,res) =>{
    try {
        const data= req.body
        const hashedPassword = await encrypt(data.password)
        const createUser = await userModel.create({...data,password:hashedPassword})
        if(!createUser){
            return res.status(400).json({status: false,msg:'User not created'})
        }
        const token = createToken(createUser._id)

        const userData = { ...createUser.toObject(), password: undefined };

        res.status(201).json({status:true,data:{token,userData}})
    } catch (error) {
        res.status(500).json({status:false,msg:error.message})
    }
}


// LOGIN USER
const loginUser = async(req,res)=>{
    try {
        const {email,phone,password} = req.body
        const userExist = await userModel.findOne({$or: [{ email}, { phone}]});

        if (!userExist) {
            return res.json({status: false,msg:'Invalid Credentials'})
        }
        // VERIFY USER PASSWORD
        const verifyPassword = await decrypt(password,userExist.password)
        // If password is verified
        if (verifyPassword) {
            // Create token for authentication
            const token = createToken(userExist._id);

            // Exclude password field from user data
            const userData = { ...userExist.toObject(), password: undefined };

            // Return token and user data
            return res.status(200).json({ status: true, data: { token, userExist: userData } });
        } else {
            return res.status(400).json({ status: false, msg: 'Invalid Credentials' });
        }

    } catch (error) {
        res.status(500).json({status:false,msg:error.message})
    }
}


// RESET PASSWORD
const resetPassword = async(req, res) => {
    try {
        const { email, phone, newPassword } = req.body;

        const userExist = await userModel.findOne({$or: [{ email}, { phone}]})
        if (!userExist) {
            return res.status(400).json({ status: false, msg: 'User not found' });
        }

        const hashedPassword = await encrypt(newPassword)
        // Set the new password for the user
        userExist.password = hashedPassword;
        // Save the updated user document
        await userExist.save();

        return res.status(200).json({ status: true, msg: 'Password reset successfully' });

    } catch (error) {
        return res.status(500).json({ status: false, msg: error.message });
    }
}


// EDIT USER
const editUser= async(req,res) =>{
    try {
        const {id} = req.params
        const editProduct = await userModel.updateOne({_id:id},req.body)
        res.json(editProduct)
    } catch (error) {
        res.status(500).json({status:false,msg:error.message})
    }
}

// DELETE USER
const deleteUser= async (req,res) =>{
    try {
        const {id} = req.params
        const deletedUser = await userModel.deleteOne({_id : id})
        if(!deletedUser){
            return res.status(400).json({status: true, msg:"Not Deleted"})
        }
        res.status(200).json({status: true, msg:'Deleted'})
    } catch (error) {
        res.status(500).json({status:false,msg:error.message})
    }
}

/********************************************************************** */

// SEND OTP 
const sendOtp = async(req,res)=>{
    try {
        const {phone} = req.body
        // CHECK OF USERS PHONE NUMBER EXIST
        const user = await userModel.findOne({phone})
        if(!user){
            return res.status(404).json({status:false,msg:'Not Found'})
        }

        const sentOTP = await generateOTP(user.phone)

        if(sentOTP.code != "1000"){
            return res.status(400).json({status:false,msg:sentOTP.message})
        }

        return res.status(200).json({status:true,msg:sentOTP.message})

    } catch (error) {
        res.status(500).json({status:false,msg:error.message})
    }
}


// VERIFY OTP
const verifyotp = async(req,res)=>{
    try {
        const {otp,phone} = req.body
        const verified = await verifyOTP(otp,phone)

        if(verified !== "Successful"){
            return res.status(404).json({status:false,msg:verified})
        }
        res.status(200).json({status:true,msg:verified})

    } catch (error) {
        res.status(500).json({status:false,msg:error.message})
    }
}

// SEND EMAIL OTP
const sendEmailOtp = async(req, res) => {
    try {
        const { email } = req.body;

        // CHECK IF EMAIL EXISTS IN DATABASE
        const user = await userModel.find({ email });
        if (user.length == 0 || !user) {
            return res.status(404).json({ status: false, msg: 'User not found' });
        }

        // GENERATE 6 DIGITS CODE 
        const otpCode = generateUniqueId({ length: 6 });
        const formatOTP = otpCode.toUpperCase();

        // STORE USER EMAIL AND OTP CODE IN THE DATABASE
        let storeOtp = await otpModel.create({ email, otpCode: formatOTP });

        // SEND THE OTP TO THE USER'S EMAIL
        let emailMsg = `Your OTP is: ${storeOtp.otpCode} this is valid until 5 minutes`;
        try {
            await sendEmail(emailMsg, email, 'One Time Password');
            res.json({ status: true, msg: 'Otp sent successfully' });
        } catch (error) {
            console.error('Error sending OTP email:', error);
            res.status(500).json({ status: false, msg: 'Failed to send OTP email' });
        }

    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ status: false, msg: 'Failed to send OTP' });
    }
}




// VERIFY EMAIL OTP
const verifyEmailOtp = async(req, res) => {
    try {
        const { email, otp } = req.body;

        // Find the OTP entry for the provided email
        const verifyOtp = await otpModel.findOne({ email });

        // If no OTP entry is found for the email
        if (!verifyOtp) {
            return res.status(404).json({ status: false, msg: 'Invalid Email' });
        }

        // Check if the provided OTP matches the stored OTP
        if (otp !== verifyOtp.otpCode) {
            return res.status(400).json({ status: false, msg: 'Invalid OTP' });
        }

        // Check if the OTP is expired (valid for 5 minutes)
        const otpExpirationTime = new Date(verifyOtp.createdAt.getTime() + 4 * 60 * 1000);
        const currentTime = new Date();
        if (currentTime > otpExpirationTime) {
            return res.status(400).json({ status: false, msg: 'OTP has expired' });
        }

        // OTP is valid
        res.json({ status: true, msg: 'OTP verified successfully' });

    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ status: false, msg: 'Failed to verify OTP' });
    }
}



module.exports = {
    getAllUsers,
    getSingleUser,
    addUser,
    editUser,
    deleteUser,
    loginUser,
    sendOtp,
    verifyotp,
    resetPassword,
    sendEmailOtp,
    verifyEmailOtp,
    getUserCount
}