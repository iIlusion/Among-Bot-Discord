const fs = require('fs');

module.exports = {
    get: async () => {    
        let penalidades = await fs.readFileSync(process.cwd()+'/penalidades.json');
        return JSON.parse(penalidades);
    },

    set: async json => {
        let penalidades = JSON.stringify(json);
        await fs.writeFileSync(process.cwd()+'/penalidades.json', penalidades);
    },
}