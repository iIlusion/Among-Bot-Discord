const ProfileController = require('../../controllers/profile-controller');

module.exports.run = async function (client, message, args, config, Discord, ids) {
    if (!(ids.devs.includes(message.author.id) || message.member.roles.cache.has(ids.moderadorp))) return message.reply("Você não tem permissão!");
    if (args.length < 2)
        return message.reply('Uso: m!setnick <@user/id> <nick>')
    let id;
    if (mentioned = message.mentions.members.first())
        id = mentioned.id;
    else
        id = args[0];
    
    const profile = ProfileController.getProfileOfId(id);
    profile.nick = args.splice(1).join(' ');
    ProfileController.saveProfile(id, profile);
    
    message.react('✅');
}   

module.exports.config = {
    name: 'setnick',
    aliases: [],
    staff: false,
    changelog: "!"
}