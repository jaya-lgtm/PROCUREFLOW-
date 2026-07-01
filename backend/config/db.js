const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connStr = process.env.MONGO_URI || 'mongodb://localhost:27017/procureflow_s4';
    console.log(`Connecting to database: ${connStr}...`);
    const conn = await mongoose.connect(connStr);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    console.log('ProcureFlow S/4 Backend will run in Mock-Data Storage mode due to database absence.');
    return false;
  }
};

module.exports = connectDB;
