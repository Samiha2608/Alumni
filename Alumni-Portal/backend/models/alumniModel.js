const db = require('../config/db');

const Alumni = {
    create: (name, graduationYear, degree, email, jobStatus, company, jobLevel, phoneNo, callback) => {
        const query = `
            INSERT INTO alumni (name, graduationYear, degree, email, jobStatus, company, jobLevel, phoneNo) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        db.query(query, [name, graduationYear, degree, email, jobStatus, company, jobLevel, phoneNo], callback);
    },

    getAll: (callback) => {
        const query = "SELECT id, name, graduationYear, degree, email, jobStatus, company, jobLevel, phoneNo FROM alumni";
        db.query(query, callback);
    },

    getById: (id, callback) => {
        const query = "SELECT id, name, graduationYear, degree, email, jobStatus, company, jobLevel, phoneNo FROM alumni WHERE id = ?";
        db.query(query, [id], callback);
    },

    update: (id, name, graduationYear, degree, email, jobStatus, company, jobLevel, phoneNo, callback) => {
        const query = `
            UPDATE alumni 
            SET name = ?, graduationYear = ?, degree = ?, email = ?, jobStatus = ?, company = ?, jobLevel = ?, phoneNo = ? 
            WHERE id = ?
        `;
        db.query(query, [name, graduationYear, degree, email, jobStatus, company, jobLevel, phoneNo, id], callback);
    },

    delete: (id, callback) => {
        const query = "DELETE FROM alumni WHERE id = ?";
        db.query(query, [id], callback);
    }
};

module.exports = Alumni;
