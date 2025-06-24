var express = require('express');
var router = express.Router();
var businessHelper = require('../helpers/businessHelper')
var Service = require('../models/service')
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
var Members = require('../models/members')
var WorkingHours = require('../models/workingHours')
var Token = require('../models/token')
var TokenQueue = require('../models/tokenQueue')
const eventBus = require('../eventbus')

function convertTo12Hour(time) {
    const [hour, minute] = time.split(':');
    const hr = parseInt(hour);
    const suffix = hr >= 12 ? 'PM' : 'AM';
    const hr12 = hr % 12 === 0 ? 12 : hr % 12;
    return `${hr12}${suffix}`;
}

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
};

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
});

router.post('/register', async (req, res) => {
    try {
        const result = await businessHelper.registerBusiness(req.body.formData, req.body.services, req.body.workingHours)
        if (result.error) {
            res.status(400).json({ message: error.message })
        }
        res.status(201).json({ message: 'success' })
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: error.message })
    }
})

router.post('/login', async (req, res) => {
    const { phoneNumber, password } = req.body;
    const result = await businessHelper.login(phoneNumber, password);
    if (!result.success) {
        res.status(400).json({ message: "login failed" });
    }
    res.status(200).json(result);

});

router.get('/services', authMiddleware, async (req, res) => {
    const businessId = req.user.id;
    const result = await businessHelper.getServices(businessId);
    res.status(result.success ? 200 : 404).json(result);
});

router.post('/addService', authMiddleware, async (req, res) => {
    const b_Id = req.user.id
    console.log(req.body)
    const result = await businessHelper.addService(b_Id, req.body.service)

    res.status(result.success ? 200 : 404).json(result);
})

router.post('/removeService', authMiddleware, async (req, res) => {
    const businessId = req.user.id;
    const { index } = req.body;

    try {
        const doc = await Service.findOne({ businessId });
        if (!doc) return res.status(400).json({ message: 'Service document not found' });

        if (index < 0 || index >= doc.services.length) {
            return res.status(400).json({ message: 'Invalid service index' });
        }

        doc.services.splice(index, 1);
        await doc.save();

        res.json({ success: true, services: doc.services });
    } catch (error) {
        console.error("Error removing service:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/addmember', authMiddleware, async (req, res) => {
    try {
        const result = await businessHelper.addMember(req.user.id, req.body)
        res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
})

router.get('/members', authMiddleware, async (req, res) => {
    try {
        const businessId = req.user.id
        const members = await Members.findOne({ businessId })
        res.status(200).json(members)
    } catch (error) {
        res.status(400)
    }

})

router.get('/workingHours', authMiddleware, async (req, res) => {
    try {
        const doc = await WorkingHours.findOne({ businessId: req.user.id });
        if (!doc) {
            return res.status(404).json({ message: 'Working hours not found' });
        }

        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const result = {};

        days.forEach(day => {
            if (doc[day] && doc[day].enabled) {
                const intervals = doc[day].intervals.map(interval => {
                    const start = convertTo12Hour(interval.start);
                    const end = convertTo12Hour(interval.end);
                    return `${start}-${end}`;
                });
                result[day] = intervals;
            } else {
                result[day] = [];
            }
        });

        res.json(result);
    } catch (error) {
        console.error("Error fetching working hours:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/addtoken', authMiddleware, async (req, res) => {
    try {
        const newToken = new Token({
            ...req.body,
            businessId: req.user.id
        });
        await newToken.save();

        res.status(201).json({ message: 'success' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


router.get('/tokens', authMiddleware, async (req, res) => {
    try {
        const tokens = await Token.find({ businessId: req.user.id });
        res.status(200).json(tokens);
    } catch (error) {
        console.error('Error fetching tokens:', error);
        res.status(400).json({ message: error.message });
    }
});

router.put('/tokens/:id', authMiddleware, async (req, res) => {
    try {
        const doc = await Token.findById(req.params.id);

        if (!doc) {
            return res.status(404).json({ message: 'Token not found' });
        }

        if (doc.status == "active") {
            doc.status = "inactive"
        } else {
            doc.status = "active"
        }
        await doc.save();

        res.status(200).json({ message: 'Token status updated', status: doc.status });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/member/login', async (req, res) => {
    try {
        let result = await businessHelper.memberLogin(req.body);

        if (!result.success) {
            return res.status(400).json({ message: result.message });
        }

        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/fetchtokendata/:tokenId', authMiddleware, async (req, res) => {
    try {
        result = await TokenQueue.find({ tokenId: req.params.tokenId })
        res.status(200).json(result)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

router.put('/nexttoken/:tokenId', authMiddleware, async (req, res) => {
    try {
        await Token.updateOne(
            { _id: req.params.tokenId },
            { $inc: { currentToken: 1 } }
        );
        eventBus.emit('tokenUpdated', req.params.tokenId);
        res.status(200).json({ message: "Current token incremented" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});




module.exports = router;
