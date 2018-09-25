const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const app = express();
const passport = require('passport');
const indexRouter = require('./routes/index');
const boardRouter = require('./routes/boardpage');
const connect = require('./schemas/index');
const session = require('express-session');
app.use(session({ key:'youngmo', secret:'mo', resave:true, saveUninitialized:true, }));
connect();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/routes'));
app.use(express.static(__dirname + '/images'));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.engine('html', require('ejs').renderFile);
app.use(passport.initialize());
app.use(passport.session());
app.use('/',indexRouter);
app.use('/',boardRouter);

app.listen(5000, () => {
    console.log('nodeboard server is running!');
});

module.exports = app;
