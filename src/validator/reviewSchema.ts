import { body } from 'express-validator';

const reviewSchema = [
  body('content')
    .isString()
    .withMessage('Content must be a string.')
    .notEmpty()
    .withMessage('Content cannot be empty.'),
];

export default reviewSchema;
