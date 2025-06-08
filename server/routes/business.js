var express = require('express');
var router = express.Router();
var businessHelper = require('../helpers/businessHelper')
var Service = require('../models/service')
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
var Members = require('../models/members')

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

  if (result.success) {
    res.json(result);
  } else {
    res.status(400).json(result);
  }
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
  }catch(error){
    res.status(400)
  }
 
})




module.exports = router;
