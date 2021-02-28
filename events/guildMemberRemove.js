const Discord = require('discord.js')
const ids = require('../ids.json')
const ProfileController = require('../controllers/profile-controller.js');
const JSONController = require('../JSON/controller');
/**
 * O evento guildMemberRemove é emitido após um membro Sair.
 */

module.exports = async (client, member) => {
    const UserLog = require('../classes/UserLog');
    const ulog = {};
    ulog[member.id] = {"l": [member.joinedTimestamp, member.roles.cache.map(r => `${r.name}`).join(', ')]};
    new UserLog(client, client.guilds.cache.get(ids.servidor), false, ulog, member).cast();
    
    const ps = ProfileController.getProfiles();
    const p = ProfileController.getProfileOfId(member.id);
    const guild = client.guilds.cache.get(ids.servidor);
    if (p.cargoB) {
        let shouldDelete = true;
        for (let p2idx in ps) {
            let p2 = ps[p2idx];
            if (p2.cargoB===p.cargoB)
                shouldDelete = false;
            break;
        }
        if (shouldDelete)
            guild.roles.cache.get(p.cargoB).delete();
    } if (p.canalB) {
        let shouldDelete = true;
        for (let p2idx in ps) {
            let p2 = ps[p2idx];
            if (p2.canalB===p.canalB)
                shouldDelete = false;
            break;
        }
        if (shouldDelete) {
            guild.channels.cache.get(p.canalB).delete();
            const canaisvip = JSONController.get('canaisvip');
            delete canaisvip[p.canalB];
            JSONController.set('canaisvip', canaisvip);
        }
    }
    
    ProfileController.deleteProfile(member.id);
}