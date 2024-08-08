const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const quizRoutes = require('./routes/quizRoutes');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./utils/errorHandler');
const rateLimiter = require('./middleware/rateLimiter');

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(rateLimiter);

// Welcome route
app.get('/', (req, res) => {
    res.send('Welcome to Quizmer');
  });

// Routes
app.use('/api', quizRoutes);
app.use('/api/auth', authRoutes);

// Error handling
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 3800;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});