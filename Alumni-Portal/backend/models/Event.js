const db = require('../config/db');

const Event = {
    create: (title, date, location, type, status, callback) => {
        const query = "INSERT INTO events (title, date, location, type, status) VALUES (?, ?, ?, ?, ?)";
        db.query(query, [title, date, location, type, status], callback);
    },

    getAll: (callback) => {
        const query = "SELECT * FROM events";
        db.query(query, callback);
    },

    getById: (id, callback) => {
        const query = "SELECT * FROM events WHERE id = ?";
        db.query(query, [id], callback);
    },

    update: (id, title, date, location, type, status, callback) => {
        const query = "UPDATE events SET title = ?, date = ?, location = ?, type = ?, status = ? WHERE id = ?";
        db.query(query, [title, date, location, type, status, id], callback);
    },

    delete: (id, callback) => {
        const query = "DELETE FROM events WHERE id = ?";
        db.query(query, [id], callback);
    }
};

module.exports = Event;
