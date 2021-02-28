const MatchException = require('../../../classes/MatchException');

class Middleware {

    constructor() {
        this.MatchException = MatchException;
    }

    run = async (req, res, next) => {
        
        next();
    }
}

module.exports = Middleware;