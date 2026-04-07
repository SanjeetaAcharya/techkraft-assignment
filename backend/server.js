const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');        
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const favouriteRoutes = require('./routes/favourites');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(helmet());  

const allowedOrigins = [
  'http://localhost:5173',
  'https://techkraft-assignment.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("Blocked by CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.options('*', cors());

app.use(express.json());

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: 'Too many requests from this IP, please try again in 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false
});

app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/favourites', favouriteRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1); 
  });