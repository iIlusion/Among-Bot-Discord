const ids = require('../../ids.json');

module.exports.run = async function (client, message, args, config, Discord) {
  
    let embed = new Discord.MessageEmbed()
      
      .setTitle("Ping do bot")
      .setDescription(`**O ping do bot é de ${Math.round(client.ws.ping)}ms!**`)
      .setImage("https://brasil.cambly.com/wp-content/uploads/2019/12/aprender-ingles-ao-vivo-online-english-cambly-live.gif", 50, 50)  
      
      message.channel.send(embed);
    }
    
    
    
    module.exports.config = {
        name: 'ping',
        aliases: ["latência"],
        staff: false,
        changelog: "!"
    }