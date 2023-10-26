const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const compression = require("compression");
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config();

// mongodb connection
mongoose.connect(`${process.env.MONGO_URI}`, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", () => console.error.bind(console, "MongoDB connection error:"));
db.on("connected", () => console.log("MongoDB connected"));

const app = express();

// set up middlewares
app.use(cors());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(compression());

// set up routes

const indexRouter = require('./routes/index');
const userRouter = require('./routes/user.route');
const authRouter = require('./routes/auth.route');

// routes
app.use('/', indexRouter);
app.use('/users', userRouter);
app.use('/auth', authRouter);

app.use(function (req, res, next) {
    next(createError(404));
});

app.use(function (error, req, res, next) {
    res.locals.message = error.message;
    res.locals.error = req.app.get('env') === 'development' ? error : {};
    res.status(error.status || 500).json({
        message: error.message,
        payload: {},
    });
});

module.exports = app;
