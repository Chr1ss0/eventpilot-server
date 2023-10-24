import { body } from 'express-validator';

// const eventValidateSchema = [
//   body('title')
//     .isString()
//     .withMessage('Der Titel muss ein String sein.')
//     .notEmpty()
//     .withMessage('Der Title darf nicht leer sein.')
//     .isLength({ min: 5, max: 50 })
//     .withMessage('Der Titel sollte zwischen 5 und 50 Zeichen enthalten'),
//   body('category')
//     .isString()
//     .withMessage('Die Kategorie sollte ein String sein.')
//     .isIn(['Sports', 'Music', 'Art', 'Food'])
//     .withMessage('Die Kategorie muss Sports, Music, Art, Food enthalten'),
//   body('startDate').notEmpty().withMessage('Das Start-Datum darf nicht leer sein'),
//   body('endDate').notEmpty().withMessage('Das End-Datum darf nicht leer sein'),
//   body('location')
//     .isString()
//     .withMessage('Die Ort muss ein String sein.')
//     .isLength({ min: 5, max: 50 })
//     .withMessage('Der Ort sollte zwischen 5 und 50 Zeichen enthalten'),
//   body('description')
//     .isString()
//     .withMessage('Die Beschreibung muss ein String sein.')
//     .isLength({ min: 20, max: 150 })
//     .withMessage('Die Beschreibung sollte zwischen 20 und 150 Zeichen enthalten'),
// ];

const eventValidateSchema = [
  body('title')
    .isString()
    .withMessage('The title must be a string.')
    .notEmpty()
    .withMessage('The title cannot be empty.')
    .isLength({ min: 5, max: 50 })
    .withMessage('The title should contain between 5 and 50 characters.'),

  body('category')
    .isString()
    .withMessage('The category should be a string.')
    .isIn(['Sport', 'Music', 'Art', 'Food'])
    .withMessage('The category must be one of Sport, Music, Art, Food.'),

  body('startDate').notEmpty().withMessage('The start date cannot be empty.'),

  body('endDate').notEmpty().withMessage('The end date cannot be empty.'),

  body('address').notEmpty().withMessage('You need to provide an address.'),

  body('placeName').notEmpty().withMessage('You need to provide a place.'),

  body('description')
    .isString()
    .withMessage('The description must be a string.')
    .isLength({ min: 10, max: 150 })
    .withMessage('The description should contain between 10 and 150 characters.'),
];

export default eventValidateSchema;
