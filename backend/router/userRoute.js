const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/userSchema');

const router = express.Router();
const SECRET_KEY = 'Letsmakenewfriends';


router.post('/signup', async (req, res) => {
  try {
    const { username, password, interests } = req.body;

    if (!Array.isArray(interests)) {
      return res.status(400).send({ error: 'Interests must be an array' });
    }

    const user = new User({
      username,
      password,
      interests, 
    });

    await user.save();

    res.status(201).send({ message: 'User created successfully', user });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(400).send({ error: 'Error creating user' });
  }
});



router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).send({ error: 'Invalid username or password' });
    }
    const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: '1h' });
    res.send({ token });
  } catch (error) {
    res.status(500).send({ error: 'Error logging in' });
  }
});

module.exports = router;