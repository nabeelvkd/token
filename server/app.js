var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
require('dotenv').config();

// Import utilities and middleware
const { connectDB } = require('./utils/database');
const { generalLimiter } = require('./middleware/rateLimiter');
const customLogger = require('./utils/logger');

// Import routes
var indexRouter = require('./routes/business');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');

var app = express();

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https:"],
            scriptSrc: ["'self'"],
        },
    },
}));

// Compression middleware
app.use(compression());

// CORS configuration
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    optionsSuccessStatus: 200
}));

// Rate limiting
app.use(generalLimiter);

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database connection
connectDB();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Middleware
app.use(logger('combined', {
    stream: {
        write: (message) => customLogger.info(message.trim())
    }
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Routes
app.use('/business', indexRouter);
app.use('/', usersRouter);
app.use('/admin', adminRouter);

// 404 handler
app.use(function(req, res, next) {
    next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
    // Log error
    customLogger.error(err.message, { 
        stack: err.stack,
        url: req.url,
        method: req.method 
    });

    // Set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // Send JSON error response for API routes
    if (req.path.startsWith('/api') || req.path.startsWith('/business') || req.path.startsWith('/admin')) {
        return res.status(err.status || 500).json({
            message: err.message,
            ...(req.app.get('env') === 'development' && { stack: err.stack })
        });
    }

    // Render error page for other routes
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;