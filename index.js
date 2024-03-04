require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xssClean = require('xss-clean');
const app = express();
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const { ErrorHandler } = require('./middlewares/errorHandler');
const { logger } = require('./utils/index');
const { httpLogger } = require('./utils/logger');
const userRoutes = require('./routes/user.auth');
const Database = require('./config/database');
const passport = require('passport');
const fileRoutes = require('./routes/file.route');

// security based middleware
app.use(helmet());
app.use(mongoSanitize());
app.use(xssClean());
app.use(hpp());

// rate limit request
app.use(
  rateLimit({
    windowMs: 60 * 1000, //15 minutes
    max: 25, //limit each ip to 100 requests per windowMs
    message: 'You have exceeded you requests per minute limit',
    headers: true,
  })
);

// cors middleware
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
); //prevent the unnecessary access

// instance of database
const database = new Database(process.env.MONGODB_URI);
// connection error for the database connection
database.connect().catch((err) => {
  console.log('Error connecting to the database', err);
});

// parser middleware
app.use(express.json()); //parses the data to the json format
app.use(express.urlencoded({ extended: true })); //parse the x-www-form-urlencoded

// jwt auth strategy
require('./config/passport');

// initializing passport.js
app.use(passport.initialize());

// http logger
app.use(httpLogger(logger));

app.get('/', (req, res) => {
  res.json({ msg: 'Hello', success: true });
});

app.use('/auth', userRoutes);
app.use('/upload', fileRoutes);

// global error handler middleware
app.use(ErrorHandler);

// running the server with the specified port number.
app.listen(process.env.PORT, () => {
  console.log(`Server running at http://localhost:${process.env.PORT}`);
});
