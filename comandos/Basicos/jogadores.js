const { MessageEmbed } = require("discord.js");
const ids = require('../../ids.json');

module.exports.run = async function (client, message, args, config, Discord) {
    var embed = new Discord.MessageEmbed()
    const guild = message.guild;

    //const category = guild.channels.cache.find(c => c.parentID === '760916149168242713');
    //console.log(channels.members)
    
    let jogadores = 0
    let category = guild.channels.cache.filter(c => c.parentID === ids.partidanormal && c.type == "voice") 
    let channels = category.sort().filter(c => {
            jogadores += c.members.size
    });

    message.channel.send(`**Atualmente temos ${jogadores} players em partidas não oficiais.**`)
}
    
    
module.exports.config = {
    name: 'jogadores',
    aliases: ["players"],
    staff: false,
    changelog: "Contar jogadores em partidas não oficiais"
}