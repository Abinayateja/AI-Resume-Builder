import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import {
  errorHandler,
  notFoundHandler
} from './middleware/error.middleware.js';

const app = express();

// --- CORS Configuration ---
const allowedOrigins = [
  'https://abi-resume-builder.netlify.app',
  'http://localhost:5173'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests without an Origin header, such as server-to-server requests
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked origin: ${origin}`));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// --- Body Parsing ---
app.use(express.json({ limit: '10mb' }));

/* Health check endpoint for uptime monitoring */
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Resume Builder API is running',
    timestamp: new Date().toISOString()
  });
});

// --- Routes ---
app.use('/api', routes);

// --- Error Handling ---
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
