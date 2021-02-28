require("dotenv").config();

const jwt = require('jsonwebtoken');

class MatchUtils {

    static generateMatchHash() {
        const payload = Math.random().toString(36).substr(2);

        const hash = jwt.sign({ hash: payload }, process.env.TOKEN, {
            expiresIn: 3600 * 5 // 5 hours
        });

        return hash;
    }
}

module.exports = MatchUtils;