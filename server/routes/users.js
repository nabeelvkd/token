var express = require('express');
var router = express.Router();
var userHelper=require('../helpers/userHelper')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/:category', async (req, res) => {
  const result = await userHelper.getBusinessByCategory(req.params.category)
  if (!result.success){
    res.status(400).json("internal error")
  }
  res.status(200).json(result)
});


module.exports = router;
