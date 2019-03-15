const request = require('request')

let options = {
    url: 'http://localhost:3000/users/login',
    method: 'POST',
    form: {
        mailAddress: '2322831310@qq.com',
        token: 'dHlwZT1TRUNSRVQ=.bWFpbEFkZHJlc3M9MjMyMjgzMTMxMEBxcS5jb20mdGltZXN0YW1wPTE1NTI0OTA1ODI3NzY=.03700380adb8d56d11b2c85ef0f5e5f91baf197a198f49081ac47e9719106c3d'
    }
}
request(options,function(err,res,body){
    if (err) {
        console.log(err)
    } else {
        console.log(res.body)
    }
})