const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const express_handle_bars = require('express-handlebars')

var app = express();

// view engine setup
app.engine('hbs',express_handle_bars.create({
	layoutsDir: path.join(__dirname,'views/layouts'),
	partialsDir: path.join(__dirname,'views/partials'),
	extname: '.hbs',
	defaultLayout: 'layout',
	helpers: {}

	// helpers?
}).engine)
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '/views' ) );

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/public_apis', require('./routes/public_apis'))
app.use('/', require('./routes/index'));

// catch 404 and forward to error handler
app.use((_,_a,next)=>next(createError(404)));

// error handler
app.use((err, req, res, next)=>{
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
