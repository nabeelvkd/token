var express = require('express');
var router = express.Router();
var businessHelper=require('../helpers/businessHelper')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/register',async(req,res)=>{
  try{
    const result=await businessHelper.registerBusiness(req.body.formData,req.body.services,req.body.workingHours)
    if (result.error){
      res.status(400).json({message:error.message})
    }
    res.status(201).json({message:'success'})
  }catch(error){
    console.log(error)
    res.status(400).json({message:error.message})
  }
})
module.exports = router;
