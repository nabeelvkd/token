var express = require('express');
var router = express.Router();
var categoryHelper = require('../helpers/categoryHelper');

router.get('/', function (req, res, next) {
  res.send('admin');
});

router.post('/addcategory', async (req, res) => {
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

router.post('/delete-category', async (req, res) => {
  try {
    const result = await categoryHelper.deleteCategory(req.query.id)
    if (result.error) {
      res.status(400).json({ message: result.error })
    }
    res.status(200).json({ message: "category deleted" })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

router.get('/categories', async (req, res) => {
  try {
    categories = await categoryHelper.getAllCategories()
    res.status(200).json(categories)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

router.get('/toggleactive', async (req, res) => {
  try {
    const result = await categoryHelper.toggleActive(req.query.id)
    if (result.error) {
      res.status(400).json({ message: result.error })
    }
    res.status(200).json({ message: "success" })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

router.post('/updateacategory', async (req, res) => {
  try {
    const result = await categoryHelper.updateCategory(req.body)
    if (result.error) {
      res.status(400).json({ message: result.error })
    }
    res.status(200).json({ message: "success" })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

router.post('/addsubcategory', async (req, res) => {
  try {
    const result = await categoryHelper.addSubCategory(req.body)
    if (result.error) {
      return res.status(400).json({ message: result.error })
    }
    return res.status(201).json({ message: 'Category added successfully', subCategory: result.subCategory });
  } catch (error) {
    return res.status(400).json({ message: error.error })
  }
})

router.get('/subcategories',async(req,res)=>{
  try{
    const result=await categoryHelper.getAllSubCategories()
    if(result.error){
       res.status(400).json({ message: result.error })
    }
    res.status(200).json(result.subCategories)
  }catch(error){
    res.status(400).json({ message: error.message })
  }
})

router.get('/toggle-subcategory', async (req, res) => {
  try {
    const result = await categoryHelper.toggleSubCategoryActive(req.query.id)
    if (result.error) {
      res.status(400).json({ message: result.error })
    }
    res.status(200).json({ message: "success" })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

router.post('/update-subcategory', async (req, res) => {
  try {
    const result = await categoryHelper.updateSubCategory(req.body)
    if (result.error) {
      res.status(400).json({ message: result.error })
    }
    res.status(200).json({ message: "success" })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

module.exports = router;