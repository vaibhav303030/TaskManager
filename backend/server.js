const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const taskRoutes = require('./routes/taskRoutes');

const app = express();

// ----- Middleware -----
const allowedOrigins = (process.env.CLIENT_ORIGIN || '*')
  .split(',')
  .map((origin) => origin.trim());

app.use(
  cors({
    origin: allowedOrigins.includes('*') ? '*' : allowedOrigins,
  })
);
app.use(express.json());


// ----- Routes -----
app.get('/', (req, res) => {
  res.send('Task Tracker API is running');
});

app.use('/api/tasks', taskRoutes);

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ----- Connect to MongoDB, then start the server -----
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI ||
'mongodb+srv:/vj323586_db_user:Vaibhav335@cluster0.jpbekaw.mongodb.net/taskTracker?appName=Cluster0'

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });
