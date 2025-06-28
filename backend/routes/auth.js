const express = require('express');
const router = express.Router();
const authController = require('./authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authMiddleware.authenticate, authController.logout);
router.get('/me', authMiddleware.authenticate, authController.getMe);

module.exports = router;