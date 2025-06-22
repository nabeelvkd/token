var express = require('express');
var router = express.Router();
var userHelper=require('../helpers/userHelper')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/listing/:category', async (req, res) => {
  const result = await userHelper.getBusinessByCategory(req.params.category)
  if (!result.success){
    res.status(400).json("internal error")
  }
  res.status(200).json(result)
});

router.get('/businessprofile/:category/:businessId',async(req,res)=>{
  try{
    result=await userHelper.getBusiness(req.params.businessId)
    if(!result.success){
      res.status(400).json({message:'internal error'})
    }
    res.status(200).json(result)
  }catch(error){
    res.status(400).json({message:error.message})
  }
})

router.post('/booktoken',async(req,res)=>{
  try{
    result=await userHelper.bookToken(req.body)
    if(!result.success){
      return res.status(400).json({message:"internal error"})
    }
    return res.status(200).json(result)
  }catch(error){
    return res.status(400).json({message:error.message})
  }
})

router.get('/token/:tokenId',async(req,res)=>{
  try{
    result=await userHelper.getTokenStatus(req.params.tokenId)
    
    if(!result.status){
      res.status(400)
    }
    return res.status(200).json(result)
  }catch(error){
    return res.status(400).json({message:error.message})
  }
})

module.exports = router;
