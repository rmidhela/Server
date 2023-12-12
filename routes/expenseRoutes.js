const express = require('express');
const router = express.Router();
const Expense = require('../models/expense');
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

// Add an Expense for a specific user
router.post('/', authenticate, async (req, res) => {
    const newExpense = new Expense({
        ...req.body,
        user: req.userData.userId
    });

    try {
        await newExpense.save();
        res.status(201).send({ message: 'Expense added successfully', expense: newExpense });
    } catch (error) {
        res.status(500).send({ message: 'Error adding expense', error: error.message });
    }
});

// Get all Expenses for a specific user
router.get('/', authenticate, async (req, res) => {
    try {
        const expenses = await Expense.find({ user: req.userData.userId });
        res.status(200).send(expenses);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching expenses', error: error.message });
    }
});

// Delete an Expense for a specific user
router.delete('/:id', authenticate, async (req, res) => {
    try {
        const result = await Expense.findOneAndDelete({ _id: req.params.id, user: req.userData.userId });
        if (result) {
            res.status(200).send({ message: 'Expense deleted successfully' });
        } else {
            res.status(404).send({ message: 'Expense not found or not authorized to delete' });
        }
    } catch (error) {
        res.status(500).send({ message: 'Error deleting expense', error: error.message });
    }
});

module.exports = router;
