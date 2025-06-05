const Business = require('../models/business');
const Service = require('../models/service');
const WorkingHours = require('../models/workingHours');
const Category = require('../models/category');       // Add these
const SubCategory = require('../models/subCategory'); // Add these
const bcrypt = require('bcryptjs');

const registerBusiness = async (business, services, workingHours) => {
  try {
    const existingBusiness = await Business.findOne({ phone: business.phone });
    if (existingBusiness) {
      throw new Error('Phone number already registered');
    }

    // Find category by name
    const categoryDoc = await Category.findOne({ name: business.category });
    if (!categoryDoc) throw new Error('Category not found');

    // Find subcategory by name and category id
    const subCategoryDoc = await SubCategory.findOne({ 
      name: business.subCategory, 
      category: categoryDoc._id 
    });
    if (!subCategoryDoc) throw new Error('Subcategory not found');

    // Replace category and subCategory names with their ObjectIds
    business.category = categoryDoc._id;
    business.subCategory = subCategoryDoc._id;

    // Remove old cat and subCat fields if they exist
    delete business.cat;
    delete business.subCat;

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(business.password, 10);
    business.password = hashedPassword;

    // Create the business
    const newBusiness = await Business.create(business);

    // Create services referencing the new business id
    await Service.create({
      businessId: newBusiness._id,
      services: services
    });

    // Create working hours referencing the new business id
    await WorkingHours.create({
      businessId: newBusiness._id,
      ...workingHours
    });

    return { success: true, businessId: newBusiness._id };

  } catch (error) {
    console.error('Error registering business:', error.message);
    throw error;
  }
};

module.exports = { registerBusiness };
