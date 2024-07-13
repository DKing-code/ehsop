const axios = require('axios')


/**  
 * SEND SMS TO CLIENT
 * @param recipient
 * @param msg
 */

function sendSMS(recipient, msg) {

    // DATA TO BE SENT
    const data = {
        "sender": process.env.SMS_BUSINESS_ID,
        "message": msg,
        "recipients": [recipient]
    };

    const config = {
        method: 'post',
        url: 'https://sms.arkesel.com/api/v2/sms/send',
        headers: {
            'api-key': process.env.SMS_API_KEY
        },
        data: data
    };

    axios(config)
        .then(function (response) {
            return response.status
        })
        .catch(function (error) {
            console.log(error);
            return false
    });
}


module.exports = {
    sendSMS
}