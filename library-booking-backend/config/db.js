const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('❌ Error: MONGODB_URI is not defined in environment variables');
      console.error('   Please create a .env file in the backend directory with MONGODB_URI');
      console.error('   Example: MONGODB_URI=mongodb://localhost:27017/library-booking');
      process.exit(1);
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error('   Make sure MongoDB is running and the URI is correct');
    process.exit(1);
  }
};

module.exports = connectDB;
