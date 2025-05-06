//middlewares/sanitizeKeys.js

//removes dangerous keys like $ and __proto__ from request objects
function sanitizeKeys(obj) {
    for (const key in obj) {
        if (
            key.startsWith('$') ||
            key === '__proto__' ||
            typeof obj[key] === 'object' && obj[key] !== null
        ) {
            delete obj[key];
        }
    }
}

function sanitizeInput(req, res, next) {
    ['body', 'query', 'params'].forEach((location) => {
        if (req[location]) {
            sanitizeKeys(req[location]);
        }
    });
    next();
}

module.exports = sanitizeInput;
