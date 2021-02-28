const Middleware = require('./middleware');

class ValidateParamsMiddleware extends Middleware {

    // override
    run = async (req, res, next) => {
        // check params here

        next();
    }
}

module.exports = ValidateParamsMiddleware;