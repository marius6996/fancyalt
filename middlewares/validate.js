//middlewares/validate.js

//middleware to handle validation errors using express-validator and return a structured BadRequestError
const { validationResult } = require('express-validator');
const { BadRequestError } = require('../utils/errors');

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new BadRequestError('Validation failed.', errors.array());
    }
    next();
};

module.exports = validate;
