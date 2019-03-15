const request = require('request')

let options = {
    url: 'http://localhost:3000/users/register',
    method: 'POST',
    form: {
        mailAddress: '2322831310@qq.com'
    }
}
request(options,function(err,res,body){
    if (err) {
        console.log(err)
    } else {
        console.log(res.body)
    }
})