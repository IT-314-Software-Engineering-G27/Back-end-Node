const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const compression = require("compression");
const mongoose = require('mongoose');
const cors = require('cors');
const { NotFoundError } = require('./errors');

require('dotenv').config();

mongoose.connect(`${process.env.MONGO_URI}`, { dbName: `main` });
const db = mongoose.connection;
db.on("error", () => console.error.bind(console, "MongoDB connection error:"));
db.on("connected", () => console.log("MongoDB connected"));

const app = express();
exports.app = app;

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


const indexRouter = require('./routes/index');
app.use('/', indexRouter);

app.use(function (req, res, next) {
    next(new NotFoundError('Invalid route'));
});

app.use(function (error, req, res, next) {
    console.log(error);
    res.locals.message = error.message;
    res.locals.error = req.app.get('env') === 'development' ? error : {};
    if (error instanceof mongoose.Error.ValidationError) {
        res.status(400).json({
            message: error.message,
            payload: {},
        });
        return;
    }
    res.status(error.status || 500).json({
        message: error.message,
        payload: {},
    });
});

app.listen(process.env.PORT || 5000, () => {
    console.log(`Server is running on port ${process.env.PORT || 5000}`);
});

module.exports = app;
