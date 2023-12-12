// authMiddleware.js
const jwt = require('jsonwebtoken');

const secretKey = process.env.SECRET_KEY || 'your_secret_key';

const authenticate = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, secretKey);
        req.userData = { userId: decodedToken.userId };
        next();
    } catch (error) {
        return res.status(401).send({ message: "Authentication failed" });
    }
};

module.exports = authenticate;
