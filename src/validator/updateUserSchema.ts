import { body } from 'express-validator';

const updateUserSchema = [
  body('firstName')
    .isString()
    .withMessage('Your first name must be a string.')
    .notEmpty()
    .withMessage('Your first name  cannot be empty.'),

  body('lastName')
    .isString()
    .withMessage('Your last name  must be a string.')
    .notEmpty()
    .withMessage('Your last name  cannot be empty.'),
];

export default updateUserSchema;
