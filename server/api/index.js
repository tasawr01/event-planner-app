const express = require('express');
const dotenv = require('dotenv');
const corsLib = require('cors');  // Renamed import to `corsLib`
const connectDB = require('../config/db');
const authRoutes = require('../routes/authRoutes');
const eventRoutes = require('../routes/eventRoutes');
const checklistRoutes = require('../routes/checklistRoutes');
const notificationRoutes = require('../routes/notificationRoutes');
const userRoutes = require('../routes/userRoutes');

dotenv.config();
connectDB();

const app = express();

// List of allowed origins
const allowedOrigins = [
  'http://localhost:3000', // Localhost for development
  'https://event-planner-app-frontend-fawn.vercel.app' // Vercel frontend URL
];

app.use(corsLib({
  origin: (origin, callback) => {
    // If the origin is in the allowedOrigins list or the origin is not provided (e.g. in case of direct server-side requests), allow the request
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token'],
  credentials: true
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/checklists', checklistRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
