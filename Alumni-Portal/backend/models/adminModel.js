const db = require('../config/db');

const Admin = {
    create: (email, password, callback) => {
        const query = "INSERT INTO admin (email, password) VALUES (?, ?)";
        db.query(query, [email, password], callback);
    },

    findByEmail: (email, callback) => {
        const query = "SELECT * FROM admin WHERE email = ?";
        db.query(query, [email], callback);
    }
};

module.exports = Admin;
