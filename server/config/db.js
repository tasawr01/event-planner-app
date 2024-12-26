const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = 'mongodb+srv://mixavob561:uv68NRZwTptjDJXU@event.gc2i9.mongodb.net/?retryWrites=true&w=majority&appName=Event';
    
    // Removed deprecated options
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
