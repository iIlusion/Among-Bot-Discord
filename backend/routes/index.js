const router = require('express').Router();

module.exports = client => { 
    const api = require('./api')(client);

    router.use('/api', api);

    return router; 
};