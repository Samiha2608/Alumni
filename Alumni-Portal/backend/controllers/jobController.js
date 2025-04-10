const Job = require('../models/jobModel');
const multer = require('multer');
const xlsx = require('xlsx');
const path = require('path');
const upload = multer({ 
    dest: 'uploads/',
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        if (ext !== '.xlsx' && ext !== '.xls') {
            return cb(new Error('Only Excel files are allowed'));
        }
        cb(null, true);
    }
});

// Define valid employment types and experience levels (lowercase for comparison)
const VALID_EMPLOYMENT_TYPES = ['full-time', 'part-time', 'contract', 'freelance', 'internship'];
const VALID_EXPERIENCE_LEVELS = ['entry', 'junior', 'mid-level', 'senior', 'executive'];

// Helper function to normalize and validate category values
function normalizeValue(value, validOptions) {
    if (!value) return null;
    
    const normalizedValue = value.toString().toLowerCase().trim();
    
    // Find matching option regardless of capitalization/spacing
    const matchedOption = validOptions.find(option => 
        normalizedValue === option || 
        normalizedValue.replace(/[-_\s]/g, '') === option.replace(/[-_\s]/g, '')
    );
    
    return matchedOption ? 
        // Return the properly formatted version from our valid options
        validOptions[validOptions.indexOf(matchedOption)] : 
        null;
}

// Helper function to parse and format dates from Excel
function parseExcelDate(excelDate) {
    if (!excelDate) return null;
    
    let parsedDate;
    
    // Check if it's a serial number date from Excel
    if (typeof excelDate === 'number') {
        // Excel dates are number of days since 1900-01-01
        // (with leap year bug adjustment)
        parsedDate = new Date(Math.round((excelDate - 25569) * 86400 * 1000));
    } else {
        // Try to parse string date in various formats
        parsedDate = new Date(excelDate);
    }
    
    // Validate the parsed date is valid
    if (isNaN(parsedDate.getTime())) {
        return null;
    }
    
    // Format as YYYY-MM-DD for MySQL
    return parsedDate.toISOString().split('T')[0];
}

exports.uploadJobsFromExcel = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
        // Read the uploaded file
        const workbook = xlsx.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Convert worksheet to JSON with raw values to properly handle dates
        const jobs = xlsx.utils.sheet_to_json(worksheet, { raw: true });

        // Validate job data
        const validationErrors = [];
        const validJobs = jobs.filter(job => {
            const requiredFields = ['title', 'company', 'location', 'employment_type', 'experience_level'];
            const hasRequiredFields = requiredFields.every(field => job[field]);
            
            if (!hasRequiredFields) {
                validationErrors.push(`Missing required fields in job entry: ${JSON.stringify(job)}`);
                return false;
            }
            
            // Normalize and validate employment type
            const normalizedEmploymentType = normalizeValue(job.employment_type, VALID_EMPLOYMENT_TYPES);
            if (!normalizedEmploymentType) {
                validationErrors.push(`Invalid employment type "${job.employment_type}" in job: ${job.title}`);
                return false;
            }
            job.employment_type = normalizedEmploymentType;
            
            // Normalize and validate experience level
            const normalizedExperienceLevel = normalizeValue(job.experience_level, VALID_EXPERIENCE_LEVELS);
            if (!normalizedExperienceLevel) {
                validationErrors.push(`Invalid experience level "${job.experience_level}" in job: ${job.title}`);
                return false;
            }
            job.experience_level = normalizedExperienceLevel;
            
            // Parse and format application deadline date
            if (job.application_deadline) {
                const parsedDate = parseExcelDate(job.application_deadline);
                if (!parsedDate) {
                    validationErrors.push(`Invalid date format for application_deadline in job: ${job.title}`);
                    return false;
                }
                job.application_deadline = parsedDate;
            }
            
            return true;
        });

        if (validationErrors.length > 0) {
            return res.status(400).json({ 
                message: 'Some job entries are invalid', 
                errors: validationErrors 
            });
        }

        // Bulk insert valid jobs
        const insertPromises = validJobs.map(job => {
            return new Promise((resolve, reject) => {
                Job.create(
                    job.title, 
                    job.company, 
                    job.location, 
                    job.description || '', 
                    job.salary || null, 
                    job.employment_type, 
                    job.experience_level, 
                    job.application_deadline || null, 
                    job.status || 'Active',
                    (err, result) => {
                        if (err) reject(err);
                        else resolve(result);
                    }
                );
            });
        });

        Promise.all(insertPromises)
            .then(results => {
                res.status(201).json({ 
                    message: `Successfully uploaded ${results.length} jobs`, 
                    uploadedCount: results.length 
                });
            })
            .catch(error => {
                res.status(500).json({ message: 'Error inserting jobs', error: error.toString() });
            });

    } catch (error) {
        res.status(500).json({ message: 'Error processing Excel file', error: error.toString() });
    }
};

exports.createJob = (req, res) => {
    const { title, company, location, description, salary, employment_type, experience_level, application_deadline, status } = req.body;
    
    if (!title || !company || !location || !employment_type || !experience_level) {
        return res.status(400).json({ message: 'Required fields are missing' });
    }
    
    // Normalize and validate employment type
    const normalizedEmploymentType = normalizeValue(employment_type, VALID_EMPLOYMENT_TYPES);
    if (!normalizedEmploymentType) {
        return res.status(400).json({ message: `Invalid employment type: ${employment_type}` });
    }
    
    // Normalize and validate experience level
    const normalizedExperienceLevel = normalizeValue(experience_level, VALID_EXPERIENCE_LEVELS);
    if (!normalizedExperienceLevel) {
        return res.status(400).json({ message: `Invalid experience level: ${experience_level}` });
    }
    
    // Parse and validate date if provided
    let parsedDeadline = null;
    if (application_deadline) {
        parsedDeadline = new Date(application_deadline);
        if (isNaN(parsedDeadline.getTime())) {
            return res.status(400).json({ message: 'Invalid date format for application deadline' });
        }
        parsedDeadline = parsedDeadline.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    }

    Job.create(
        title, 
        company, 
        location, 
        description || '', 
        salary || null, 
        normalizedEmploymentType, 
        normalizedExperienceLevel, 
        parsedDeadline, 
        status || 'Active', 
        (err, result) => {
            if (err) return res.status(500).json({ message: 'Database error', error: err.toString() });
            res.status(201).json({ message: 'Job created successfully', jobId: result.insertId });
        }
    );
};

exports.getAllJobs = (req, res) => {
    Job.getAll((err, results) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err.toString() });
        res.status(200).json(results);
    });
};

exports.getJobById = (req, res) => {
    const { id } = req.params;

    Job.getById(id, (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err.toString() });
        if (results.length === 0) return res.status(404).json({ message: 'Job not found' });
        res.status(200).json(results[0]);
    });
};

exports.updateJob = (req, res) => {
    const { id } = req.params;
    const { title, company, location, description, salary, employment_type, experience_level, application_deadline, status } = req.body;

    if (!title || !company || !location || !employment_type || !experience_level) {
        return res.status(400).json({ message: 'Required fields are missing' });
    }
    
    // Normalize and validate employment type
    const normalizedEmploymentType = normalizeValue(employment_type, VALID_EMPLOYMENT_TYPES);
    if (!normalizedEmploymentType) {
        return res.status(400).json({ message: `Invalid employment type: ${employment_type}` });
    }
    
    // Normalize and validate experience level
    const normalizedExperienceLevel = normalizeValue(experience_level, VALID_EXPERIENCE_LEVELS);
    if (!normalizedExperienceLevel) {
        return res.status(400).json({ message: `Invalid experience level: ${experience_level}` });
    }
    
    // Parse and validate date if provided
    let parsedDeadline = null;
    if (application_deadline) {
        parsedDeadline = new Date(application_deadline);
        if (isNaN(parsedDeadline.getTime())) {
            return res.status(400).json({ message: 'Invalid date format for application deadline' });
        }
        parsedDeadline = parsedDeadline.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    }

    Job.update(
        id, 
        title, 
        company, 
        location, 
        description || '', 
        salary || null, 
        normalizedEmploymentType, 
        normalizedExperienceLevel, 
        parsedDeadline, 
        status || 'Active', 
        (err) => {
            if (err) return res.status(500).json({ message: 'Database error', error: err.toString() });
            res.status(200).json({ message: 'Job updated successfully' });
        }
    );
};

exports.deleteJob = (req, res) => {
    const { id } = req.params;

    Job.delete(id, (err) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err.toString() });
        res.status(200).json({ message: 'Job deleted successfully' });
    });
};