const Business = require('../models/business')
const Categories = require('../models/category')
const Service = require('../models/service')
const Token = require('../models/token')
const moment = require('moment')
const SubCategory = require('../models/subCategory')
const TokenQueue = require('../models/tokenQueue');

const getBusinessByCategory = async (category) => {
    try {
        const categoryDoc = await Categories.findOne({ slug: category })
        categoryId = categoryDoc._id
        const businesses = await Business.find({ category: categoryId })
        return { success: true, businesses }
    } catch (error) {
        return { success: false }
    }
}

const getBusiness = async (id) => {
    try {
        const business = await Business.findById(id);
        if (!business) {
            return { success: false };
        }

        const tokenDocs = await Token.find({ businessId: id });

        const subCatDoc = await SubCategory.findById(business.subCategory);
        const subCategory = subCatDoc ? subCatDoc.name : "Unknown";

        const tokens = tokenDocs.map(token => ({
            id: token._id,
            services: token.services,
            status: token.status,
            members:token.assignedMembers
        }));

        business.subCategory = subCategory;

        return {
            success: true,
            business,
            tokens,
        };

    } catch (error) {
        console.error('Error in getBusiness:', error);
        return { success: false };
    }
};


const bookToken = async (data) => {
    try {
        const lastEntry = await TokenQueue.findOne({ tokenId: data.tokenId })
            .sort({ queueNumber: -1 });

        const tokenDoc = await Token.findById(data.tokenId)
        if (!tokenDoc.status) {
            return { success: false, message: "Token Booking is Closed" }
        }

        const queueNumber = lastEntry ? lastEntry.queueNumber + 1 : 1;

        const newToken = new TokenQueue({
            businessId: data.businessId,
            tokenId: data.tokenId,
            queueNumber,
            customerName: data.name,
            customerPhone: data.mobile,
            status: 'waiting'
        });

        await newToken.save();

        return { success: true, token: queueNumber };

    } catch (error) {
        console.error("Error booking token:", error);
        return { success: false, message: error.message };
    }
};

const getTokenStatus = async (tokenId) => {
    try {
        const lastEntry = await TokenQueue.findOne({ tokenId }).sort({ queueNumber: -1 });

        const nextToken = lastEntry ? lastEntry.queueNumber + 1 : 1;

        const currentEntry = await Token.findById(tokenId);
        if (!currentEntry) {
            return { success: false, message: 'Token not found' };
        }

        const currentToken = currentEntry.currentToken || 0;
        const waitTime = (nextToken - currentToken) * (currentEntry.waitTime || 0);

        return {
            success: true,
            current: currentToken,
            next: nextToken,
            waitTime,
            status: currentEntry.status
        };
    } catch (error) {
        return {
            success: false,
            message: error.message,
        };
    }
};




module.exports = { getBusinessByCategory, getBusiness, bookToken, getTokenStatus }