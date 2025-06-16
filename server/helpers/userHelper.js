const Business = require('../models/business')
const Categories = require('../models/category')

const getBusinessByCategory = async(category)=>{
    try{
        const categoryDoc=await Categories.findOne({slug:category})
        categoryId=categoryDoc._id
        const businesses=await Business.find({category:categoryId})
        return {success:true,businesses}
    }catch(error){
        return {success:false}
    }
}

module.exports={getBusinessByCategory}