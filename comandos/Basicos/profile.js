const fs = require('fs');
const Discord = require('discord.js');
const ids = require('../../ids.json');
const JSONController = require('../../JSON/controller.js');
const ProfileController = require('../../controllers/profile-controller.js');

async function embedProfile(channel, member, profile, attachment) {
    const level = ProfileController.levelIfXpEquals(profile.xp);
    const nextLevelExp = ProfileController.xpToReachLevel(
        ProfileController.levelIfXpEquals(ProfileController.xpToReachLevel(level+1)+1)
    );
    if (!profile.nick || profile.nick==="") {
        profile.nick = "Nick não cadastrado"
    }
    
    str = profile.casado
    let casadoMsg;
    if (str && str.includes(','))
        casadoMsg = str.split(',').map(id=>`<@${id}>`).join(' ')
    else
        casadoMsg = profile.casado ? `<@${profile.casado}>` : `Solteiro(a)`

    const cargo = ProfileController.rewardByLevel(level);
    const profileEmbed = new Discord.MessageEmbed()
    .setColor(profile.color)
    .attachFiles([process.cwd() + '/profile/templates/astro.png', attachment])
	.setTitle(':bookmark: Perfil de ' + member.displayName)
    .setAuthor(member.user.username, member.user.displayAvatarURL({dynamic: true}))
	.setDescription(profile.sobre)
	.setThumbnail('attachment://'+attachment['name'])
	.addFields(
		{ name: ':pager: Nível', value:  level, inline: true},
		{ name: ':game_die: Exp', value: profile.xp+'/'+nextLevelExp, inline: true },
        { name: ':coin: Gold', value: profile.gold ? profile.gold : 0, inline: true },
        { name: '<a:o_booster:805147026056019998> BoostCoin', value: profile.btc ? profile.btc : 0, inline: true },
        { name: ':revolving_hearts: Casado com', value: casadoMsg, inline: true},
        { name: ':tickets: Título', value: cargo ? `<@&${cargo}>` : 'Nenhum', inline: true },
        { name: ':bookmark_tabs: Nick', value: profile.nick, inline: true}
	)
	.setTimestamp()
	.setFooter('Among Bot', 'attachment://astro.png');

    await channel.send(profileEmbed);
}

const completeList = JSONController.get('items');
module.exports.run = async function (client, message, args, config, Discord) {
    const member = message.member;
    const user = member.id;

    const data = await fs.readFileSync(process.cwd() + '/profiles.json', "utf8");
    const amongImage = require(process.cwd() + '/profile/amongImage.js');
    let profiles = JSON.parse(data);
    const profile = ProfileController.getProfileOfId(user);

    if (args.length === 0) { // Mostrar perfil
        if (!profile.color) profile.color = '#C71110';
        amongImage(profile, attachment => {
            embedProfile(message.channel, member, profile, attachment)
        });
    } else if (args[0] === "cor" || args[0] === "color") { // Definir imagem
        newColor = args[1];
        let colors = {
            red: 'C71110', blue: '132ED2', darkgreen: '11802D',
            pink: 'EE54BB', orange: 'F07D0D', yellow: 'F6F657',
            black: '3F474E', white: 'D7E1F1', purple: '6B2FBC',
            brown: '71491E', cyan: '38FFDD', green: '50F039'
        };
        if (!/^#[a-fA-F0-9]{6}$/g.exec(newColor)) { // verificar cor
            newColor = colors[newColor];
            if (newColor) newColor = '#' + newColor;
            else
                return message.reply('Escolha uma destas cores:\n```'
                    + 'red      blue    darkgreen\n'
                    + 'pink     orange  yellow\n'
                    + 'black    white   purple\n'
                    + 'brown    cyan    green```')
        } else 
            return message.reply('Ainda não é possível comprar cores, quem sabe num futuro próximo...?');
        amongImage(profile, async attachment => {
            profile.color = newColor;
            profiles[user] = profile;
            const data = JSON.stringify(profiles);
            await fs.writeFileSync(process.cwd() + '/profiles.json', data);
            message.react('✅')
        });
    } else if (args[0] === "sobre" || args[0] === "about") {
        let descricao = args.slice(1).join(' ').trim();
        if (!descricao) {
            message.reply('Formato incorreto! Utilize: m!perfil sobre <descrição>');
            return;
        }
        if (descricao.length > 100) {
            message.reply('descrição muito grande! Utilize até 100 caracteres no máximo');
            return;
        }
        profile.sobre = descricao;
        profiles[user] = profile;
        const data = JSON.stringify(profiles);
        await fs.writeFileSync(process.cwd() + '/profiles.json', data);
        message.react('✅')
    } else if (args[0] === "nick" || args[0] === "ign"){
        let nick = args.slice(1).join(' ').trim();
        if (!nick) {
            message.reply('Formato incorreto! Utilize m!perfil nick <Seu Nick>');
            return;
        }
        if(!/^[0-9 A-Za-zÀ-ÖØ-öø-ÿ]{1,10}$/i.exec(nick.trim())){
            message.reply('Formato Invalido! o Among Us apenas aceita nomes sem caracteres especiais de 1 a 10 caracteres.')
            return;
        }
        profile.nick = nick;
        profiles[user] = profile;
        const data = JSON.stringify(profiles);
        await fs.writeFileSync(process.cwd() + '/profiles.json', data);
        message.react('✅')
    } else if (args[0] === "use") {
        let id = parseInt(args[1]);
        if (args[1]&&args[1]==='clear') id = 0;
        if (!id && id!==0) return message.reply('Formato: m!profile use <Nº>')
        const profile = ProfileController.getProfileOfId(message.member.id);
        if (!profile.items.includes(id)&&id!==0) 
            return message.reply('Você ainda não desbloqueou este item! Confira seus itens usando \`m!itemlist\`.')
        if (id===0)
            profile.bgId = profile.chId = profile.trId = profile.ptId = 0;
        else for (let item of completeList)
            if (item[0]===id)
                if (item[3]===0)
                    profile.bgId=id;
                else if (item[3]===1)
                    profile.chId=id;
                else if (item[3]===2)
                    profile.trId=id;
                else if (item[3]===3)
                    profile.ptId=id;
        ProfileController.saveProfile(message.member.id, profile);
        return message.reply('Cosméticos atualizados!')
    } else if (mentioned = message.mentions.members.first()) {
        const mentionedProfile = ProfileController.getProfileOfId(mentioned.id);
        if (!mentionedProfile.color) mentionedProfile.color = '#C71110';
        amongImage(mentionedProfile, file => {
            embedProfile(message.channel, mentioned, mentionedProfile, file)
        });
    } else {
        return message.react('❓');
    }
}
    
module.exports.config = {
    name: 'perfil',
    aliases: ["profile"],
    staff: false,
    changelog: "Ultimo cargo (ranking) aparecerá no perfil"
}