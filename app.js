require('dotenv').config();
require('express-async-errors');

const express = require('express');
const app = express();

const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');


const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const connectDB = require('./db/connect');
const authRoute = require('./routes/authRoute');
const userRoute = require('./routes/userRoute');
const productRoute = require('./routes/productRoute');
const reviewRoute = require('./routes/reviewRoute');
const orderRoute = require('./routes/orderRoute');

app.set('trust proxy', 1);
app.use(rateLimit({
    windowMs: 15 * 6 * 1000,
    max: 60
}));
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(mongoSanitize());

app.use(morgan('tiny'));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.static('./public'));
app.use(fileUpload());

app.get('/', (req, res) => {
    res.send('e-commerce-api');
});

app.get('/api/v1', (req, res) => {
    // console.log(req.cookies);
    console.log(req.signedCookies);
    res.send('e-commerce-api');
});

app.use('/api/v1/auth', authRoute);
app.use('/api/v1/user', userRoute);
app.use('/api/v1/products', productRoute);
app.use('/api/v1/reviews', reviewRoute);
app.use('/api/v1/orders', orderRoute);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
    try {
        await connectDB(process.env.MONGODB_URL);
        app.listen(port, () => {
            console.log('Server listening on port ' + port);
        })
    } catch (error) {
        console.log(error);
    }
};

start();

