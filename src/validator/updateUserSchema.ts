import { body } from 'express-validator';

const updateUserSchema = [
  body('firstName')
    .isString()
    .withMessage('The title must be a string.')
    .notEmpty()
    .withMessage('The title cannot be empty.'),

  body('lastName')
    .isString()
    .withMessage('The title must be a string.')
    .notEmpty()
    .withMessage('The title cannot be empty.'),

  body('aboutMe')
    .isString()
    .withMessage('The title must be a string.')
    .notEmpty()
    .withMessage('The title cannot be empty.'),
];

export default updateUserSchema;
