const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const apiRoutes = require('./routes/apiRoutes');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', apiRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('ProcureFlow S/4 Enterprise API Service is Active.');
});

// Port configuration
const PORT = process.env.PORT || 5000;

// Connect to Database & Start Server
const startServer = async () => {
  // Try to connect to MongoDB, if fails it logs and runs anyway
  await connectDB();
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode.`);
  });
};

startServer();
