var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()

var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');

var app = express();

//mongodb setup
const mongodb = 'mongodb://127.0.0.1:27017/testdb';
mongoose.connect(mongodb);
mongoose.Promise = Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, "Error connecting to MongoDB"))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/user', userRouter);

module.exports = app;
