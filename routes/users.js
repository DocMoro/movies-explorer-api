const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUserProfile,
  updateUser,
} = require('../controllers/users');

router.get('/me', getUserProfile);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUser);

module.exports = router;
