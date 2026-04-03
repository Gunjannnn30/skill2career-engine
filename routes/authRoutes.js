const express = require('express');
const router = express.Router();

const { register, login } = require('../controllers/authController');

console.log("AUTH ROUTES FILE EXECUTED");

router.post('/register', register);
router.post('/login', login);
router.get('/test', (req, res) => {
  res.json({ message: "Auth route working" });
});

module.exports = router;
