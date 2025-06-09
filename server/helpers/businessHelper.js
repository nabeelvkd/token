const Business = require('../models/business');
const Service = require('../models/service');
const WorkingHours = require('../models/workingHours');
const Category = require('../models/category');       // Add these
const SubCategory = require('../models/subCategory'); // Add these
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const Members = require('../models/members')

const JWT_SECRET = process.env.JWT_SECRET;

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

const login = async (phone, password) => {
    try {
        // 1. Find business by phone
        const business = await Business.findOne({ phone });

        if (!business) {
            return { success: false, message: "Business not found" };
        }

        // 2. Compare password
        const isMatch = await bcrypt.compare(password, business.password);

        if (!isMatch) {
            return { success: false, message: "Invalid credentials" };
        }

        // 3. Create JWT payload
        const payload = {
            id: business._id,
            phone: business.phone,
            name: business.name,
        };

        // 4. Sign JWT
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

        return {
            success: true,
            message: "Login successful",
            token,
            business: {
                id: business._id,
                name: business.name,
                phone: business.phone
            }
        };

    } catch (error) {
        console.error("Login error:", error);
        return { success: false, message: "Server error" };
    }
};

const getServices = async (businessId) => {
    try {
        const servicesDoc = await Service.findOne({ businessId });

        if (!servicesDoc) {
            return { success: false, message: "No services found for this business." };
        }

        return {
            success: true,
            services: servicesDoc.services
        };
    } catch (error) {
        console.error("Error fetching services:", error);
        return { success: false, message: "Server error." };
    }
};

const addService = async (businessId, data) => {
    try {
        const serviceDoc = await Service.findOne({ businessId });

        if (!serviceDoc) {
            return { success: false, message: "No services found for this business." };
        }

        // Ensure proper types
        const formattedService = {
            name: data.name,
            estimatedTime: Number(data.estimatedTime),
            fee: Number(data.fee)
        };

        serviceDoc.services.push(formattedService);
        await serviceDoc.save();

        return {
            success: true,
            message: "Service added successfully",
            services: serviceDoc.services
        };

    } catch (error) {
        console.error("Error adding service:", error);
        return { success: false, message: "Server error" };
    }
};

const addMember = async (businessId, data) => {
    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const memberData = {
            memberId: data.memberId,
            name: data.name,
            phone: data.phone,
            designation: data.designation,
            status: data.status ?? true,
            password: hashedPassword
        };

        let membersDoc = await Members.findOne({ businessId });

        if (!membersDoc) {
            membersDoc = new Members({
                businessId,
                members: [memberData]
            });
        } else {
            // Optional: Prevent duplicate memberId
            const exists = membersDoc.members.find(
                m => m.memberId === memberData.memberId || m.phone === memberData.phone
            );

            if (exists) return { success: false, message: "Member ID or phone number already exists" };

            membersDoc.members.push(memberData);
        }

        await membersDoc.save();

        return { success: true, members: membersDoc.members };
    } catch (error) {
        console.error("Error adding member:", error);
        return { success: false, message: "Failed to add member", error };
    }
};




module.exports = { registerBusiness, login, getServices, addService, addMember };
