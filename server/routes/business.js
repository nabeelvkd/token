var express = require('express');
var router = express.Router();
var businessHelper=require('../helpers/businessHelper')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('register',async(req,res)=>{
  try{
    const result=await businessHelper.addBusiness(req.body)
    if (result.error){
      res.status(400).json({message:error.message})
    }
    res.status(201).json(result)
  }catch(error){
    res.status(400).json({message:error.message})
  }
})

module.exports = router;
