
const ids = require('../../ids.json');
const timeWarning = `\n\nVocê só tem **2 minutos** para cada pergunta (se tempo **acabar**, use o comando de reportar no canal <#${ids.reportar}> novamente).`;

module.exports.run = async (client, message, args, config, Discord, ids) => {
    let idreport = "", idmsg = "", idmsg2 = "", sala = "", reportado = "", motivo = "";

    let embed = new Discord.MessageEmbed()
    .setAuthor(`Sistema de Report`, `https://media.discordapp.net/attachments/757840599796809750/758612003106455582/astro.png`)
    .setThumbnail("https://media.discordapp.net/attachments/760916147784122401/771315087762784256/6ifSFFK.gif")
    .setColor('#C71110')
    .setTimestamp()
    .setFooter('Among Bot', 'https://media.discordapp.net/attachments/757840599796809750/758612003106455582/astro.png');


    await message.delete({timeout:500})

    await message.guild.channels.create('Report', {
        type: 'text'
    }).then(async (channel) => {
        idreport = channel
        let repchannel = message.guild.channels.cache.get(ids.reportar);
        await channel.setParent(ids.reportcat);
        await channel.updateOverwrite(message.guild.roles.everyone.id, { VIEW_CHANNEL: false, SEND_MESSAGES: false });
        await channel.updateOverwrite(message.author.id, { VIEW_CHANNEL: true, SEND_MESSAGES: true });
        await channel.setPosition(repchannel.position+1)
        criarColetor1();
    })

    function criarColetor1() {
        embed.fields = []
        embed.setTitle("Qual sala?")
        embed.setDescription("> Em qual sala o úsuario a ser reportado está?"
                         + "\n> Ex: `Partida Normal 05`."
                         + "\n> Caso ele **não** esteja em nenhuma, digite `Nenhuma`." + timeWarning)
        idreport.send(message.author.toString(), embed).then(msg => idmsg = msg)
        let report1 = idreport.createMessageCollector(async m => m.author.id === message.author.id, {
            max: 1,
            time: 120000
        })
        
        report1.on("collect", async m => {
            sala = report1.collected.first().content
            m.delete({timeout:500});
            report1.stop("Respondeu");
        })

        report1.on("end", async (collected, reason) => {
            if (reason && reason == "Respondeu"){
                await idmsg.delete({timeout:500});
                criarColetor2();
            } else  {
                await idmsg.delete();
                embed.setTitle("Tempo Esgotado")
                embed.setDescription(timeWarning + `\n**Esta sala será excluida em 15 segundos**`)
                await idreport.send(message.author.toString(), embed)
                setTimeout(function(){ idreport.delete(); }, 15000);
            }
        })
    }

    function criarColetor2() {

        embed.setTitle("Aviso")
        embed.setDescription("> **ATENÇÃO**: você precisará indicar a pessoa reportada de acordo com a **wiki** e **faq**!"
                         + "\n> Caso esteja pronto, responda com **`reportar`**"
                         + "\nWiki: <#"+ids.wiki+"> | Faq: <#"+ids.faq+">" + timeWarning)
        idreport.send(message.author.toString(), embed).then(msg => idmsg = msg)
        let report2 = idreport.createMessageCollector(async m => m.author.id === message.author.id, {
            max: 999,
            time: 120000
        })
        
        report2.on("collect", async m => {
            recebido = m.content.toLowerCase()
            if (recebido == "reportar") {
                m.delete({timeout:500});
                report2.stop("Respondeu")
            } else {
                if (idmsg2) {
                    idmsg2.delete();
                    //idmsg2 = ""
                }
                idreport.send(`**Não está pronto? Caso tenha alguma dúvida consulte o canal de <#${ids.faq}> ou <#${ids.wiki}>**`).then(msg => {
                    idmsg2 = idmsg
                    m.delete({timeout:500});
            })
            }
            
        })

        report2.on("end", async (collected, reason) => {
            if (reason && reason == "Respondeu"){
                await idmsg.delete({timeout:500});
                if (idmsg2) {
                    idmsg2.delete();
                    idmsg2 = ""
                }
                criarColetor3();
            } else  {
                await idmsg.delete({timeout:500});
                if (idmsg2) {
                    idmsg2.delete();
                    idmsg2 = ""
                }
                embed.setTitle("Tempo Esgotado")
                embed.setDescription(timeWarning + `\n**Esta sala será excluida em 15 segundos**`)
                await idreport.send(message.author.toString(), embed)
                setTimeout(function(){ idreport.delete(); }, 15000);
            }
        })
    }

    function criarColetor3() {
        idreport.updateOverwrite(message.guild.roles.everyone.id, { VIEW_CHANNEL: true });
        embed.setTitle("Quem deseja reportar?")
        embed.setDescription("> **Marque** a pessoa que você deseja reportar ou apenas envie o **ID**." + timeWarning)
        idreport.send(embed).then(msg => idmsg = msg)
        let report3 = idreport.createMessageCollector(async m => m.author.id === message.author.id, {
            max: 999,
            time: 120000
        })
        
        report3.on("collect", async m => {
        reportado = m.mentions.members.first();
        if (reportado) {
            reportado = reportado.id;
            m.delete({timeout:500})
            report3.stop("Respondeu")
            return
        }
        if (!reportado && /^\d+$/.test(m.content)) {
            reportado = m.content;
            m.delete({timeout:500})
            report3.stop("Respondeu")
            return
        } else if (!reportado) {
            m.delete({timeout:500})
            if (idmsg) idmsg.delete();
            m.channel.send("**Usuário não encontrado!** Marque a pessoa ou use o ID dela.").then(msg => idmsg = msg)
            return
        }
    })
        report3.on("end", async (collected, reason) => {
            if (reason && reason == "Respondeu"){
                await idmsg.delete({timeout:500});
                idreport.updateOverwrite(message.guild.roles.everyone.id, { VIEW_CHANNEL: false });
                criarColetor4();
            } else  {
                await idmsg.delete();
                embed.setTitle("Tempo Esgotado")
                embed.setDescription(timeWarning + `\n**Esta sala será excluida em 15 segundos**`)
                await idreport.send(message.author.toString(), embed)
                setTimeout(function(){ idreport.delete(); }, 15000);
            }
        })
    }

    function criarColetor4() {
        embed.setTitle("Qual o motivo?")
        embed.setDescription("> Escreva **detalhadamente** o que esse usuário fez." + timeWarning)
        idreport.send(message.author.toString(), embed).then(msg => idmsg = msg)
        let report4 = idreport.createMessageCollector(async m => m.author.id === message.author.id, {
            max: 999,
            time: 120000
        })
        
        report4.on("collect", async m => {
        motivo = m.content
        m.delete({timeout:500})
        if (idmsg) idmsg.delete()
        if (motivo.length < 25) {
            embed.setDescription("O motivo da sua denuncia não pode ser tão pequeno, desenvolva melhor o seu motivo.")
            m.reply(embed).then(msg => idmsg = msg)
            return
        } 
        if (motivo.length > 1024) {
            embed.setDescription("Sua denuncia não pode ter mais que 1024 caracteres.")
            m.reply(embed).then(msg => idmsg = msg)
        }
        report4.stop("Respondeu")
    })
        report4.on("end", async (collected, reason) => {
            if (reason && reason == "Respondeu"){
                criarColetor5();
            } else  {
                embed.setTitle("Tempo Esgotado")
                embed.setDescription(timeWarning + `\n**Esta sala será excluida em 15 segundos**`)
                await idreport.send(message.author.toString(), embed)
                setTimeout(function(){ idreport.delete(); }, 15000);
            }
        })
    }

    function criarColetor5() {
        embed.setTitle(`Denuncia de: ${message.author.username}\n(ID: ${message.author.id})`)
        embed.setDescription('**Revise todos os dados** da sua Denuncia e responda com **`sim`** para efetiva-la ou com **`reiniciar`** para recomeçar a sua denuncia.')
        embed.addFields([
            {name: 'Usuário Reportado', value: `<@${reportado}>`},
            {name: 'Sala', value: sala},
            {name: 'Razão do Report:', value: motivo}
        ]);
        idreport.send(message.author.toString(), embed).then(msg => idmsg2 = msg)
        let report5 = idreport.createMessageCollector(async m => m.author.id === message.author.id, {
            max: 999,
            time: 120000
        })
        
        report5.on("collect", async m => {
            let recebido = m.content.toLowerCase();
            if (recebido == "sim") {
                m.delete({timeout:500});
                report5.stop("Finalizou")
                return
            } else if (recebido == "reiniciar") {
                m.delete({timeout:500});
                report5.stop("Reiniciou")
                return
            } else {
                m.delete({timeout:500}); 
                if (idmsg) idmsg.delete();
                idreport.send(embed).then(msg => idmsg = msg)
                return
            } 
    
    })
        report5.on("end", async (collected, reason) => {
            if (reason && reason == "Finalizou"){
                idmsg2.delete({timeout:500});
                console.log(embed)
                embed.description = ''
                const reportsChannel = message.guild.channels.cache.get(ids.reportmod);
                reportsChannel.send(embed)
                idreport.send("**Sua denuncia foi enviada com sucesso, esse canal será deletado em 15 segundos**")
                setTimeout(function(){ idreport.delete(); }, 15000);
                return
            } else if (reason && reason == "Reiniciou") {
                idmsg2.delete({timeout:500});
                criarColetor1();
                return
            } else  {
                idmsg2.delete({timeout:500});
                embed.setTitle("Tempo Esgotado")
                embed.setDescription(timeWarning + `\n**Esta sala será excluida em 15 segundos**`)
                await idreport.send(message.author.toString(), embed)
                setTimeout(function(){ idreport.delete(); }, 15000);
            }
        })
    }

}

module.exports.config = {
    name: 'reportt',
    aliases: ['reportarteste'],
    canal: ids.reportar,
    staff: false,
    changelog: "Report com ticket"
}