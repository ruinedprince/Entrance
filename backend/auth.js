const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const authRoutes = express.Router();
const eventRoutes = require('./events');

// Mock user database
const users = [];

// Middleware
app.use(express.json());

// Register route
authRoutes.post('/register', async (req, res) => {
    const { email, password } = req.body;
    if (users.find(user => user.email === email)) {
        return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ email, password: hashedPassword });
    res.status(201).json({ message: 'User registered successfully' });
});

// Login route
authRoutes.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = users.find(user => user.email === email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ email: user.email }, 'secret', { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token });
});

// Routes
app.use('/auth', authRoutes);
app.use('/events', eventRoutes);

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor iniciado na porta ${PORT}`);
});