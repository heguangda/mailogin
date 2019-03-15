let idToaccount = {}
let mailaddressToaccount = {}


function setAccount(account){
    let userid = account.userid
    let mailaddress = account.mailaddress
    if (account.userid) {
        account[userid] = account
    }
    if (mailaddress) {
        mailaddressToaccount[mailaddress] = account
    }
}

function getAccountbyid(userid){
    return account[userid]
}

function getAccountbyMailaddress(mailaddress){
    return mailaddressToaccount[mailaddress]
}

exports.getAccountbyid = getAccountbyid
exports.getAccountbyMailaddress = getAccountbyMailaddress
exports.setAccount = setAccount