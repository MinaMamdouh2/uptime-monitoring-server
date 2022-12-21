// Importing enviroment configurations
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

// Importing app
const app = require('./app');

// Initializing port
const port = process.env.NODE_SERVER_ENV === 'local' ? 3000 : 5000;

// Initializing server
const server = app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
