const fs = require('fs');
const Discord = require('discord.js');
const ids = require('../../ids.json');
const ProfileController = require('../../controllers/profile-controller.js');

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
        return years+"a " + months+"m " + days+"d " + pad(hours) + "h";
    else if (months>0)
        return months+"m " + days+"d - " + pad(hours) + "h" + pad(minutes)+"m";
    else
        return (days>0?days+"d - ":"") + pad(hours) + "h" + pad(minutes) + "m" + pad(sec)+"s";
}

async function embedProfile(channel, member, profile, sender) {
    const level = ProfileController.levelIfXpEquals(profile.xp);
    const nextLevelExp = ProfileController.xpToReachLevel(
        ProfileController.levelIfXpEquals(ProfileController.xpToReachLevel(level+1)+1)
    );
    
    if (!profile.nick || profile.nick==="") {
        profile.nick = "IGN não cadastrado"
    }

    const profileEmbed = new Discord.MessageEmbed()
    .setColor(profile.color)
    .attachFiles([process.cwd() + '/profile/templates/astro.png'])
	.setTitle('Perfil de ' + member.user.tag)
    .setAuthor(sender.user.username, sender.user.displayAvatarURL({dynamic: true}))
	.setDescription("Informações administrativas do usuário:")
	.setThumbnail(member.user.displayAvatarURL({dynamic:true}))
	.addFields(
        { name: ':bookmark: Nickname', value: member.displayName, inline: true},
        { name: ':computer: ID', value: '`'+member.id+'`', inline: true},
        { name: ':bookmark_tabs: IGN', value: profile.nick, inline: true},
        { name: ':date: Usuário desde', value: dhm(+new Date()-member.user.createdTimestamp), inline: true},
        { name: ':star2: Membro desde', value: dhm(+new Date()-member.joinedTimestamp), inline: true},
        { name: '\u200b', value: '\u200b', inline: true},
		{ name: ':pager: Nível', value:  level, inline: true},
		{ name: ':game_die: Exp', value: profile.xp+'/'+nextLevelExp, inline: true },
        { name: ':art: Cor', value: profile.color, inline: true },
	)
	.setTimestamp()
	.setFooter('Among Bot', 'attachment://astro.png');

    await channel.send(`<@${member.id}>`, profileEmbed);
}

module.exports.run = async function (client, message, args, config, Discord) {
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
    name: 'userinfo',
    aliases: ["ui"],
    canal: ids.comandos,
    staff: false,
    changelog: "!"
}