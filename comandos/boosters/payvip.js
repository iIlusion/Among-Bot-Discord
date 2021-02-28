const ids = require('../../ids.json');
const ProfileController = require('../../controllers/profile-controller.js');

module.exports.run = async function (client, message, args, config, Discord) {
    message.delete({timeout:1000})
    const user = message.author
    const profile = ProfileController.getProfileOfId(user.id);
    
  
    if (!args[1]) return message.reply("Uso: m!payvip <@user> <qnt> Ex: m!payvip @Lx 15");
    let receptor = message.mentions.members.first()
    if (receptor.user === message.author) return message.channel.send("**Você não pode transferir BoostCoins para si mesmo.**")
    if (receptor.user.bot) return message.channel.send(`**Você não pode transferir BoostCoins ao \`${receptor.user.username}\` ele é um bot, não saberia onde gastar.**`)
    let valor = args.splice(1).join(" ").trim()
    let valorn = parseInt(valor)
    let btcatual = profile.btc ? profile.btc : 0
    if (!valorn) return message.reply("Você deve digitar um valor de BoostCoin valido.")
    if (btcatual < valor) return message.reply(`**Você não tem essa quantidade toda, você tem apenas \`${btcatual}\` BoostCoins**`)
    if (valor < 5) return message.reply(`**Você não pode transferir apenas \`${valor}\` BoostCoins, o valor minimo de transferencia é de \`5\`**`)
    
    message.channel.send(`**<@${receptor.id}> | O <@${user.id}> deseja lhe enviar \`${valorn}\` BoostCoins, você deseja aceita-los?**`).then(msg => {
        msg.react('✅').then(()=>{
            const time = 25000; // 25 sec
            const filter = (reaction, user) => user.id === receptor.id;
            
            const collector = msg.createReactionCollector(filter, { time, max: 1 });
            collector.on('collect', (reaction, user) => {
                    collector.stop("Aceitou")
                    msg.delete({timeout:150}).catch(()=>{});
                });
                
                collector.on('end', (collected, reason) => {
                    if (reason && reason == "Aceitou") {
                        profilereceptor = ProfileController.getProfileOfId(receptor.id);
                        btcatualreceptor = profilereceptor.btc;
                        receber = btcatualreceptor + valorn;
                        retirar = btcatual - valorn;
                        profilereceptor.btc = receber;
                        profile.btc = retirar;
                        ProfileController.saveProfile(message.member.id, profile);
                        ProfileController.saveProfile(receptor.id, profilereceptor);
                        message.channel.send(`**<@${user.id}> | <@${receptor.id}> aceitou, sua transferencia de \`${valorn}\` BoostCoins foi realizada com sucesso!** `)
                        return
                    } else {
                        msg.delete({timeout:150}).catch(()=>{});
                        message.channel.send(`<@${user.id}> | <@${receptor.id}> não aceitou sua transferencia a tempo, ele tem apenas 25 segundos, efetue sua transferencia novamente.`)
                    }
                })
        })
    })
  
    
  
    }
    
    
    
    module.exports.config = {
        name: 'payvip',
        aliases: ["payv"],
        staff: false,
        changelog: "Criado comando para transferencia de BoostCoins entre usuarios."
    }