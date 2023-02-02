const router = require('express').Router();

const { validatorCreateMovie, validatorDeleteMovie } = require('../utils/validator');
const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

router.get('/', getMovies);

router.post('/', validatorCreateMovie, createMovie);

router.delete('/:movieId', validatorDeleteMovie, deleteMovie);

module.exports = router;
