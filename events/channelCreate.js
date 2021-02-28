const Discord = require("discord.js");
const ids = require('../ids.json');

module.exports = async (client, channel) => {
    if (!channel.guild) return;
    const role = channel.guild.roles.cache.find(role => role.id === ids.mutado);
    channel.updateOverwrite(role, {'SEND_MESSAGES': false, 'SPEAK': false});
}