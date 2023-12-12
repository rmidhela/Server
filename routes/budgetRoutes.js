const express = require('express');
const router = express.Router();
const Budget = require('../models/Budget');
const jwt = require('jsonwebtoken');

const secretKey = process.env.SECRET_KEY || 'your_secret_key'; // Should be in an environment variable

// Middleware to authenticate and attach user to request
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

// Add a Budget entry for a specific user
router.post('/', authenticate, async (req, res) => {
    const newBudget = new Budget({
        ...req.body,
        user: req.userData.userId
    });

    try {
        await newBudget.save();
        res.status(201).send({ message: 'Budget added successfully', budget: newBudget });
    } catch (error) {
        res.status(500).send({ message: 'Error adding budget', error: error.message });
    }
});

// GET route to fetch budgets for a specific user
router.get('/', authenticate, async (req, res) => {
    try {
        const userBudgets = await Budget.find({ user: req.userData.userId });
        res.status(200).json(userBudgets);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching budgets', error: error.message });
    }
});

module.exports = router;
