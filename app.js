require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bobeParser = require('body-parser');
const { celebrate, Joi, errors } = require('celebrate');

const { PORT = 3000 } = process.env;

const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const cors = require('./middlewares/cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const Error404 = require('./errors/error-404');

const { ERR_500, ERR_404, URL } = require('./utils/constants');

const app = express();
app.use(bobeParser.json());

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(cors);
app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().required().min(2).max(30),
  }),
}), createUser);

app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/movies', require('./routes/movies'));

app.use('/', (req, res, next) => {
  next(new Error404(ERR_404));
});

app.use(errorLogger);

app.use(errors());

/* eslint no-unused-vars: ["error", { "args": "none" }] */

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? ERR_500
        : message,
    });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
