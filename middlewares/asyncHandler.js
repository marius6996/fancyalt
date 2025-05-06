//middlewares/asyncHandler.js

//wraps async route handlers to catch errors and forward them to Express error middleware
module.exports = function asyncHandler(fn) {
    return function (req, res, next) {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
