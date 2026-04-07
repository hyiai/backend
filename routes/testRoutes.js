const express = require('express');
const router = express.Router();
const { startTest, submitTest } = require('../controller/mock_testController');

router.post('/start-test', startTest);
router.post('/submit-test', submitTest);

module.exports = router;
