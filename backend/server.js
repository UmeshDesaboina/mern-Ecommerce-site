// Load environment variables
require('dotenv').config();

// Import the Express app
const app = require('./app');

// Define routes
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
