const mail = require('../model/mailSender');
const usermodel = require('../model/user');
const utils = require('../model/utils')
const mailconfig = require('../config/mailconfig')
async function sendCheckLink(params){
    let mailAddress = params.mailAddress
    if (!mailAddress) {
        throw('邮箱地址不能为空')
    }
    if(!utils.checkMailaddressFormat(mailAddress)) {
        throw('邮箱格式不正确')
    }
    let opitons = {
        header: {type:'CHECK_LINK_SECRET'},
        payload: {mailAddress:mailAddress}
    }
    let addressjwt = utils.getjwt(opitons)
    let link = mailconfig.check_url + addressjwt 
    let mailOpitons = {
        topic: "注册验证 👻", // sender address
        to: mailAddress, // list of receivers
        subject: "注册验证", // Subject line
        // text: "Hello world?", // plain text body
        htmlbody: "<b><a href='"+ link + "'>点击验证</a></b>" // html body
    };
    await mail.sendMail(mailOpitons)
    return { message:'验证地址已发送到你的邮箱中，请点击邮箱的验证地址' }
}


async function register(data){
    let mailAddress = data.mailAddress
    if (!mailAddress) {
        return {code: 1, msg: '账号不能为空'}
    }
    let header  = {
        type: 'SECRET'
    }
    let payload = {
        mailAddress: mailAddress
    }
    let opitons = {
        header: header,
        payload : payload
    }
    let jwt = utils.getjwt(opitons)
    let accountData = {
        mailAddress: mailAddress
    }
    let account = await usermodel.getAccountbymailaddress(mailAddress)
    if (account) {
        return {code: 2 ,msg: '该邮箱已被注册过'}
    }
    await usermodel.addNewAccount(accountData)
    await sendCheckLink({mailAddress:mailAddress})
    return {code: 0, token: jwt, msg: '验证连接已发送到您的邮箱上'}
}

async function login(data){
    let jwt = data.token
    let check_result = utils.checkJwt(jwt)
    if(!check_result.code) {
        return {code: 3, msg: '验证失败'}
    }
    let jwtData = check_result.jwtData
    let mailAddress = jwtData.payload.mailAddress
    let account = await usermodel.getAccountbymailaddress(mailAddress)
    if (!account) {
        return {code: 4 ,msg: '没有该账号'}
    }
    let accountData = {
        user_id: account.user_id,
        username: account.mailAddress
    }
    return {code:0, data:accountData, msg: '登陆成功'}
}

async function mailcheck(data){
    let jwt = data.token
    let result = utils.checkJwt(jwt)
    if (!result.code) {
        return {code: 10, msg:'非法token'}
    }
    let jwtData = result.jwtData;
    let payload = jwtData.payload
    let mailAddress = payload.mailAddress
    let accountData = await usermodel.getAccountbymailaddress(mailAddress)
    if (!accountData) {
        return {code: 4, msg:'没有该账户'}
    }
    let user_id = accountData.user_id
    let update_result = await usermodel.updateMailCheck(user_id, mailAddress)
    if (!update_result.code) {
        return {code: 8,msg: update_result.msg}
    }
    return {code: 0, msg: '验证成功'}
}

exports.sendCheckLink = sendCheckLink
exports.register = register
exports.login = login
exports.mailcheck = mailcheck