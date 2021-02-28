const ProfileController = require('../../controllers/profile-controller.js');
const Global = require('../../classes/Global');
const execute = require('../../botnet')

const UtilsClass = (client, message, args, config, Discord, ids) => {
    return {
        guild: message.guild,
        channel: id => client.channels.cache.get(id),
        member: async id => {
            let member = message.guild.members.cache.get(id);
            if (member) return member;
            try         { return await message.guild.members.fetch(id); } 
            catch (err) { return undefined; }
        }
    };
}

module.exports.run = async function (client, message, args, config, Discord, ids) {
    if (message.member.hasPermission("ADMINISTRATOR")) {
        if (message.channel.id!==ids.devsOnly) return message.reply(`Utilize este comando apenas no canal <#${ids.devsOnly}>`, msg=>msg.delete({timeout: 5000}))
        toEval = message.content.substr(6);
        if (toEval.endsWith("```")) toEval = toEval.replace(/```[^ \n]*([\s\S]+)```/gm, `$1`)
        if (!toEval) return message.reply("Uso: `m!eval <codigo js>`. Este comando sera executado no escopo:\n```js\nmodule.exports.run = async function (client, message, args, config, Discord, ids) {\n    > aqui\n}```");
        
        const Utils = UtilsClass(client, message, args, config, Discord, ids);
        try {
            await eval(`(async()=>{${toEval}})();`)
        } catch (e) {
            message.reply(`Catch: \`${e.message}\``);
        }


        message.react(`✅`)
	} else return message.reply("Comando apenas para administradores.", msg=>msg.delete({timeout: 5000}))
}

module.exports.config = {
    name: 'eval',
	aliases: [],
	staff: true,
	changelog: '!'
}