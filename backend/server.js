const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/mongodb-config');
const authRoutes = require('./src/routes/auth-routes');

dotenv.config();

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;
connectDB();

app.use('/auth',authRoutes); // Use the auth routes for authentication-related endpoints

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
