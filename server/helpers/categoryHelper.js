const Category = require('../models/category');
const SubCategory = require('../models/subCategory')
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
            iconUrl: data.image || "",
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
        const categories = await Category.find().sort({ isActive: -1, priority: -1, name: 1 });
        return { success: true, categories };
    } catch (error) {
        console.error("Error fetching all categories:", error);
        return { error: "Server error while fetching categories." };
    }
};

const getAllActiveCategories = async () => {
    try {
        const categories = await Category.find({ isActive: true }).sort({ priority: -1 });
        return { success: true, categories };
    } catch (error) {
        console.error("Error fetching active categories:", error);
        return { error: "Server error while fetching categories." };
    }
};

const updateCategory = async (data) => {
    try {
        const category = await Category.findById(data._id);
        if (!category) {
            return { error: "Category not found." };
        }

        if (data.name && data.name !== category.name) {
            const existing = await Category.findOne({ name: data.name, _id: { $ne: data._id } });
            if (existing) {
                return { error: "Another category with this name already exists." };
            }
            category.name = data.name;
            category.slug = slugify(data.name, { lower: true, strict: true });
        }

        if (data.image !== undefined) category.iconUrl = data.image;
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

const toggleActive = (async (id) => {
    try {
        const category = await Category.findById(id)
        if (!category) {
            return { error: "Category not found." };
        }

        category.isActive = !category.isActive
        await category.save()

        return { success: true }
    } catch (error) {
        return { error: "Server error while deleting category." };
    }

})

const addSubCategory = async (data) => {
    try {
        const existing = await SubCategory.findOne({ name: data.name });


        const categoryExists = await Category.findById(data.category);
        if (!categoryExists) {
            return { error: "Referenced category does not exist." };
        }

        if (existing && existing.category.toString() === data.category) {
            return { error: "Subcategory with this name already exists in this category." };
        }

        const slug = slugify(data.name, { lower: true, strict: true });

        const subCategory = new SubCategory({
            name: data.name,
            slug,
            iconUrl: data.iconUrl || "",
            isActive: data.isActive !== undefined ? data.isActive : true,
            priority: data.priority || 0,
            category: data.category,
        });

        await subCategory.save();

        return { success: true, subCategory };
    } catch (error) {
        console.error("Error adding subcategory:", error);
        return { error: "Server error while adding subcategory." };
    }
};

const getAllSubCategories = async () => {
    try {
        const subCategories = await SubCategory.find()
            .populate('category')
            .sort({ isActive: -1, priority: -1, name: 1 });
        return { success: true, subCategories };
    } catch (error) {
        console.error("Error fetching subcategories:", error);
        return { error: "Server error while fetching subcategories." };
    }
};

const getActiveSubCategories = async () => {
    try {
        const subCategories = await SubCategory.find({ isActive: true })
            .populate('category')
            .sort({ priority: -1 });
        return { success: true, subCategories };
    } catch (error) {
        console.error("Error fetching active subcategories:", error);
        return { error: "Server error while fetching subcategories." };
    }
};

const updateSubCategory = async (data) => {
    try {
        const subCategory = await SubCategory.findById(data._id);
        if (!subCategory) {
            return { error: "Subcategory not found." };
        }

        if (data.name && data.name !== subCategory.name) {
            const existing = await SubCategory.findOne({
                name: data.name,
                _id: { $ne: data._id },
            });
            if (existing) {
                return { error: "Another subcategory with this name already exists." };
            }
            subCategory.name = data.name;
            subCategory.slug = slugify(data.name, { lower: true, strict: true });
        }

        if (data.iconUrl !== undefined) subCategory.iconUrl = data.iconUrl;
        if (data.isActive !== undefined) subCategory.isActive = data.isActive;
        if (data.priority !== undefined) subCategory.priority = data.priority;

        if (data.category) {
            const categoryExists = await Category.findById(data.category);
            if (!categoryExists) {
                return { error: "Referenced category does not exist." };
            }
            subCategory.category = data.category;
        }

        await subCategory.save();

        return { success: true, subCategory };
    } catch (error) {
        console.error("Error updating subcategory:", error);
        return { error: "Server error while updating subcategory." };
    }
};

const deleteSubCategory = async (id) => {
    try {
        const subCategory = await SubCategory.findById(id);
        if (!subCategory) {
            return { error: "Subcategory not found." };
        }

        await subCategory.deleteOne();

        return { success: true, message: "Subcategory deleted successfully." };
    } catch (error) {
        console.error("Error deleting subcategory:", error);
        return { error: "Server error while deleting subcategory." };
    }
};

const toggleSubCategoryActive = async (id) => {
    try {
        const subCategory = await SubCategory.findById(id);
        if (!subCategory) {
            return { error: "Subcategory not found." };
        }

        subCategory.isActive = !subCategory.isActive;
        await subCategory.save();

        return { success: true };
    } catch (error) {
        return { error: "Server error while toggling subcategory." };
    }
};

const getByCategory = async (categoryId) => {
    try {
        const subCategories = await SubCategory.find({ category: categoryId, isActive: true })
            .sort({ priority: -1, name: 1 });

        return { success: true, subCategories };
    } catch (error) {
        console.error("Error fetching subcategories:", error);
        return { error: "Server error while fetching subcategories." };
    }
};



module.exports = {
    addCategory,
    getAllCategories,
    getAllActiveCategories,
    updateCategory,
    deleteCategory,
    toggleActive,
    addSubCategory,
    getAllSubCategories,
    getActiveSubCategories,
    updateSubCategory,
    deleteSubCategory,
    toggleSubCategoryActive,
    getByCategory,
};
