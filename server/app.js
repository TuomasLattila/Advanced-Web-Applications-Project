var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors')
dotenv.config()

//Routers:
var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');
var imagesRouter = require('./routes/images');
var swipeRouter = require('./routes/swipe');

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

//cors setup:
if (process.env.NODE_ENV === "development") {
  var corsOptions = {
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200
  }
  app.use(cors(corsOptions))
}


app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/images', imagesRouter);
app.use('/swipe', swipeRouter);

module.exports = app;
