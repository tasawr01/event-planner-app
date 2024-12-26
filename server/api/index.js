const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('../config/db');
const authRoutes = require('../routes/authRoutes');
const eventRoutes = require('../routes/eventRoutes');
const checklistRoutes = require('../routes/checklistRoutes');
const notificationRoutes = require('../routes/notificationRoutes');
const userRoutes = require('../routes/userRoutes');


dotenv.config();
connectDB();

const app = express();
const cors = require('cors');
app.use(cors({
  origin: 'https://event-planner-app-frontend-fawn.vercel.app/', // Your Vercel frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
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
