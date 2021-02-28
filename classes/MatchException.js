class MatchException {

    constructor(statusCode, message, res) {
        this.statusCode = statusCode;
        this.message = { message };

        res.status(this.statusCode).json(this.message);
    }
}

module.exports = MatchException;