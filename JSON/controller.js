const fs = require('fs');

class JSONController {
    
    static get(jsonName) {
        const data = fs.readFileSync(process.cwd() + '/JSON/'+jsonName+'.json', 'utf8');
        return JSON.parse(data);
    }

    static set(jsonName, json) {
        if (!json) json = [];
        fs.writeFileSync(process.cwd() + '/JSON/'+jsonName+'.json', JSON.stringify(json), 'utf8');
    }
}

module.exports = JSONController;