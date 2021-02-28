const ProfileController = require('../../controllers/profile-controller.js');
const JSONController = require('../../JSON/controller')
const ids = require('../../ids.json');

module.exports.run = async function (client, message, args, config, Discord, ids) {

    if (!(ids.devs.includes(message.author.id) || message.member.roles.cache.has(ids.booster))) return message.reply("Você não tem permissão para criar um cargo!").then(msg => msg.delete({timeout:5000}));


    let arg0 = (args[0]+"").toLowerCase();
    
    if (arg0==='info'||arg0==='informações') {
        let arg1 = (args[1]+"").toLowerCase();
        console.log(arg1)
        let profile = ProfileController.getProfileOfId(message.member.id);
        const canaisvip = JSONController.get('canaisvip')
        let canal = message.guild.channels.cache.find(channel => channel.id === profile.canalB || channel.id === arg1 || channel.name === arg1);
        if (!canal) return message.reply("Você não tem um canal, ou não digitou um id/nome certo, eu não posso te dar informações sobre nada.")
        let nome = canal.name
        criador = canaisvip[canal.id].dono
        message.reply(`O nome do canal em questão é \`${canal.name}\` ele foi criado por \`<@${criador}>\` e ele pertence ao cargo \`<@&${cargo}>\`.`)
        message.delete({timeout:1500});
        return
    }
    
    // modelo do comando m!canalb Reset/Delete/Clean - Remove o cargo juntamente com a sala
    if (arg0==='reset'||arg0==='delete'||arg0==='clean') {
        let profile = ProfileController.getProfileOfId(message.member.id);
        let canal = message.guild.channels.cache.find(role => role.id === profile.canalB);
        if (canal) {
            message.reply("clique no emote abaixo caso queira realmente deletar o seu canal, você não será reembolsado de suas BoostCoins, caso queira apenas trocar o nome dele utilize o comando m!canalb NovoNome.").then(msg => {
            msg.react('✅').then(()=>{
                const time = 25000; // 25 sec
                const filter = (reaction, user) => user.id === message.member.id;
                
                const collector = msg.createReactionCollector(filter, { time, max: 1})
                
                collector.on('collect', (reaction, user) => {
                    canal.delete().then(()=>{
                        const canaisvip = JSONController.get('canaisvip')
                        delete canaisvip[profile.canalB]
                        JSONController.set('canaisvip', canaisvip);
                        const ps = ProfileController.getProfiles();
                        for (let p2idx in ps) {
                        let p2 = ps[p2idx];
                            if (p2.canalB === profile.canalB){
                                p2.canalB = undefined;
                                ProfileController.saveProfile(p2idx, p2);
                                }
                            }
                        profile.canalB = undefined;
                        ProfileController.saveProfile(message.member.id, profile);
                        msg.delete({timeout:1500})
                        message.reply("Canal excluido com sucesso, crie outro utilizando m!canalb Nome, você irá precisar de 30 BoostCoins").then(msg => msg.delete({timeout:5000}));
                        message.react('✅');
                        message.delete({timeout:500})
                        }).catch(console.error);
                    })
                })
            })
            
        } 
        else 
            return message.react('❌').then(() => {
                message.reply("Você não tem nenhum canal para excluir, crie um utilizando m!canalb Nome").then(msg => msg.delete({timeout:5000}));
                message.delete({timeout:1500});
            });
        return;
    }

    let profile = ProfileController.getProfileOfId(message.member.id);
    let role = message.guild.roles.cache.find(role => role.id === profile.cargoB);
    if (!role) return message.reply("Você não tem um cargo criado, crie um utilizando o comando m!cargob Nome Cor.")

    // modelo do comando m!canalb Nome - Cria um canal novo com o nome que você definir, caso ja exista, apenas edita o existente
    if (!args) return message.reply('Formato: `m!cmd <nome>`').then(msg => msg.delete({timeout:5000}));
    let nome = args.join(' ').trim()
    if (nome.length > 30) return message.reply("O nome do canal não pode ter mais que 30 letras").then(msg => msg.delete({timeout:5000}));

    let banContains = /«|»|dono|moderadora?|coord/i;
    let banExact = ['STAFF', 'ADMIN', 'ADMINISTRADOR', 'MAKER', 'MOD', 'MODS', 'MOD\'S', 'ADM','EJETADO', 'FANTASMA', 'TRIPULANTE', 'IMPOSTOR', 'SHERLOCK HOLMES', 'ADMINISTRADORES', 'ADMINS', 'MODERADORES', 'ADMS', 'STAFFS', 'DJ'];

    if (banContains.test(nome) || nome.split(' ').filter(word=>banExact.includes(word.toUpperCase())).length>0) {
        message.react('❌');
        return message.reply('Você não pode criar um canal com esse nome!').then(msg => msg.delete({timeout:5000}));
    }

    
    if (profile.canalB) {
        let canal = message.guild.channels.cache.get(profile.canalB)
        if (!canal) {
            profile.canalB = undefined;
            ProfileController.saveProfile(message.member.id, profile);
            return module.exports.run(client, message, args, config, Discord, ids);
        }

        canal.edit({
            name: nome
        })
        .catch(console.error)
        message.react('✅');
    } else {
	
	const btc = 30;
	let qntSalas = message.guild.channels.cache.filter(c => c.parentID === '793506948078239764' && c.type == "voice").size
	
	if (profile.btc < btc && qntSalas >= 10 && !(ids.devs.includes(message.member.id))) return message.reply("Você não possui BoostCoins suficiente para criar um canal (30) e já existem 10 salas vips, não é possivel criar mais.").then(msg=>msg.delete({timeout:9000}));
	
	if (profile.btc < btc) 
		return message.reply('Você não tem BoostCoins suficiente para comprar um canal! (Requer 30).').then(msg=>msg.delete({timeout:9000}));
		
	if (qntSalas >= 10 && !(ids.devs.includes(message.member.id))) return message.reply("Já existem 10 salas vips, não é possivel criar mais.").then(msg=>msg.delete({timeout:9000}));
	
	        message.reply("clique no emote abaixo caso queira realmente criar o seu canal, você irá gastar 30 BoostCoins.").then(msg => {
                    msg.react('✅').then(()=>{
                    const time = 25000; // 25 sec
                    const filter = (reaction, user) => user.id === message.member.id;
                
                    const collector = msg.createReactionCollector(filter, { time, max: 1})
                    collector.on('collect', (reaction, user) => {
                        profile.btc = profile.btc - btc;
	                    const canaisvip = JSONController.get('canaisvip');
	                    const cargosvip = JSONController.get('cargosvip');
	                    
	                         message.guild.channels.create(nome, {
                                type: 'voice'
                                    }).then(async (channel) => {
	    
                        const catvip = ids.catvip
                        await channel.setParent(catvip);
                        await channel.updateOverwrite(profile.cargoB, { CONNECT: true });
                        profile.canalB = channel.id;
                        await ProfileController.saveProfile(message.member.id, profile);
                        canaisvip[channel.id] = {"timestamp": +new Date(), "dono":message.member.id, "cargo":profile.cargoB}
                        cargosvip[profile.cargoB].canal = channel.id
            	        await JSONController.set('canaisvip', canaisvip);
            	        await JSONController.set('cargosvip', cargosvip);
            
                        await channel.updateOverwrite(message.member.id, {
                            'SEND_MESSAGES': true,
                            'MUTE_MEMBERS': true,
                            'PRIORITY_SPEAKER': true,
                            'DEAFEN_MEMBERS': true,
                        });
                        const ps = ProfileController.getProfiles();
                        for (let p2idx in ps) {
                        let p2 = ps[p2idx];
                            if (p2.cargoB === profile.cargoB) {
                                channel.updateOverwrite(p2idx, {
                                'SEND_MESSAGES': true,
                                'MUTE_MEMBERS': true,
                                'PRIORITY_SPEAKER': true,
                                'DEAFEN_MEMBERS': true,
                                });
                            p2.canalB = profile.canalB
                            ProfileController.saveProfile(p2idx, p2);
                            }
                        }
                        message.delete({timeout:500})
                        message.reply("Seu canal foi criado com sucesso.").then(msg=>msg.delete({timeout:5000}))
                        msg.delete({timeout:500})
                    })
                    .catch(console.error);
                    })
                })
            })
    }
}

module.exports.config = {
    name: 'canalbooster',
    aliases: ["canalb"],
    staff: false,
    changelog: "Comando criado para os boosters gerencias seus comandos"
}