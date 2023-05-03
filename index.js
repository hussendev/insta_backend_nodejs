const express = require('express');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const coonectDB = require('./config/dbConnection');
const errorHandler = require('./middleware/errorHandler');
const app = express();
const port = process.env.PORT || 3001;

coonectDB();

app.use(express.json());
app.use(express.urlencoded())
app.use(cookieParser());

app.use('/api/content/', require('./routes/postRoutes'));
app.use('/api/auth/', require('./routes/authRoutes'));
app.use(errorHandler);

app.listen(port, () => {
  console.log(`server is running on port ${port}`)
});
