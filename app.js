const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');


const app = express();


// MIDDLEWARES
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(cors({
    origin: ["http://localhost:5173", ],
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
}));
app.use((req, res, next) => {
    console.log('Fetching...');
    next();
});


// MOUNTING ROUTES (middlewares also)


module.exports = app;