// load .env data into process.env
require('dotenv').config();

// Web server config
const PORT = process.env.PORT || 3000;
const sassMiddleware = require('./lib/sass-middleware');
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const app = express();

// Load the logger first so all (static) HTTP requests are logged to STDOUT
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/styles', sassMiddleware({
  source: __dirname + '/styles',
  destination: __dirname + '/public/styles',
  isSass: false, // false => scss, true => sass
})
);
app.use(express.static('public'));

// Separated Routes for each Resource
const usersRoutes = require('./routes/users');
const todosRoutes = require('./routes/todos');
app.use('/users', usersRoutes);
app.use('/todos', todosRoutes);

app.get('*', (req, res) => {
  res.redirect(404, '/');
});

app.listen(PORT, () => {
  console.log(`Smart TODO listening on port ${PORT} 🐢`);
});