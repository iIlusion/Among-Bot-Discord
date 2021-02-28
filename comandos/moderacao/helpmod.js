const ids = require('../../ids.json');
module.exports.run = async function (client, message, args, config, Discord) {
    if (!(ids.devs.includes(message.author.id) || message.member.roles.cache.has(ids.moderadorp) || message.member.roles.cache.has(ids.moderador))) return message.reply("Você não tem permissão!");
    var randomColor = Math.floor(Math.random()*16777215).toString(16);

    let embed = new Discord.MessageEmbed()
    .setTitle("Menu de Ajuda de Comandos (Moderadores)")
    .setThumbnail(client.user.avatarURL())
    .setColor(randomColor)
    .setDescription(`**Lista de comandos do BOT e suas respectivas funções.**
                     O Prefixo do BOT é \`m!\`, use antes de todos os comandos.
                     
                     **Geral**ﾠ
                     \`m!time <@usuario/id>\` - Exibe as penalidades de um usuario
                     \`m!userinfo [@usuario/id]\` - Exibe dados de um membro

                     **Moderadores de Partida**
                     \`m!sync\` - Sincronizar sala.
                     \`m!unsync\` - Dessincronizar sala (ou apenas saia do canal de voz).
                     \`m!init\` - Desbloqueia canal de voz (ou :closed_lock_with_key:).
                     \`m!setnick <@user/id> <nick>\` - sincroniza usuario.
                     
                     **Moderadores**
                     \`m!warn <@usuário> [motivo]\` - +1 aviso ao usuário.
                     \`m!banp <@usuário> <tempo> [motivo]\` - Banir de partidas.
                     \`m!mute <@usuário> <tempo> [motivo]\` - Silenciar usuário.
                     \`m!ban <@usuario> [tempo] [motivo]\` - Banir usuário.
                     \`m!unwarn <@usuário>\` - -1 aviso ao usuário.
                     \`m!unbanp <@usuário>\` - Desbanir de partidas.
                     \`m!unmute <@usuário>\` - Dessilenciar usuário.
                     \`m!unban <id>\` - Desbanir usuário.
                     \`m!editban <id> +|-<tempo>\` - Editar o tempo do ban.
                     \`m!clear <1~100>\` - Limpar ultimas mensagens.

                     **Parâmetros**
                     \`<...>\` Obrigatório
                     \`[...]\` Opcional
                     \`|\` Ou

                     **BOT Developers:**
                     Mafios#1972
                     brandino#1300
                     control my mind#1111
                     
                     [Twitter](https://twitter.com/amongooc) | [Discord](https://discord.gg/amongooc)`)
    .setTimestamp()
    .setFooter('Among Bot', 'https://media.discordapp.net/attachments/757840599796809750/758612003106455582/astro.png');
    
    message.channel.send(embed);
}
    module.exports.config = {
        name: 'helpmod',
        aliases: ["ajudamod"],
        canal: ids.comandos,
        staff: true,
        changelog: '!',
        description: 'Mostra o menu de ajuda para moderadores'
    }
