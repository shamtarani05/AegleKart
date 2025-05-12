const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/mongodb-config');
const authRoutes = require('./src/routes/auth-routes');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const stripeRouter = require('./src/routes/stripeRoutes');
const orderRouter = require('./src/routes/ordersRoutes');
const customerRouter = require('./src/routes/customerRoutes');
const analyticsRouter = require('./src/routes/analyticsRoutes');
const productRouter = require('./src/routes/productRoutes');


dotenv.config();

app.use(helmet());

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true ,
}));
app.use('/stripe/webhook', express.raw({ type: 'application/json' }));
app.use('/stripe', require('./src/routes/stripeWebhookRoutes'));
app.use(express.json({ limit: '10mb' })); // Increase limit for larger requests
app.use(cookieParser());

const port = process.env.PORT || 3000;
connectDB();

app.use('/auth',authRoutes); // Use the auth routes for authentication-related 
app.use('/stripe', stripeRouter);
app.use('/orders', orderRouter);
app.use('/customers', customerRouter);
app.use('/dashboard', analyticsRouter);
app.use('/products', productRouter);


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
