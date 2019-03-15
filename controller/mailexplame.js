const mail = require('../model/mailSender')
let mailOpitons = {
    topic: "Fred Foo 👻", // sender address
    to: "164577216@qq.com", // list of receivers
    subject: "Hello ✔", // Subject line
    // text: "Hello world?", // plain text body
    htmlbody: "<b><a href='http://www.baidu.com'>点击验证</a></b>" // html body
  };

mail.sendMail(mailOpitons).catch(err => console.log(err))