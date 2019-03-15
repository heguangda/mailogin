const checkDB = require('../model/checkDB')
async function serverinit() {
    await checkDB()
    const user = require('../model/user')

    await user.loadhotaccount()
}
module.exports = serverinit