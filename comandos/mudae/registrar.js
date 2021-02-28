const fs = require('fs');
const Discord = require('discord.js');
const ids = require('../../ids.json');
const ProfileController = require('../../controllers/profile-controller.js');
const message = require('../../events/message');

function pad(num){
    num = ""+num;
    var pad = "00";
    return pad.substring(0, pad.length - num.length) + num;
}

function dhm(ms){
    years     = Math.floor(ms / (365*24*60*60*1000));
    yearsms   = ms % (365*24*60*60*1000);
    months    = Math.floor((yearsms)/(30*24*60*60*1000));
    monthsms  = ms % (30*24*60*60*1000);
    days      = Math.floor((monthsms)/(24*60*60*1000));
    daysms    = ms % (24*60*60*1000);
    hours     = Math.floor((daysms)/(60*60*1000));
    hoursms   = ms % (60*60*1000);
    minutes   = Math.floor((hoursms)/(60*1000));
    minutesms = ms % (60*1000);
    sec       = Math.floor((minutesms)/(1000));
    if (years>0)
        return years+"a " + months+"m";
    else if (months>0)
        return months+"m " + days+"d";
    else
        return (days>0?days+"d - ":"") + pad(hours) + "h" + pad(minutes) + "m";
}

async function embedProfile(channel, member, profile, sender) {


    const level = ProfileController.levelIfXpEquals(profile.xp);
    const usuarioDesde = +new Date()-member.user.createdTimestamp;
    const membroDesde = +new Date()-member.joinedTimestamp;

    const dias = 24*60*60*1000;
    let requisito1 = usuarioDesde > 30*dias;
    let requisito2 = membroDesde > 7*dias;
    let requisito3 = level >= 5;
    const mayRegister = requisito1 && requisito2 && requisito3;
    const negar = ` <:negar:${ids.negarEmojiId}>`;
    const confirmar = ` <:confirmar:${ids.confirmarEmojiId}>`;
    requisito1 = requisito1 ? confirmar : negar;
    requisito2 = requisito2 ? confirmar : negar;
    requisito3 = requisito3 ? confirmar : negar;

    const profileEmbed = new Discord.MessageEmbed()
    .setColor(mayRegister ? '50fa7b' : 'ff5555')
    .attachFiles([process.cwd() + '/profile/templates/astro.png'])
	.setTitle('Mudae Pass')
    .setAuthor(sender.user.username, sender.user.displayAvatarURL({dynamic: true}))
    .setDescription(`Requisitos para inscrição:\n • 30 dias de discord\n • 7 dias do servidor\n • Cargo <@&${ids.rewardsByLevel['5']}> (Nivel 5+)\n`
    + (mayRegister ? 'Reaja com ✅ para participar do evento' : 'Aviso: você **não** possui todos os requisitos mínimos para participar do evento. :/'))
	.setThumbnail(member.user.displayAvatarURL({dynamic:true}))
	.addFields(
        { name: ':date: Discord' + requisito1, value: dhm(usuarioDesde), inline: true},
        { name: ':star2: Servidor' + requisito2, value: dhm(membroDesde), inline: true},
        { name: ':pager: Nível' + requisito3, value:  level, inline: true}
	)
	.setTimestamp()
	.setFooter('Among Bot', 'attachment://astro.png');

    await channel.send(profileEmbed).then(msg=>{
        if (mayRegister)
            msg.react('✅').then(()=>{
                const time = 15000; // 15 sec
                const filter = (reaction, user) => user.id === member.id;

                const collector = msg.createReactionCollector(filter, { time, max: 1 });
                collector.on('collect', (reaction, user) => {
                    collector.stop("Aceitou")
                });

                collector.on('end', async (collected, reason) => {
                    profileEmbed.fields = undefined;
                    profileEmbed.thumbnail = undefined;
                    await msg.reactions.removeAll();
                    if (reason && reason == "Aceitou") {
                        profileEmbed.setDescription('Você está dentro do evento! \\:)')
                        member.roles.add(ids.mudaePlayer);
                        msg.delete({timeout:10000})
                    } else {
                        profileEmbed.setColor('ff5555')
                        profileEmbed.setDescription('Tempo esgotado!')
                        msg.delete({timeout:10000})
                    }
                    msg.edit(profileEmbed);
                })

            });
    });
}

module.exports.run = async function (client, message, args, config, Discord) {
    message.delete({timeout:500})
    const member = message.member;
    const user = member.id;

    const profile = ProfileController.getProfileOfId(user);

    if (args.length === 0) { // Mostrar perfil
        embedProfile(message.channel, member, profile, message.member)
    } else if ((mentioned = message.mentions.members.first()) || (mentioned = message.guild.members.cache.get(args[0]))) {
        const mentionedProfile = ProfileController.getProfileOfId(mentioned.id);
        if (!mentionedProfile.color) mentionedProfile.color = '#C71110';
            embedProfile(message.channel, mentioned, mentionedProfile, message.member)
    }
}
    
module.exports.config = {
    name: 'registrar',
    aliases: ["register"],
    canal: ids.registrar,
    staff: false,
    changelog: "!"
}