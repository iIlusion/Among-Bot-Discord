const clients = require('./setup');
let current = [];

module.exports = (fn, reqType=0) => {
    if (!current[reqType]) current[reqType] = 0;
    current[reqType]++;
    if (current[reqType] >= clients.length)
        current[reqType] = 0;
    
    fn(clients[current[reqType]]);
}