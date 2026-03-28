const express = require('express');
const router = express.Router();
const { saveAnalysis, getHistory, getCareerProfile, saveCareerProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.post('/save-analysis', protect, saveAnalysis);
router.get('/history', protect, getHistory);
router.get('/career-profile', protect, getCareerProfile);
router.post('/career-profile', protect, saveCareerProfile);

module.exports = router;
