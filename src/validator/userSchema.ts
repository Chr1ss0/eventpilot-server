import { body } from 'express-validator';

const registerUserSchema = [
  body('email')
    .notEmpty()
    .withMessage('Email cannot be empty.')
    .isEmail()
    .withMessage('You need to provide a valid email.'),

  body('firstName')
    .notEmpty()
    .withMessage('The firstname cannot be empty.')
    .isString()
    .withMessage('Your firstname has to be a string.'),

  body('lastName')
    .notEmpty()
    .withMessage('The lastname cannot be empty.')
    .isString()
    .withMessage('Your lastname has to be a string.'),
];

export default registerUserSchema;
