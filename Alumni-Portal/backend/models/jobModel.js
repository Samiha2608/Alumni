const db = require('../config/db');

const Job = {
    create: (title, company, location, description, salary, employment_type, experience_level, application_deadline, status, callback) => {
        const query = "INSERT INTO job (title, company, location, description, salary, employment_type, experience_level, application_deadline, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        db.query(query, [title, company, location, description, salary, employment_type, experience_level, application_deadline, status], callback);
    },

    getAll: (callback) => {
        const query = "SELECT * FROM job";
        db.query(query, callback);
    },

    getById: (id, callback) => {
        const query = "SELECT * FROM job WHERE id = ?";
        db.query(query, [id], callback);
    },

    update: (id, title, company, location, description, salary, employment_type, experience_level, application_deadline, status, callback) => {
        const query = "UPDATE job SET title = ?, company = ?, location = ?, description = ?, salary = ?, employment_type = ?, experience_level = ?, application_deadline = ?, status = ? WHERE id = ?";
        db.query(query, [title, company, location, description, salary, employment_type, experience_level, application_deadline, status, id], callback);
    },

    delete: (id, callback) => {
        const query = "DELETE FROM job WHERE id = ?";
        db.query(query, [id], callback);
    }
};

module.exports = Job;