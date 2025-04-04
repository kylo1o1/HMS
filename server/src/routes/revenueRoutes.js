const express = require('express');
const { getRevenueSummary, getTransactionList } = require('../controller/revenueController');
const { authentication, authorization } = require('../middlewares/auths');

const router = express.Router();

router.get('/summary', authentication,authorization("Admin"), getRevenueSummary);
router.get("/transactions",authentication,authorization("Admin"),getTransactionList)

module.exports = router;
