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
  body('startDate').isDate().withMessage('Das Datum muss in einem gültigen Zeitformat angegeben werden'),
  body('endDate').isDate().withMessage('Das Datum muss in einem gültigen Zeitformat angegeben werden'),
  body('location')
    .isString()
    .withMessage('Die Location muss ein String sein.')
    .notEmpty()
    .withMessage('Preis darf nicht leer sein.'),
  body('stock')
    .isNumeric()
    .withMessage('Die Anzahl sollte eine Zahl sein.')
    .notEmpty()
    .withMessage('Anzahl darf nicht leer sein.'),
];

export default eventValidateSchema;
