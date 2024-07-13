
// Import the Nodemailer library
const nodemailer = require('nodemailer');


async function sendEmail(msg, recipient, subject) {
    return new Promise((resolve, reject) => {
        // Create a transporter using SMTP transport
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true, // use TLS
            auth: {
                user: process.env.AUTH_EMAIL,
                pass: process.env.AUTH_PASSWORD,
            }
        });

        // Email data
        const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: recipient,
            subject: subject,
            text: msg,
        };

        // Send the email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                // console.error('Error sending email:', error);
                reject(error); // Reject the promise with the error
            } else {
                // console.log('Email sent:', info.response);
                resolve(info.response); // Resolve the promise with the email response
            }
        });
    });
}


module.exports= sendEmail