const router = require('express').Router();

const { validatorUpdateUser } = require('../utils/validator');
const {
  getUserProfile,
  updateUser,
} = require('../controllers/users');

router.get('/me', getUserProfile);

router.patch('/me', validatorUpdateUser, updateUser);

module.exports = router;
