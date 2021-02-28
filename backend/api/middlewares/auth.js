const Middleware = require('./middleware');

require("dotenv").config();
const jwt = require('jsonwebtoken');

class AuthMiddleware extends Middleware {

    // override
    run = async (req, res, next) => {
        let hash;

        switch (req.method) {
            case 'GET':
                hash = req.query.hash;
                break;
            case 'POST':
                hash = req.body.hash;
                break;
            case 'PUT':
                hash = req.body.hash;
                break;
        }

        if (!hash) return new this.MatchException(400, 'No hash provided', res);

        jwt.verify(hash, process.env.TOKEN, err => {
            if (err) return new this.MatchException(500, 'Failed to authenticate', res);

            next();
        });
    }
}

module.exports = AuthMiddleware;