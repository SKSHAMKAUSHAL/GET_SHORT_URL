const { body } = require('express-validator');

exports.validateRegister = [
  body('email').isEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 6 }).withMessage('Password too short'),
];

exports.validateLogin = [
  body('email').isEmail().withMessage('Invalid email'),
  body('password').exists().withMessage('Password required'),
];

exports.validateUrl = [
  body('originalUrl').exists().withMessage('URL required'),
];

exports.validateUpdateUrl = [
  body('originalUrl').exists().withMessage('URL required'),
];