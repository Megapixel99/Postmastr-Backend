
const nodemailer = require("nodemailer");
const moment = require('moment');
const env = require('./environment.js');

// async..await is not allowed in global scope, must use a wrapper
module.exports = 
// async..await is not allowed in global scope, must use a wrapper
async function main(newPackage) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  //let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: `gmail`,
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "postmastr1@gmail.com", // generated ethereal user
      pass: (env.appPass).toString(), // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"APU Mail Services" <postmastr1@gmail.com>', // sender address
    to: newPackage.recipientMail, // list of receivers
    subject: "You've got mail✔", // Subject line
    text: `Dear Student,\n A package was received for you at our mailroom.\nPackage Info:\nRecipient Name: ${newPackage.recipient}\nCarrier: ${newPackage.carrierName||"Unknown Carrier"}\nDate Received:
    ${newPackage.dateRecieved ? moment(newPackage.dateRecieved, 'YYYY-MM-DD').format("dddd MMMM Do, YYYY") : "Unknown"}\nTracking Number:${newPackage.trackingNumber||"Unknown"}\nplease allow 1-2 days for processing`, // plain text body'
  });
  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  return;

}
