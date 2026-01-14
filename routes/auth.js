const express = require('express');
const router = express.Router();
const { register, login, getWallet } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/wallet', protect, getWallet);

module.exports = router;