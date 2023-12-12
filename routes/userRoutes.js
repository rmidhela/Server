const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Secret key should ideally be stored in an environment variable
const secretKey = process.env.SECRET_KEY || 'your_secret_key';

/// Register User
router.post('/register', async (req, res) => {
    // Add input validation here
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        });
        await newUser.save();
        // Send limited user data
        res.status(201).send({ message: 'User registered successfully', username: newUser.username, email: newUser.email });
    } catch (error) {
        res.status(500).send({ message: 'Error registering user', error: error.message });
    }
});

// Login User
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) {
            return res.status(400).send({ message: "User not found" });
        }
        if (await bcrypt.compare(req.body.password, user.password)) {
            // Create token
            const token = jwt.sign(
                { userId: user._id, username: user.username },
                secretKey,
                { expiresIn: '1h' }
            );
            res.status(200).send({ message: "Login successful", token });
        } else {
            res.status(400).send({ message: "Incorrect password" });
        }
    } catch (error) {
        console.error('Error logging in', error);
        res.status(500).send({ message: 'Error logging in', error: error.message });
    }
});

// Fetch User Data
router.get('/userdata', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.userData.userId).select('-password');
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        res.status(200).send(user);
    } catch (error) {
        console.error('Error fetching user data', error);
        res.status(500).send({ message: 'Error fetching user data', error: error.message });
    }
});


module.exports = router;
