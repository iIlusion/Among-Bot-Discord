const ProfileController = require('../../controllers/profile-controller.js');

module.exports.run = async function (client, message, args, config, discord) {
    if (message.member.hasPermission("ADMINISTRATOR")) {
        let offset = parseInt(args[0]);
        let type = parseInt(args[1]);
        let jsonres = '';
        message.guild.emojis.cache.forEach(e=>{
            jsonres += `[${offset++}, "${e.id}", 150, ${type}, "${e.name.toUpperCase()}"],\n`;
        })
        for(let i = 0; i < jsonres.length; i += 1994) {
            const toSend = jsonres.substring(i, Math.min(jsonres.length, i + 1994));
            message.channel.send('```'+toSend+'```');
        }
    }
}

module.exports.config = {
    name: 'copylist',
	aliases: [],
    staff: true,
    changelog: '!'
}