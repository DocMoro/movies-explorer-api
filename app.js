require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');

const { PORT = 3000, MONGO_PORT = 27017, MONGO_IP = 'localhost' } = process.env;

const cors = require('./middlewares/cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const limiter = require('./middlewares/limiter');

const Error404 = require('./errors/error-404');

const { ERR_500, ERR_404 } = require('./utils/constants');

const app = express();
app.use(express.json());

mongoose.connect(`mongodb://${MONGO_IP}:${MONGO_PORT}/bitfilmsdb`, {
  useNewUrlParser: true,
});

app.use(cors);
app.use(requestLogger);
app.use(limiter);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use('/', require('./routes/index'));

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
