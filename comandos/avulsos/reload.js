module.exports.run = async (client, message, args, config, Discord) => {
    if(!args || args.length < 2) return message.reply("Uso: `m!reload <tipo> <comando> [configName]` ou `m!reload <tipo> <comando> novo`\n"
                                                    + "Exemplo de comandos:\n `m!reload avulsos teste`\n `m!reload Basicos perfil profile`\n `m!reload moderacao banall novo`");
    const tipo = args[0];
    const commandName = args[1];
    // Check if the command exists and is valid
    if(args[2]!=='novo' && !client.commands.has(args[2] ? args[2] : commandName)) {
      return message.reply("Este comando não existe. Para adicionar um novo, digite: `m!reload <tipo> <comando> novo`.\n"
                         + "Exemplo de comandos:\n `m!reload avulsos teste`\n `m!reload Basicos perfil profile`\n `m!reload moderacao banall novo`");
    }
    // the path is relative to the *current folder*, so just ./filename.js
    delete require.cache[require.resolve(`../${tipo}/${commandName}.js`)];
    // We also need to delete and reload the command from the client.commands Enmap
    if (args[2]!=='novo') client.commands.delete(args[2] ? args[2] : commandName);
    const props = require(`../${tipo}/${commandName}.js`);
    client.commands.set(args[2] && args[2] !== 'novo' ? args[2] : commandName, props);
    message.reply(`O comando ${commandName} foi ${args[2]!=='novo'?'recarregado':'adicionado'}`);
};    
  
module.exports.config = {
    name: 'reload',
    aliases: [],
    changelog: '!',
    staff: true
}