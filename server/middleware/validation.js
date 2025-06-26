// Input validation middleware
const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: 'Validation failed',
            errors: errors.array()
        });
    }
    next();
};

const businessRegistrationValidation = [
    body('formData.name')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Business name must be between 2 and 100 characters'),
    body('formData.phone')
        .isMobilePhone()
        .withMessage('Please provide a valid phone number'),
    body('formData.password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    body('formData.category')
        .notEmpty()
        .withMessage('Category is required'),
    body('formData.subCategory')
        .notEmpty()
        .withMessage('Sub-category is required'),
    body('formData.address')
        .trim()
        .isLength({ min: 10 })
        .withMessage('Address must be at least 10 characters long'),
    handleValidationErrors
];

const loginValidation = [
    body('phoneNumber')
        .isMobilePhone()
        .withMessage('Please provide a valid phone number'),
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
    handleValidationErrors
];

const serviceValidation = [
    body('service.name')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Service name must be between 2 and 100 characters'),
    body('service.estimatedTime')
        .isInt({ min: 1, max: 480 })
        .withMessage('Estimated time must be between 1 and 480 minutes'),
    body('service.fee')
        .isFloat({ min: 0 })
        .withMessage('Fee must be a positive number'),
    handleValidationErrors
];

module.exports = {
    businessRegistrationValidation,
    loginValidation,
    serviceValidation,
    handleValidationErrors
};