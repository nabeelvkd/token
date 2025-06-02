const Business=require('../models/business')


const addBusiness = async (data) => {
  try {
    const business = new Business(data);
    const savedBusiness = await business.save();
    return savedBusiness;
  } catch (error) {
    console.error('Error adding business:', error);
    throw error;
  }
};

module.exports={addBusiness}
