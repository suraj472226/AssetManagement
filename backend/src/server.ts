// backend/src/server.ts
import 'dotenv/config'; // Loads .env file contents into process.env
import express, { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { connectDB } from './config/db';
import { notFound, errorHandler } from './middleware/errorHandler';
import auditRoutes from './routes/auditRoutes';

// Import Routes
import userRoutes from './routes/userRoutes';
import assetRoutes from './routes/assetRoutes'; 
import requestRoutes from './routes/requestRoutes'; // placeholder
import reportRoutes from './routes/reportRoutes'; // placeholder
import maintenanceRoutes from './routes/maintenanceRoutes';

// --- Initialization ---
connectDB(); // Connect to MongoDB Atlas
const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
// CORS Configuration to allow connections from your frontend
const allowedOrigins = [process.env.CLIENT_URL, 'http://localhost:8080', 'http://127.0.0.1:5173']
  .filter((o): o is string => typeof o === 'string'); // remove undefined values and narrow type to string[]

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

app.use(express.json()); // Body parser for JSON
app.use(express.urlencoded({ extended: false })); // Body parser for form data
app.use(morgan('dev')); // HTTP request logging

// --- Routes ---
app.get('/', (req: Request, res: Response) => {
  res.send('Fluid Asset Flow API is running...');
});

app.use('/api/users', userRoutes);
app.use('/api/assets', assetRoutes); // <-- Asset routes are now active at /api/assets
app.use('/api/requests', requestRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/audit', auditRoutes);

// --- Custom Error Handling Middleware (MUST be last) ---
app.use(notFound);
app.use(errorHandler);

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`⚡️ Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});