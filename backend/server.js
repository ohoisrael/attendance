const app = require('./app');
const db = require('./config/db');
const PORT = process.env.PORT || 5000;

// Test database connection
db.query('SELECT 1')
  .then(() => {
    console.log('Database connected');
    
    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Database connection failed:', err);
    process.exit(1);
  });