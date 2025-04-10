const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

exports.authMiddleware = (req, res, next) => {
    const token = req.header('Authorization');
    
    if (!token) {
        return res.status(403).json({ message: 'Access denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};
