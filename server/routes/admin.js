var express = require('express');
var router = express.Router();
var categoryHelper = require('../helpers/categoryHelper');

router.get('/', function (req, res, next) {
    res.send('admin');
});

router.post('/add-category', async (req, res) => {
  try {
    const result = await categoryHelper.addCategory(req.body);

    if (result.error) {
      return res.status(400).json({ message: result.error });
    }

    return res.status(201).json({ message: 'Category added successfully', category: result.category });
  } catch (error) {
    console.error('Add category error:', error);
    res.status(500).json({ message: 'Server error while adding category' });
  }
});

router.post('/delete-category',async(req,res)=>{
    try{
        const result=await categoryHelper.deleteCategory(req.query.id)
        if (result.error){
            res.status(400).json({message:result.error})
        }
        res.status(200).json({message:"category deleted"})
    }catch(error){
        res.status(400).json({message:error.message})
    }
})

router.get('/categories',async(req,res)=>{
    try{
        categories=await categoryHelper.getAllCategories()
        res.status(200).json(categories)
    }catch(error){
        res.status(400).json({message:error.message})
    }
})

module.exports = router;