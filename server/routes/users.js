var express = require('express');
var router = express.Router();
var userHelper = require('../helpers/userHelper')
const Token = require('../models/token')
const TokenQueue=require('../models/tokenQueue')
const eventBus=require('../eventbus')

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.get('/listing/:category', async (req, res) => {
  if(!req.params.category){
    res.status(200).json([])
  }
  const result = await userHelper.getBusinessByCategory(req.params.category)
  if (!result.success) {
    res.status(400).json("internal error")
  }
  res.status(200).json(result)
});

router.get('/businessprofile/:businessId', async (req, res) => {
  try {
    result = await userHelper.getBusiness(req.params.businessId)
    if (!result.success) {
      return res.status(400).json({ message: 'internal error' })
    }
    return res.status(200).json(result)
  } catch (error) {
    return res.status(400).json({ message: error.message })
  }
})

router.post('/booktoken', async (req, res) => {
  try {
    result = await userHelper.bookToken(req.body)
    if (!result.success) {
      return res.status(400).json({ message: "internal error" })
    }
    eventBus.emit('tokenUpdated', req.body.tokenId);
    return res.status(200).json(result)
  } catch (error) {
    return res.status(400).json({ message: error.message })
  }
})

router.get('/token/:tokenId', async (req, res) => {
  try {
    result = await userHelper.getTokenStatus(req.params.tokenId)

    if (!result.status) {
      res.status(400)
    }
    return res.status(200).json(result)
  } catch (error) {
    return res.status(400).json({ message: error.message })
  }
})

router.get('/tokenstream/:tokenId', (req, res) => {
  const tokenId = req.params.tokenId;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const sendData = async () => {
    try {
      const token = await Token.findById(tokenId);
      const queue=await TokenQueue.findOne({tokenId}).sort({ queueNumber: -1 });
      const result={currentToken:token.currentToken,nextToken:queue.queueNumber+1,status:token.status}
      if (!token) {
        res.write(`event: error\ndata: ${JSON.stringify({ message: 'Token not found' })}\n\n`);
        return;
      }
      res.write(`data: ${JSON.stringify(result)}\n\n`);
    } catch (error) {
      res.write(`event: error\ndata: ${JSON.stringify({ message: error.message })}\n\n`);
    }
  };

  const listener = (updatedTokenId) => {
    if (updatedTokenId === tokenId) {
      sendData();
    }
  };

  eventBus.on('tokenUpdated', listener);

  req.on('close', () => {
    eventBus.off('tokenUpdated', listener);
    res.end();
  });
});


module.exports = router;
