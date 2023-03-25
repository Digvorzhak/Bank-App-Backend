const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config();
const connectDb = require('./config/dbConnection');
const errorHandler = require('./middleware/errorHandler');
connectDb();
const app = express();
app.use(cors());

app.use(express.json());

app.use('/api/v1/users', require('./routes/userRoutes'));
app.use('/api/v1/accounts', require('./routes/accountRoutes'));

app.use(errorHandler);

module.exports = app;
