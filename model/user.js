const query = require('./db')
const crypto = require('crypto')
const datacache = require('./datacache')
const SEVEN_DAY = 86400 * 1000 * 7
async function loadhotaccount() {
    let time = new Date(new Date().getTime() - SEVEN_DAY)
    
    let result = await query('select * from account where activetime > ?',[time])
    if (result.length > 0) {
        for (let i in result) {
            let accountData = {}
            accountData.user_id = result[i].id
            accountData.mailaddress = result[i].mail_address
            accountData.password = result[i].password
            accountData.activetime = result[i].activetime
            accountData.is_check = result[i].is_check
            setAccount(accountData)
        }
        
        console.log('加载完所有账号')
    }

}
async function getAccountbyid(user_id){
    let accountData = datacache.getAccountbyid(user_id)
    if(!accountData) { //内存中找不到账号，去数据库找
        let queryresult = await query('select * from account where id = ?', [user_id])
        if (queryresult.length < 1) {
            return ''
        } 
        accountData = {}
        accountData.user_id = queryresult[0].id
        accountData.mailaddress = queryresult[0].mailaddress
        accountData.password = queryresult[0].password
        accountData.activetime = queryresult[0].activetime
        accountData.is_check = queryresult[0].is_check
        setAccount(accountData)
    }
    return accountData
}

async function getAccountbymailaddress(mailaddress){
    let accountData = datacache.getAccountbyMailaddress(mailaddress)
    if(!accountData) { //内存中找不到账号，去数据库找
        let queryresult = await query('select * from account where mail_address = ?', [mailaddress])
        if (queryresult.length < 1) {
            return ''
        } 
        accountData = {}
        accountData.user_id = queryresult[0].id
        accountData.mailaddress = queryresult[0].mailaddress
        accountData.password = queryresult[0].password
        accountData.activetime = queryresult[0].activetime
        accountData.is_check = queryresult[0].is_check
        setAccount(accountData)
    }
    return accountData
}

function setAccount(accountData){
    datacache.setAccount(accountData)
}

async function updateMailCheck(user_id, mailAddress){
    if (!user_id || !mailAddress) {
        console.log(user_id)
        console.log(mailAddress)
        return {code: false, msg: '缺少参数'}
    }
    await query('update account set is_check = 1 where id = ? and mail_address = ?', [user_id, mailAddress])
    return { code:true }
}

async function addNewAccount(accoutBaseData){
    let mailAddress = accoutBaseData.mailAddress
    let password = crypto.randomBytes(16).toString('base64')
    console.log('password',password)
    let accountData = {
        mail_address: mailAddress,
        password: password,
        activetime: new Date()
    }
    await query('insert into account set ?', accountData)
}

exports.loadhotaccount = loadhotaccount
exports.getAccountbyid = getAccountbyid
exports.getAccountbymailaddress = getAccountbymailaddress
exports.addNewAccount = addNewAccount
exports.updateMailCheck = updateMailCheck