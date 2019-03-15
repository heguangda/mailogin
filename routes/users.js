var express = require('express');
var router = express.Router();
const userController = require('../controller/userController')
function handleerror(err){
  console.log(err)
}
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register',function(req, res, next){
  console.log('register--------')
  console.log(req.body)
  userController.register(req.body)
  .then(result => res.json(result))
  .catch(err => {
    console.log(err)
    next(err)
  })
})

router.post('/login',function(req,res,next){
  userController.login(req.body)
  .then(result => res.json(result))
  .catch(err => {
    console.log(err)
    next(err)
  })
})


router.get('/mailcheck',function(req,res,next){
  userController.mailcheck(req.query)
  .then(result => res.json(result))
  .catch(err => {
    console.log(err)
    next(err)
  })
})
// router.post('/sendCheckLink',function(req, res){
//   userController.sendCheckLink(req.body)
//   .then(result => res.json(result))
//   .catch(err => {
//     res.status(500)
//     res.json(err)
//   })
// })
module.exports = router;
