const express = require('express');
const router = express.Router();
const { contactForm } = require('../controller/contactFormController');

router.post('/contact-form', contactForm);
module.exports = router;
