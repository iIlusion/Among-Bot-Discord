const express = require('express');
const app = express();

module.exports = client => {
    const routes = require('./routes')(client);

    app.use(express.urlencoded());

    app.use('/', routes);

    app.listen(process.env.PORT || 25932);
}