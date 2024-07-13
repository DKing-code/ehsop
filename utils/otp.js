const axios = require("axios")
/**  
 * FUNCTIONS TO GENERATE AND VERIFY OTP
 * 
 */


/**  
 * FUNCTION TO GENERATE OTP AND SEND TO CLIENT
 * @param number
 */

async function generateOTP(phonenumber) {
    let resp
    try {
        const data = {
            expiry: 10,
            length: 6,
            medium: 'sms',
            message: 'This is OTP from reveal, %otp_code%',
            number: phonenumber,
            sender_id: process.env.SMS_BUSINESS_ID,
            type: 'numeric',
        };

        const headers = {
            'api-key': process.env.OTP_API_KEY,
        }
        // MAKE GENERATE OTP REQUEST

       await axios.post('https://sms.arkesel.com/api/otp/generate', data, 
        { headers })
        .then(response => {
            resp = response.data
        })
        .catch(error => {
            resp = response
        });

    } catch (error) {
        console.log('Error in generating OTP')
        return 'Failed'
    }

    return resp
}


/**  
 * VERYIFY USER OTP
 * @param otpValue
 * @params phonenumber
 */

async function verifyOTP(otpValue,phonenumber) {

    let resp;

    try {
        const data = {
            code: otpValue,
            number: phonenumber
        };
    
        const headers = {
            'api-key': process.env.OTP_API_KEY,
        }
    
        await axios.post('https://sms.arkesel.com/api/otp/verify', data, 
        { headers })
        .then(response => {
            // console.log(response.data);
            resp = response
        })
        .catch(error => console.log(error));
    } catch (error) {
        console.error(error);
    }

    return resp.data.message;
}



module.exports = {
    generateOTP,
    verifyOTP
}
