import { body } from 'express-validator';

const eventValidateSchema = [
  body('title')
    .isString()
    .withMessage('Der Titel muss ein String sein.')
    .notEmpty()
    .withMessage('Der Title darf nicht leer sein.')
    .isLength({ min: 5, max: 50 })
    .withMessage('Der Titel sollte zwischen 5 und 50 Zeichen enthalten'),
  body('category')
    .isString()
    .withMessage('Die Kategorie sollte ein String sein.')
    .isIn(['Sports', 'Music', 'Art', 'Food'])
    .withMessage('Die Kategorie muss Sports, Music, Art, Food enthalten'),
  body('startDate').notEmpty().withMessage('Das Start-Datum darf nicht leer sein'),
  body('endDate').notEmpty().withMessage('Das End-Datum darf nicht leer sein'),
  body('location')
    .isString()
    .withMessage('Die Ort muss ein String sein.')
    .isLength({ min: 5, max: 50 })
    .withMessage('Der Ort sollte zwischen 5 und 50 Zeichen enthalten'),
  body('description')
    .isString()
    .withMessage('Die Beschreibung muss ein String sein.')
    .isLength({ min: 20, max: 150 })
    .withMessage('Die Beschreibung sollte zwischen 20 und 150 Zeichen enthalten'),
];

export default eventValidateSchema;
