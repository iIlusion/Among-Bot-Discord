const ProfileController = require('../../controllers/profile-controller.js');

module.exports.run = async function (client, message, args, config, Discord, ids, bypass = false) {
    message.delete({timeout:5000})


    



        let profile = ProfileController.getProfileOfId(message.member.id);
        let parceiro = message.mentions.members.first()
        if (!parceiro) return message.reply('Formato incorreto! Uso: `m!casar <@usuario>`').then(msg=>msg.delete({timeout:8000}));
        if (parceiro.id === message.author.id) return message.reply('Você não pode casar com si mesmo, sei que você se ama, mas não consigo realizar este casamento.')
        if (profile.casado) return message.reply (`Você já é casado, ta querendo trair sua esposa? <@${profile.casado}> da uma olhadinha aqui no seu parceiro.`)
        let profileparceiro = ProfileController.getProfileOfId(parceiro.id);
        if (profileparceiro.casado) return message.reply('Vitão? essa pessoa já é casada, pare de dar em cima dela.')
        
        message.channel.send(`<@${parceiro.id}> | o <@${message.author.id}> está pedindo sua mão em casamento, aceita?`).then(msg => {
            msg.react('✅').then(()=>{
                const time = 25000; // 25 sec
                const filter = (reaction, user) => user.id === parceiro.id;

                const collector = msg.createReactionCollector(filter, { time, max: 1 });
                collector.on('collect', (reaction, user) => {
                    collector.stop("Aceitou")
                    msg.delete({timeout:150}).catch(()=>{});
                });

                collector.on('end', (collected, reason) => {
                    if (reason && reason == "Aceitou") {
                        profile.casado = parceiro.id;
                        profileparceiro.casado = message.author.id
                        ProfileController.saveProfile(message.member.id, profile);
                        ProfileController.saveProfile(parceiro.id, profileparceiro);
                        message.channel.send(`<@${message.author.id}> se casou com o(a) <@${parceiro.id}>, felicidades ao casal :) `)
                        return
                    } else {
                        msg.delete({timeout:150}).catch(()=>{});
                        message.channel.send(`<@${message.author.id}> | <@${parceiro.id}> não aceitou seu pedido a tempo, ele tem apenas 25 segundos, envie um pedido novamente.`)
                    }
                })

            });
        })
}   

function alreadyFriend(member, but=null) {
    let profiles = ProfileController.getProfiles();
    for (let pId in profiles) {
        let p = profiles[pId];
        if (p.cargoB && member.roles.cache.has(p.cargoB) && but!==p.cargoB)
            return true;
    }
    return false;
}

module.exports.config = {
    name: 'casar',
    aliases: ["marry"],
    staff: false,
    changelog: "Agora você pode casar com quem você ama."
}