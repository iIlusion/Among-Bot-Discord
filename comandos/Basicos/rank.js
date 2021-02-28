const fs = require('fs');
const Discord = require('discord.js');
const ProfileController = require('../../controllers/profile-controller.js');
const ids = require('../../ids.json');

async function embedRank(client, message) {
    const profiles = ProfileController.getProfiles();
    const top10 = Object.entries(profiles).sort((a, b) => {return b[1].xp-a[1].xp}).slice(0, 10);
    let i = 0;
    let embedText = await top10.map(profile => {
        let name = profile[0];
        const level = ProfileController.levelIfXpEquals(profile[1].xp);
        return [name, `${++i}. %NAME% - Nível ${level} (${profile[1].xp}exp)`]
    });
    const promise4All = Promise.all(embedText.map(Promise.all.bind(Promise)));
    promise4All.then(function(results) {
        var randomColor = Math.floor(Math.random()*16777215).toString(16);
        results = results.map(x=>x[1].replace("%NAME%", `<@${x[0]}>`));
        let embed = new Discord.MessageEmbed()
            .setTitle("Ranking do Among")
            .setThumbnail(client.user.avatarURL())
            .setColor(randomColor)
            .setDescription(`\n**Top 10 maiores exp do servidor:**
                             \n${results.join('\n')}`)
            .setTimestamp()
            .setFooter('Among Bot', 'https://media.discordapp.net/attachments/757840599796809750/758612003106455582/astro.png');
        
        message.channel.send(embed);  
    })
}


module.exports.run = async function (client, message, args, config, Discord) {
    await embedRank(client, message);
}
    
module.exports.config = {
    name: 'rank',
    aliases: ["top"],
    staff: false,
    changelog: "!"
}