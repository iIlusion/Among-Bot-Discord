const ids = require('../../ids.json');

module.exports.run = async function (client, message, args, config, Discord) {
    
    let cargo = message.guild.roles.cache.find(role => role.id === ids.hex);
    let cor = args[0]
    if (!cor) return message.reply("Está faltando uma cor, utilize o comando da seguinte maneira m!hex #ffffff")
    cargo.edit({
        name: cor,
        color: cor
    });
    message.channel.send(`<@&${cargo.id}>`);

    }
    
    
    
    module.exports.config = {
        name: 'hex',
        aliases: ["hex"],
        staff: false,
        changelog: "Cargo criado para testar cores hex em cargos."
    }