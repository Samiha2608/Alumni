const express = require('express');
const multer = require('multer');
const { createJob, getAllJobs, getJobById, updateJob, deleteJob,  uploadJobsFromExcel  } = require('../controllers/jobController');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });
router.post('/jobs/upload', upload.single('file'), uploadJobsFromExcel);

router.post('/jobs', createJob);
router.get('/jobs', getAllJobs);
router.get('/jobs/:id', getJobById);
router.put('/jobs/:id', updateJob);
router.delete('/jobs/:id', deleteJob);

module.exports = router;
