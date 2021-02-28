const { Guild } = require("discord.js");
const ids = require('../../ids.json');

module.exports.run = async function (client, message, args, config, Discord, ids) {
if (message.member.hasPermission("ADMINISTRATOR")) {
    message.delete({ timeout: 100 })
    message.channel.send('Será uma partida `Oficial` ou uma partida `Normal`?')
    
    let partida = message.channel.createMessageCollector(m => m.author.id === message.author.id, {
        max: 1,
        time: 15000
    })

    partida.on("collect", () => {
        recebido = partida.collected.first().content
        if (recebido === "oficial") {
            message.channel.send('Qual vai ser o numero da sala? Lembrando, se o numero for menor que 9 utilize 09.')
        let nome = message.channel.createMessageCollector(m => m.author.id === message.author.id, {
            max: 1,
            time: 15000
        });

        nome.on("collect", () => {
            const recebido = nome.collected.first().content
            message.channel.send('O canais estão sendo criados')
    
            const modRole = message.guild.roles.cache.find(r => r.id === ids.moderadorp);
            const muteRole = message.guild.roles.cache.find(r => r.id === ids.mutado);
    
            message.guild.channels.create('Partida '+recebido, {
                type: 'voice'
            }).then(async (channel) => {
                const partidaoficial = ids.partidaoficial
                await channel.setParent(partidaoficial);
                await channel.setUserLimit(10);
            })
    
            message.guild.channels.create('Partida-'+recebido, {
                type: 'text'
            }).then(async (channel) => {
                const partidaoficial = ids.partidaoficial
                await channel.setParent(partidaoficial);
                await channel.updateOverwrite(message.guild.roles.everyone, { VIEW_CHANNEL: false });
            })
    
    
    
            message.channel.send('As salas foram criadas com sucesso.')
            })
    

        } else if (recebido === "normal") {
            message.channel.send('Qual vai ser o numero da sala? Lembrando, se o numero for menor que 9 utilize 09.')
            let nome = message.channel.createMessageCollector(m => m.author.id === message.author.id, {
                max: 1,
                time: 15000
            });
            nome.on("collect", () => {
                const recebido = nome.collected.first().content
                message.channel.send('O canal está sendo criado')
        
                const muteRole = message.guild.roles.cache.find(r => r.id === ids.moderador);
        
                message.guild.channels.create('『🚀』Nave '+recebido, {
                    type: 'voice'
                }).then((channel) => {
                    const partidanormal = ids.partidanormal
                    channel.setParent(partidanormal);
                    channel.setUserLimit(10)
                    channel.createInvite({
                        maxAge: 0,
                        maxUses: 0
                    }).catch(console.error)

                })
        
                message.channel.send('As salas foram criadas com sucesso.')
                })
        } else return message.channel.send('Parametro invalido! Utilize apenas `Oficial` ou Normal.')
    })
    }
}   
    
    
    module.exports.config = {
        name: 'criar',
        aliases: ["criarp"],
        canal: ids.comandos,
        staff: true,
        changelog: "!"
    }