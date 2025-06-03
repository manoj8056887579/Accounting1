const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const pool = require('./utils/config/connectDB');
const routes = require('./routes/index');
const initializeDatabase = require('./utils/config/initDB');
const path = require('path');
const OrganizationDashboardRoutes = require('./routes/dashboard/index');

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000; 

const app = express();

// Request logging middleware 
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl;
  const status = res.statusCode;
  
  console.log(`[${timestamp}] ${method} ${url} ${status}`);
  
  if (['POST', 'PUT', 'GET', 'DELETE'].includes(method)) {
    console.log('Request Body:', JSON.stringify(req.body, null, 2));
  }
  
  next();
});

// Middleware 
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory using absolute path
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/api", routes);
app.use('/api/dashboard', OrganizationDashboardRoutes);

// Test database connection
app.get("/", async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({
      message: "API is running...",
      timestamp: result.rows[0].now
    });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ 
      message: "API is running but database connection failed",
      error: error.message
    });
  }
});

// Initialize database and start server 
const startServer = async () => {
  try {
    // Initialize database tables
    await initializeDatabase();
    console.log('✅ Database connection successful');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log('📝 Request logging enabled');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  } 
};

startServer();

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something broke!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});
 