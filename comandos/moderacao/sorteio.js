const Discord = require('discord.js');
const ProfileController = require('../../controllers/profile-controller.js');
const ids = require('../../ids.json');

module.exports.pick = async function (client, channelId, msgId, level, qnt, premio) {
    const profiles = ProfileController.getProfiles();
    let requiredLevel = [];
    let inVoiceChat = [];
    for (let userId in profiles)
        if (ProfileController.levelIfXpEquals(profiles[userId].xp) >= level)
        requiredLevel.push(`<@${userId}>`);

        console.log(premio)

    let participating = [];
    const channels = client.guilds.cache.get(ids.servidor).channels.cache.filter(c => c.type === 'voice');

    for (const [channelID, channel] of channels)
      for (const [memberID, member] of channel.members)
        inVoiceChat.push(memberID);
    

    channel = client.channels.cache.get(channelId);
    channel.messages.fetch(msgId)
        .then(async message => {
            if (!message.reactions.cache.get(ids.sorteioEmojiId)) return;
            const reacts = await message.reactions.cache.get(ids.sorteioEmojiId).users.fetch();
            reacts.array().forEach(user => {
                if (requiredLevel.indexOf(`<@${user.id}>`)!=-1 && inVoiceChat.indexOf(user.id)!=-1)
                    participating.push(`<@${user.id}>`);
            });
            console.log("Participando do sorteio:", participating);

            sorteados = [];
            let lessParticipantsThanWinners = false;
            for (let i = 0; i < qnt; i++) {
                if (participating.length<1) {lessParticipantsThanWinners = true; break;};
                const randomId = Math.floor(Math.random() * participating.length);
                const random = participating[randomId];
                sorteados.push(random);
                delete participating[randomId];
                participating = participating.filter(el => el!=null);
            }
 
            embedText = sorteados;

            var randomColor = Math.floor(Math.random()*16777215).toString(16);
            let embed = new Discord.MessageEmbed()
                .setTitle("Sorteio - Among Us")
                .setThumbnail("https://image.prntscr.com/image/rHsE7qeTRfWeX-0E7vQErg.gif")
                .setColor(randomColor)
                .setDescription(`\n**Sorteados:**
                                 \n${embedText.join('\n')} ${
  lessParticipantsThanWinners ? "\n\n**Tinha menos participantes que pessoas para serem sorteadas, todos os participantes ganharam.**\n" : ""
                                }\nPrêmio: **${premio}**`)
                .setTimestamp()
                .setFooter('Among Bot', 'https://media.discordapp.net/attachments/757840599796809750/758612003106455582/astro.png');

                client.channels.cache.get(ids.sorteio).send(message.guild.roles.everyone.toString(), embed);
                 

        })
        .catch(console.error);
}

module.exports.run = async function (client, message, args, config, Discord) {
    if (message.member.hasPermission("ADMINISTRATOR")) {
        //if (!message.member.voice.channel) return message.reply("Você precisa estar num canal de voz para usar este comando!")
        if (!/^\d+ \d+:\d+ \d+\/\d+ \d+ .+$/.test(args.join(" ")))
            return message.reply("Formato incorreto! Use: ou m!sorteio <nivel minimo> <hh:mm> <dd/mm> <qnt. usuarios sorteados> <premio>")
                .then(msg=>message.delete({timeout: 10000})&msg.delete({timeout: 10000}));
        
        let level = parseInt(args[0]);
        let qnt = parseInt(args[3]);
        let premio = args.slice(4).length > 0 ? args.slice(4).join(' ').trim().slice(0, 150) : undefined
        let dateMonth = args[2].split('/');
        let timestamp = new Date(`${args[1]} ${dateMonth[1]}/${dateMonth[0]}/${new Date().getUTCFullYear()} GMT-3`).getTime();

        let sorteio = message.channel.createMessageCollector(m => m.author.id === message.author.id, {
            max: 1,
            time: 120000
        }).on('collect', collected => {
            msg = collected;
            msg.react(client.emojis.cache.get(ids.sorteioEmojiId));
            controller = require('../../JSON/controller.js');
            let json = controller.get('sorteios');
            json.push({channelId: msg.channel.id, msgId: msg.id, level, qnt, timestamp, premio});
            controller.set('sorteios', json)
        })
        message.react('✅');
    } else
        message.reply("Você não tem permissão para usar este comando.");
}
    
module.exports.config = {
    name: 'sorteio',
    aliases: ["pick"],
    canal: ids.sorteio,
    staff: true,
    changelog: "!"
}