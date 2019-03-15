const nodemailer = require("nodemailer");
const mailconfig = require('../config/mailconfig')
let transporter

function mailInit(){

  // create reusable transporter object using the default SMTP transport
   transporter = nodemailer.createTransport({
    host: mailconfig.host,
    port: mailconfig.port,
    secure: true, // true for 465, false for other ports
    auth: {
      user: mailconfig.user, // generated ethereal user
      pass: mailconfig.pass // generated ethereal password
    }
  });
}
mailInit()


const sendMail = async function({ to, topic, subject, htmlbody}) {
 // setup email data with unicode symbols

 if (!to || !topic || !subject || !htmlbody) throw(new Error('缺少必要参数'))
 let mailOptions = {
    from: topic + ' <164577216@qq.com>', // sender address
    to: to, // list of receivers
    subject: subject, // Subject line
    // text: "Hello world?", // plain text body
    html: htmlbody // html body
  };

  // send mail with defined transport object
  let info = await transporter.sendMail(mailOptions)
  console.log("info", info)
  console.log("Message sent: %s", info.messageId);
  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

exports.sendMail = sendMail