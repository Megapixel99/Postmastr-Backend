
const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
module.exports= async function main(newPackage) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });
  let info = await transporter.sendMail({
    from: '"Postmastr👻" <evelyn.vandervort92@ethereal.email>', // sender address
    to: email, // replace hardcoded value
    subject: "Mail Notice for package from " + newPackage.dateRecieved, // Subject line
    text: "Hello " + newPackage.recipient + " your " + newPackage.carrierName
        + " with tracking number " + newPackage.trackingNo + " has been received.\n Please allow for 1-3 days of processing before picking up.", // plain text body
    html: "<b>Hello world?</b>", // html body
});
console.log("Message sent: %s", info.messageId);
// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

// Preview only available when sending through an Ethereal account
console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
// Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou..
main().catch(console.error);
}


