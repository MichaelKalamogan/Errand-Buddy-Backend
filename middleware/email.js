require('dotenv').config()
const nodemailer = require('nodemailer');


//Function to send an email
function sendEmail(emailAdd, subject, emailBody) {

    let transport = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const message = {
        from: process.env.EMAIL_ADDRESS, // Sender address
        to: emailAdd,         //  recipients
        subject: subject, // Subject line
        text: emailBody // link to reset
    };

    transport.sendMail(message, function(err, info) {
        if (err) {
            console.log(err)
        } 
    })
}

module.exports = sendEmail




