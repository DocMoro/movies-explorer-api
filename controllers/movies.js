const Movie = require('../models/movie');

const Error404 = require('../errors/error-404');
const Error400 = require('../errors/error-400');
const Error403 = require('../errors/error-403');

const { ERR_404, ERR_400, ERR_403 } = require('../utils/constants');

module.exports.getMovies = (req, res, next) => {
  Movie.find({}).select(['-createdAt'])
    .then((card) => res.send(card))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const { trailer } = req.body;
  const { _id } = req.user;

  Movie.create({
    ...req.body,
    trailerLink: trailer,
    owner: _id,
  }).then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new Error400(ERR_400));
      }

      return next(err);
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((card) => {
      if (!card) {
        throw new Error404(ERR_404);
      }

      if (card.owner.toString() !== req.user._id) {
        throw new Error403(ERR_403);
      }

      return Movie.findByIdAndRemove(req.params.movieId).select(['-createdAt']);
    })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new Error400(ERR_400));
      }

      return next(err);
    });
};
