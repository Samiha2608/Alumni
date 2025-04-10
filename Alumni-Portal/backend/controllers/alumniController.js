const Alumni = require('../models/alumniModel');
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

// Define valid job statuses and job levels (lowercase for comparison)
const VALID_JOB_STATUSES = ['employed', 'unemployed', 'freelancing', 'studying', 'retired'];
const VALID_JOB_LEVELS = ['entry', 'junior', 'mid-level', 'senior', 'executive', 'n/a'];

// Helper function to normalize and validate category values
function normalizeValue(value, validOptions) {
    if (value === undefined || value === null) return null;
    
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

// Helper function to validate graduation year
function validateGraduationYear(year) {
    if (!year) return null;
    
    // Convert to number if it's a string
    const numYear = typeof year === 'string' ? parseInt(year, 10) : year;
    
    // Check if it's a valid year (between 1900 and current year + 5)
    const currentYear = new Date().getFullYear();
    if (isNaN(numYear) || numYear < 1900 || numYear > currentYear + 5) {
        return null;
    }
    
    return numYear;
}

// Helper function to validate email
function validateEmail(email) {
    if (!email) return null;
    
    // Simple email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(String(email).toLowerCase()) ? String(email).toLowerCase() : null;
}

// Helper function to validate phone number
function validatePhone(phone) {
    if (!phone) return null;
    
    // Convert to string if it's a number
    const phoneStr = typeof phone === 'number' ? phone.toString() : phone;
    
    // Remove non-digit characters for comparison
    const digitsOnly = phoneStr.replace(/\D/g, '');
    
    // Check if it has a reasonable number of digits (7-15)
    if (digitsOnly.length < 7 || digitsOnly.length > 15) {
        return null;
    }
    
    // Return the original format to preserve formatting
    return phoneStr;
}

exports.uploadAlumniFromExcel = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
        // Read the uploaded file
        const workbook = xlsx.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Convert worksheet to JSON with raw values
        const alumniList = xlsx.utils.sheet_to_json(worksheet, { raw: true });

        // Validate alumni data
        const validationErrors = [];
        const validAlumni = alumniList.filter(alumni => {
            const requiredFields = ['name', 'graduationYear', 'degree', 'email', 'jobStatus', 'phoneNo'];
            const hasRequiredFields = requiredFields.every(field => alumni[field] !== undefined);
            
            if (!hasRequiredFields) {
                validationErrors.push(`Missing required fields in alumni entry: ${JSON.stringify(alumni)}`);
                return false;
            }
            
            // Validate graduation year
            const validYear = validateGraduationYear(alumni.graduationYear);
            if (validYear === null) {
                validationErrors.push(`Invalid graduation year "${alumni.graduationYear}" for alumni: ${alumni.name}`);
                return false;
            }
            alumni.graduationYear = validYear;
            
            // Validate email
            const validEmail = validateEmail(alumni.email);
            if (validEmail === null) {
                validationErrors.push(`Invalid email "${alumni.email}" for alumni: ${alumni.name}`);
                return false;
            }
            alumni.email = validEmail;
            
            // Validate phone number
            const validPhone = validatePhone(alumni.phoneNo);
            if (validPhone === null) {
                validationErrors.push(`Invalid phone number "${alumni.phoneNo}" for alumni: ${alumni.name}`);
                return false;
            }
            alumni.phoneNo = validPhone;
            
            // Normalize and validate job status
            const normalizedJobStatus = normalizeValue(alumni.jobStatus, VALID_JOB_STATUSES);
            if (!normalizedJobStatus) {
                validationErrors.push(`Invalid job status "${alumni.jobStatus}" for alumni: ${alumni.name}`);
                return false;
            }
            alumni.jobStatus = normalizedJobStatus;
            
            // Normalize and validate job level (only if company is provided)
            if (alumni.company) {
                const normalizedJobLevel = normalizeValue(alumni.jobLevel, VALID_JOB_LEVELS);
                if (alumni.jobLevel && !normalizedJobLevel) {
                    validationErrors.push(`Invalid job level "${alumni.jobLevel}" for alumni: ${alumni.name}`);
                    return false;
                }
                alumni.jobLevel = normalizedJobLevel || 'n/a';
            } else {
                // If no company, set job level to N/A
                alumni.company = '';
                alumni.jobLevel = 'n/a';
            }
            
            return true;
        });

        if (validationErrors.length > 0) {
            return res.status(400).json({ 
                message: 'Some alumni entries are invalid', 
                errors: validationErrors 
            });
        }

        // Bulk insert valid alumni
        const insertPromises = validAlumni.map(alumni => {
            return new Promise((resolve, reject) => {
                Alumni.create(
                    alumni.name,
                    alumni.graduationYear,
                    alumni.degree,
                    alumni.email,
                    alumni.jobStatus,
                    alumni.company || '',
                    alumni.jobLevel || 'n/a',
                    alumni.phoneNo,
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
                    message: `Successfully uploaded ${results.length} alumni records`, 
                    uploadedCount: results.length 
                });
            })
            .catch(error => {
                res.status(500).json({ message: 'Error inserting alumni records', error: error.toString() });
            });

    } catch (error) {
        res.status(500).json({ message: 'Error processing Excel file', error: error.toString() });
    }
};

exports.createAlumni = (req, res) => {
    const { name, graduationYear, degree, email, jobStatus, company, jobLevel, phoneNo } = req.body;
    
    if (!name || !graduationYear || !degree || !email || jobStatus === undefined || !phoneNo) {
        return res.status(400).json({ message: 'Required fields are missing' });
    }
    
    // Validate graduation year
    const validYear = validateGraduationYear(graduationYear);
    if (validYear === null) {
        return res.status(400).json({ message: `Invalid graduation year: ${graduationYear}` });
    }
    
    // Validate email
    const validEmail = validateEmail(email);
    if (validEmail === null) {
        return res.status(400).json({ message: `Invalid email: ${email}` });
    }
    
    // Validate phone number
    const validPhone = validatePhone(phoneNo);
    if (validPhone === null) {
        return res.status(400).json({ message: `Invalid phone number: ${phoneNo}` });
    }
    
    // Normalize and validate job status
    const normalizedJobStatus = normalizeValue(jobStatus, VALID_JOB_STATUSES);
    if (!normalizedJobStatus) {
        return res.status(400).json({ message: `Invalid job status: ${jobStatus}` });
    }
    
    // Normalize and validate job level (if company is provided)
    let normalizedJobLevel = 'n/a';
    if (company) {
        if (jobLevel) {
            normalizedJobLevel = normalizeValue(jobLevel, VALID_JOB_LEVELS);
            if (!normalizedJobLevel) {
                return res.status(400).json({ message: `Invalid job level: ${jobLevel}` });
            }
        }
    }

    Alumni.create(
        name, 
        validYear, 
        degree, 
        validEmail, 
        normalizedJobStatus, 
        company || '', 
        normalizedJobLevel, 
        validPhone, 
        (err, result) => {
            if (err) return res.status(500).json({ message: 'Database error', error: err.toString() });
            res.status(201).json({ message: 'Alumni added successfully', alumniId: result.insertId });
        }
    );
};

exports.getAllAlumni = (req, res) => {
    Alumni.getAll((err, results) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err.toString() });
        res.status(200).json(results);
    });
};

exports.getAlumniById = (req, res) => {
    const { id } = req.params;

    Alumni.getById(id, (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err.toString() });
        if (results.length === 0) return res.status(404).json({ message: 'Alumni not found' });
        res.status(200).json(results[0]);
    });
};

exports.updateAlumni = (req, res) => {
    const { id } = req.params;
    const { name, graduationYear, degree, email, jobStatus, company, jobLevel, phoneNo } = req.body;

    if (!name || !graduationYear || !degree || !email || jobStatus === undefined || !phoneNo) {
        return res.status(400).json({ message: 'Required fields are missing' });
    }
    
    // Validate graduation year
    const validYear = validateGraduationYear(graduationYear);
    if (validYear === null) {
        return res.status(400).json({ message: `Invalid graduation year: ${graduationYear}` });
    }
    
    // Validate email
    const validEmail = validateEmail(email);
    if (validEmail === null) {
        return res.status(400).json({ message: `Invalid email: ${email}` });
    }
    
    // Validate phone number
    const validPhone = validatePhone(phoneNo);
    if (validPhone === null) {
        return res.status(400).json({ message: `Invalid phone number: ${phoneNo}` });
    }
    
    // Normalize and validate job status
    const normalizedJobStatus = normalizeValue(jobStatus, VALID_JOB_STATUSES);
    if (!normalizedJobStatus) {
        return res.status(400).json({ message: `Invalid job status: ${jobStatus}` });
    }
    
    // Normalize and validate job level (if company is provided)
    let normalizedJobLevel = 'n/a';
    if (company) {
        if (jobLevel) {
            normalizedJobLevel = normalizeValue(jobLevel, VALID_JOB_LEVELS);
            if (!normalizedJobLevel) {
                return res.status(400).json({ message: `Invalid job level: ${jobLevel}` });
            }
        }
    }

    Alumni.update(
        id, 
        name, 
        validYear, 
        degree, 
        validEmail, 
        normalizedJobStatus, 
        company || '', 
        normalizedJobLevel, 
        validPhone, 
        (err) => {
            if (err) return res.status(500).json({ message: 'Database error', error: err.toString() });
            res.status(200).json({ message: 'Alumni updated successfully' });
        }
    );
};

exports.deleteAlumni = (req, res) => {
    const { id } = req.params;

    Alumni.delete(id, (err) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err.toString() });
        res.status(200).json({ message: 'Alumni deleted successfully' });
    });
};