const ids = require('../../ids.json');
module.exports.run = async function (client, message, args, config, Discord) {

    var randomColor = Math.floor(Math.random()*16777215).toString(16);

    let embed = new Discord.MessageEmbed()
    .setTitle("Menu de Ajuda de Comandos")
    .setThumbnail(client.user.avatarURL())
    .setColor(randomColor)
    .setDescription(`**Lista de comandos do BOT e suas respectivas funções.**
                     O Prefixo do BOT é \`m!\`, use antes de todos os comandos.

                     **Geral**
                     \`m!help\` - Mostra o menu de ajuda de comandos do BOT.
                     \`m!ping\` - Mostra a latência em MS (milissegundos) do BOT.
                     \`m!rank\` - Exibe lista com o TOP 10 no rank de XP.
                     \`m!time <@usuario>\` - Exibe as penalidades de um usuario
                     \`m!salas\` - Exibe lista com partidas normais disponíveis (com vaga).
                     \`m!divulgar [código] <regiao> [mapa]\` - Divulgar sala
                     \`m!profile ou m!profile <@usuario>\` - Exibe os dados do perfil.
                     \`m!profile color\` - Exibe as cores disponíveis.
                     \`m!profile color <cor>\` - Troca a cor do seu avatar.
                     \`m!profile about <mensagem>\` - Troca sua bio no perfil.
                     \`m!profile nick <IGN>\` - Define seu nick no jogo (Among Us).
                     \`m!profile use <Nº>\` - Usar um item do seu inventário.
                     \`m!profile use clear\` - Limpa os items usados.
                     \`m!itemlist\` - Listar items do seu inventário.
                     \`m!shop\` - Loja de cosméticos.
                     \`m!buy <código>\` - Comprar um item (códigos em: \`m!shop\`).
                     \`m!report <usuário> <razão>\` - Reportar usuário.
                     
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
        name: 'help',
        aliases: ["ajuda"],
        description: 'Mostra o menu de ajuda de comandos do BOT',
        staff: false,
        changelog: 'Add novos comandos'
    }
