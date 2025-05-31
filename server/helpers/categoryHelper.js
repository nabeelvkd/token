const Category = require('../models/category');
const slugify = require('slugify');

const addCategory = async (data) => {
  try {
    const existing = await Category.findOne({ name: data.name });
    if (existing) {
      return { error: "Category with this name already exists." };
    }

    const slug = slugify(data.name, { lower: true, strict: true });

    const category = new Category({
      name: data.name,
      slug,
      iconUrl: data.iconUrl || "",
      isActive: data.isActive !== undefined ? data.isActive : true,
      priority: data.priority || 0,
    });

    await category.save();

    return { success: true, category };
  } catch (error) {
    console.error("Error adding category:", error);
    return { error: "Server error while adding category." };
  }
};

const getAllCategories = async () => {
  try {
    const categories = await Category.find().sort({ priority: 1, name: 1 });
    return { success: true, categories };
  } catch (error) {
    console.error("Error fetching all categories:", error);
    return { error: "Server error while fetching categories." };
  }
};

const getAllActiveCategories = async () => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ priority: 1, name: 1 });
    return { success: true, categories };
  } catch (error) {
    console.error("Error fetching active categories:", error);
    return { error: "Server error while fetching categories." };
  }
};

const updateCategory = async (id, data) => {
  try {
    const category = await Category.findById(id);
    if (!category) {
      return { error: "Category not found." };
    }

    if (data.name && data.name !== category.name) {
      const existing = await Category.findOne({ name: data.name, _id: { $ne: id } });
      if (existing) {
        return { error: "Another category with this name already exists." };
      }
      category.name = data.name;
      category.slug = slugify(data.name, { lower: true, strict: true });
    }

    if (data.iconUrl !== undefined) category.iconUrl = data.iconUrl;
    if (data.isActive !== undefined) category.isActive = data.isActive;
    if (data.priority !== undefined) category.priority = data.priority;

    await category.save();

    return { success: true, category };
  } catch (error) {
    console.error("Error updating category:", error);
    return { error: "Server error while updating category." };
  }
};

const deleteCategory = async (id) => {
  try {
    const category = await Category.findById(id);
    if (!category) {
      return { error: "Category not found." };
    }

    await category.deleteOne();

    return { success: true, message: "Category deleted successfully." };
  } catch (error) {
    console.error("Error deleting category:", error);
    return { error: "Server error while deleting category." };
  }
};

module.exports = {
  addCategory,
  getAllCategories,
  getAllActiveCategories,
  updateCategory,
  deleteCategory,
};
