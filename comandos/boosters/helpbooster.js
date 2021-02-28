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
                     \`m!cargob <Nome> <#COR>\` - Cria um novo cargo vip junto com sua cor ou atualiza um cargo existente, não pode ter mais que 30 caracteres e alguns nomes são proibidos.
                     \`m!cargob dar <@Usuario>\` - Da o cargo pra um usuario (ele precisa aceitar). - Aliases: set/add
                     \`m!cargob remover @Usuario\` - Remove o cargo de um usuario. - Aliases: unset
                     \`m!cargob reset\` - Exclui seu cargo e remove todos os usuarios dele, caso tenha uma sala criada, remove ela também. - Aliases: delete/clean
                     \`m!canalb Nome\` - Cria um canal na categoria vip, maximo de 30 caracteres e com alguns nomes proibidos.
                     \`m!canalb reset\` -Exclui seu canal, apenas o canal. - Aliases: delete/clean
                     
                     **BOT Developers:**
                     Mafios#1972
                     brandino#1300
                     Lx
                     
                     [Twitter](https://twitter.com/amongooc) | [Discord](https://discord.gg/amongooc)`)
    .setTimestamp()
    .setFooter('Among Bot', 'https://media.discordapp.net/attachments/757840599796809750/758612003106455582/astro.png');
    
    message.channel.send(embed);
}
    
    
    
    module.exports.config = {
        name: 'helpbooster',
        aliases: ["helpb", "ajudab"],
        description: 'Mostra o menu de ajuda de comandos booster do BOT',
        staff: false,
        changelog: 'Comando criado para listar todos os comandos de boosters'
    }
