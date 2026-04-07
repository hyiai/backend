const express = require('express');
const router = express.Router();
const { careerForm } = require('../controller/careerController');

router.post('/career-form', careerForm);
module.exports = router;
