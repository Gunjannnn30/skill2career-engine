const express = require('express');
const router = express.Router();
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ 
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed!'), false);
        }
    }
});

const { analyze, uploadResumeController, careerDetailsController, goalAnalysisController } = require('../controllers/aiController');

router.post('/analyze', analyze);
router.post('/upload-resume', upload.single('file'), uploadResumeController);
router.post('/career-details', careerDetailsController);
router.post('/goal-analysis', goalAnalysisController);

module.exports = router;
