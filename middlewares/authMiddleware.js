const jwt = require('jsonwebtoken');
const JWT_KEY = "hsdfkj";

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ message: 'Token is required' });

    jwt.verify(token, JWT_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = user;
        next();
    });
};

module.exports = authenticateToken;
