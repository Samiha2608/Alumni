const Event = require('../models/Event.js');
const db = require('../config/db');
const multer = require('multer');
const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');

// Function to parse different date formats with enhanced logging
function parseExcelDate(input) {
  console.log('Input date:', input, 'Type:', typeof input);

  // If input is already a valid date string, return it
  if (typeof input === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(input)) {
    return input;
  }
  
  // Handle Excel serial date
  if (typeof input === 'number') {
    const excelEpoch = new Date(Date.UTC(1900, 0, 0));
    const date = new Date(excelEpoch.getTime() + (input - 1) * 24 * 60 * 60 * 1000);
    const formattedDate = date.toISOString().split('T')[0];
    console.log('Parsed serial date:', formattedDate);
    return formattedDate;
  }
  
  // Handle MM/DD/YYYY format
  if (typeof input === 'string') {
    // Remove any extra whitespace
    input = input.trim();
    
    // Split by / 
    const parts = input.split('/');
    if (parts.length === 3) {
      const month = parts[0].padStart(2, '0');
      const day = parts[1].padStart(2, '0');
      const year = parts[2];
      const formattedDate = `${year}-${month}-${day}`;
      console.log('Parsed string date:', formattedDate);
      return formattedDate;
    }
    
    console.warn(`Unable to parse date: ${input}`);
  }
  
  // If no parsing works, return current date as fallback
  const fallbackDate = new Date().toISOString().split('T')[0];
  console.warn(`Fallback date used: ${fallbackDate}`);
  return fallbackDate;
}

// Multer configuration for file upload
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = 'uploads/';
      // Create uploads directory if it doesn't exist
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      cb(null, `events-${Date.now()}${path.extname(file.originalname)}`);
    }
  }),
  fileFilter: (req, file, cb) => {
    const allowedFileTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 
      'application/vnd.ms-excel'
    ];
    if (allowedFileTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only Excel files are allowed'), false);
    }
  }
});

// Get all events
exports.getAllEvents = (req, res) => {
  Event.getAll((err, events) => {
    if (err) {
      console.error("Error fetching events:", err);
      return res.status(500).json({ error: "Error fetching events" });
    }

    if (!events || events.length === 0) {
      return res.json({ message: "No records available", events: [] });
    }

    res.json(events);
  });
};

// Create a single event
exports.createEvent = (req, res) => {
  console.log("Received data:", req.body);

  const { title, date, location, type, status } = req.body;

  if (!title || !date || !location || !type || !status) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const query = "INSERT INTO events (title, date, location, type, status) VALUES (?, ?, ?, ?, ?)";
  db.query(query, [title, date, location, type, status], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }

    console.log("Event created successfully:", result);
    res.status(201).json({ message: "Event created successfully", eventId: result.insertId });
  });
};

// Update an event
exports.updateEvent = (req, res) => {
  const { id } = req.params;
  const { title, date, location, type, status } = req.body;

  if (!title || !date || !location || !type || !status) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const query = "UPDATE events SET title = ?, date = ?, location = ?, type = ?, status = ? WHERE id = ?";
  db.query(query, [title, date, location, type, status, id], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }

    res.json({ message: "Event updated successfully" });
  });
};

// Delete an event
exports.deleteEvent = (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM events WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }

    res.json({ message: "Event deleted successfully" });
  });
};

// Upload events from Excel
exports.uploadEventsFromExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Read the uploaded Excel file
    const workbook = xlsx.readFile(req.file.path);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(worksheet);

    // Log raw data for debugging
    console.log("Raw Excel Data:", JSON.stringify(data, null, 2));

    // Validate Excel file structure
    const requiredColumns = ['title', 'date', 'location', 'type', 'status'];
    const missingColumns = requiredColumns.filter(col => !data[0] || !data[0].hasOwnProperty(col));

    if (missingColumns.length > 0) {
      // Remove uploaded file
      fs.unlinkSync(req.file.path);
      
      return res.status(400).json({ 
        message: "Invalid Excel file format", 
        missingColumns: missingColumns 
      });
    }

    // Validate and prepare events for bulk insertion with detailed logging
    const validEvents = data.map((event, index) => {
      console.log(`Processing Event ${index + 1}:`, JSON.stringify(event, null, 2));

      const processedEvent = {
        ...event,
        // Parse and standardize date
        date: parseExcelDate(event.date)
      };

      // Log event validation details
      const eventValidation = {
        title: !!processedEvent.title,
        date: !!processedEvent.date,
        location: !!processedEvent.location,
        type: !!processedEvent.type,
        status: !!processedEvent.status
      };

      console.log(`Event ${index + 1} Validation:`, eventValidation);

      return processedEvent;
    }).filter(event => 
      event.title && 
      event.date && 
      event.location && 
      event.type && 
      event.status
    );

    // Log valid events
    console.log("Valid Events:", JSON.stringify(validEvents, null, 2));

    if (validEvents.length === 0) {
      // Remove uploaded file
      fs.unlinkSync(req.file.path);
      
      return res.status(400).json({ message: "No valid events found in the file" });
    }

    // Bulk insert events
    const query = "INSERT INTO events (title, date, location, type, status) VALUES ?";
    const values = validEvents.map(event => [
      event.title, 
      event.date, 
      event.location, 
      event.type, 
      event.status
    ]);

    db.query(query, [values], (err, result) => {
      // Remove uploaded file
      fs.unlinkSync(req.file.path);

      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Database error", error: err });
      }

      res.status(201).json({ 
        message: "Events uploaded successfully", 
        totalEvents: validEvents.length,
        insertedEvents: result.affectedRows 
      });
    });

  } catch (error) {
    // Remove uploaded file in case of error
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    
    console.error("Excel upload error:", error);
    res.status(500).json({ message: "Error processing Excel file", error: error.message });
  }
};

// Middleware for file upload
exports.uploadMiddleware = upload.single('file');