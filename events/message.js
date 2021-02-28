/**
    
        "Sistema de Loja - Tempo em partida será recompensado com **gold** para ser gasto na loja",
        "Sistema de EXP - Tempo em calls agora serão recompensados com **xp**"
    
        "Comando `m!profile` - Agora é possivel utilizar itens do jogo (`m!profile use <Nº>`, `m!profile use clear`)",
        "Sistema de EXP - A formula de xp foi alterada"
    
        "Sistema de EXP - Todos os níveis foram **resetados**, quem estava presente antes do update receberá `15 * (Nivel^1.5)` de gold"
    
 * O Evento message é emitido toda vez que o bot recebe uma mensagem.
 */

const Discord = require('discord.js'); // Puxamos a biblioteca do Discord.JS
const moment = require('moment') // Puxamos a biblioteca que nos informa o tempo
const config = require('../config.json');
const ids = require('../ids.json');
const ProfileController = require('../controllers/profile-controller.js');

// Filtrar "TEM VAGA?"
rgx1 = /^([Ss][Aa][Ll][Aa] *)?(?:[A-Z]{5}[QJF])(?: *[Nn][Oo][Rr][Tt][Hh].*)?$|^(?:[A-Z]{5}[QJF]).*$/m;
rgx2 = /^venham$|^(?:[^ \n]* )?vag(?:a|uinha)s?(?: [^ \n]*)? *\??$|^(?=.*(?:vaga|algu[eéÉ][mn]|algum|t[aãÃ]o|gente).*)(?=.*(?:jogan?do(?:.{0,4}\??$|.*among)|^among|sala|call|partida|nave).*).*|^(?=.*(?:vaga|sala|call(?! [123](?:[^\d]|$))|partida|nave|to na).*\d).*$|^(?=.*\d.*(?:vaga|partida|nave).*).*$|^(?=.*(?:que|ond|qual|cad[eêÊ]|gente|algum).*)(?=.*(?:server|vaga|sala|call|partida|nave).*)(?:[^ \n]* ?){5}$|^.*(?:quem|algu[eéÉm][nma]|posso|alg |b(?:ora|ó)|vamo).*(?:(?:mapa |on\??$|jogar?|play)(?:(?:.comigo)?.{0,4}\??$|.*among)|among).*\??$/mi;
const checkFilter = message => {
  // return !message.content.startsWith('>') && message.content.length < 130 && (rgx1.test(message.content) || rgx2.test(message.content));
  return !message.content.startsWith('>') && rgx1.test(message.content);
}

// Filtrar "vem sala x tem mulher"
rgx3 = /\b(mulher(es)?|e-?girl|nude|deusa|solteira|casada|cocota|puta|gostosa|pelada|gata|gatinha|menina|sensuais|foto|gostoso|mui[eé])s?\b/i
const checkFilter2 = message => {
  return (rgx3.test(message.content));
}

// Filtrar "m!report"
const checkReportFilter = message => {
  return /^>msg|^m!(report|reportt|clear)( |$)/i.test(message.content)
}
// Filtar "m!salas e m!divulgar"
//const checkProcurandoFilter = message => {
//  return /^>msg|^m!(divulgar|salas|clear)( |$)/i.test(message.content)
//}


// Anti spam
//const lastMessages = {}

//const checkSpam = userId => {
  //const lastUserMessages = lastMessages[userId];

  //if (lastUserMessages.length < 3) return false; // se tiver menos que 3 mensagens retorna

  //const firstMessage = lastUserMessages[0]; // pega a primeira mensagem enviada
  //const lastMessage = lastUserMessages[lastUserMessages.length - 1]; // pega a ultima mensagem enviada 

  //if (lastMessage.timestamp - firstMessage.timestamp > 1100) { // calcula o timestamp de diferença entre as duas, se a diferença for maior que 1,1 segundo então não é considerado spam
    //lastMessages[userId] = []; // limpa as últimas mensagens 
    //return false;
  //}
  //return true; // se não retornar nenhuma vez em nenhuma das verificações, então é considerado spam (3 ou mais mensagens em menos de 1 segundo de diferença)
//}

// Sistema XP
const giveXp = (client, member) => {
  ProfileController.give(client, member);
}

module.exports = async (client, message) => {    
  let deleted = false;
  client.lastNonErrorMsg = message; // Error Handler
  const author = message.author;

  if (author.bot) return;

  //if (!lastMessages[author.id]) lastMessages[author.id] = [];

  //lastMessages[author.id].push({ timestamp: +new Date(), message: message }); // adiciona a mensagem nas ultimas mensagens do usuario

  //if (checkSpam(author.id)) {
    //lastMessages[author.id].forEach(async (lastMessage) => await lastMessage.message.delete({reason: 'Spam'}).catch(()=>{})) // se caso entrar no spam, deleta todas as mensagens
    //lastMessages[author.id] = []; // limpa o array de mensagens

    //return message.channel.send(`Pare com flood, ${author.username}`);
  //}

  if (checkFilter(message) && ids.chatsGeral.includes(message.channel.id)){
    psid = ids.procurandoSala;
    message.reply("Por favor, procure e/ou divulgue salas de jogos no chat <#"+psid+">!").then(msg=>{ msg.delete({timeout: 10000}); });
    deleted ? 0 : message.delete({reason: 'Divulgando sala no chat errado'}) & (deleted=1);
  }

  if (checkFilter2(message) && message.channel.id === ids.procurandoSala){
    message.reply(`Por favor, não procure pessoas para suas salas utlizando frases como "entra tem mulher" ou derivados. `).then(msg=>{ msg.delete({timeout: 10000}); });
    deleted ? 0 : message.delete({reason: 'Divulgando sala no chat errado'}) & (deleted=1);
  }

  if (ids.reportar==message.channel.id && !checkReportFilter(message)){
    message.reply("Este canal apenas permite mensagens que iniciam-se em m!report.").then(msg=>{ msg.delete({timeout: 10000}); });
    return deleted ? 0 : message.delete() & (deleted=1);
  }

  if (ids.registrar==message.channel.id && (!message.content.startsWith("m!registrar"))){
    message.reply("Este canal apenas permite mensagens que iniciam-se em m!registrar.").then(msg=>{ msg.delete({timeout: 10000}); });
    return deleted ? 0 : message.delete() & (deleted=1);
  }

  //if (ids.procurandoSala==message.channel.id && !checkProcurandoFilter(message)){
  //  message.reply("**Este canal apenas permite que você divulgue ou procure por jogos, para procurar partidas utilize m!salas, para divulgar uma sala utilize m!divulgar.**").then(msg=>{ msg.delete({timeout: 10000}); });
  //  return deleted ? 0 : message.delete({reason: "Mensagem no canal de procurando jogo."}) & (deleted=1);
  //}

  if (message.channel.type != 'dm' && !message.author.bot && ids.xpPorMsg.includes(message.channel.id)) {
    giveXp(client, message.author);
  }

  if ((message.content.startsWith("m!sugerir") || message.content.startsWith("m!sugestao")) && message.channel.id == ids.sugestao) {

  } else if (message.channel.id == ids.sugestao && !ids.devs.includes(message.author.id)) {
    deleted ? 0 : message.delete({timeout:500}) & (deleted=1);
    await author.send('Para fazer uma sugestão utilize o comando `m!sugerir <sugestão>`, ex: m!sugerir Adicionar novos bots para interação.').catch(error => message.reply("Para fazer uma sugestão utilize o comando m!sugerir <Sugestão>, ex: m!sugerir Adicionar novos bots para interação.").then(m => m.delete({timeout:10000})));
    return
  }

  let prefixo = config.prefixo
  if (message.author.bot || !message.content.toLowerCase().startsWith(prefixo) || message.content.toLowerCase() == prefixo || message.channel.type == 'dm') return;

  // Executar comando
  const args = message.content.split(/\s+/g);
  const command = args.shift().slice(prefixo.length);
  const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
  const senderIsModerator = message.member.roles.cache.has(ids.moderador) || message.member.roles.cache.has(ids.moderadorp) || ids.devs.includes(message.author.id);
  
  if (!cmd) return message.react('❓');

  let canExecute = cmd.config && cmd.config.staff ? senderIsModerator : true;

  if (!canExecute) {
      return message.channel.send('Comando apenas pra staff')
  }
  
  canalParaComando = cmd.config && cmd.config.canal ? cmd.config.canal : ids.comandos;
  canExecute = senderIsModerator ? true : (canalParaComando === true ? true : message.channel.id == canalParaComando);

  if (!canExecute) {
    return message.channel.send(`:no_entry_sign: **| Utilize este comando apenas no canal <#${canalParaComando}>.**`).then(msg => {deleted ? 0 : message.delete({reason: 'Comando no canal errado.'}) & (deleted=1); msg.delete({timeout: 5000}) });
  }

  //if ((cmd.config.canal) && message.channel.id != cmd.config.canal) { // comando no canal errado
    //if (!message.member.roles.cache.has(ids.moderador) || !message.member.roles.cache.has(ids.moderador) || !(ids.devs.includes(message.author.id))) { // se o usuario n for staff
      //return message.channel.send(`utilize esse comando em <#${cmd.config.canal}>`);
    //}
  //}

// 
// message.channel.send(':no_entry_sign: **| UTILIZE COMANDOS APENAS NO CHAT <#758250400540786718>**').then(msg => message.delete().then(() => msg.delete({timeout: 5000})));

if ((client.disableCmds === true || 
    (client.disableCmds && 
      (client.disableCmds.includes(cmd.config.name) || client.disableCmds.filter(cmdStr=>cmd.config.aliases&&cmd.config.aliases.includes(cmdStr)).length>0)
    )) 
  && !cmd.config.bypassDisableCmds) 
  return message.reply('Comando temporariamente desativado pelo Administrador.');

  try {
    cmd.run(client, message, args, config, Discord, ids);
  } catch (ex) {
    const exChannel = client.channels.cache.get(ids.exceptions);
    if (exChannel) exChannel.send(`:x: Excessão gerada em <#${message.channel.id}>!
Usuário: ${message.member}
Comando: ${message.content}
Exceção: ${'```' + ex.toString() + '```'}`);
  }
  console.log("[LOG] "+message.author.username+" usou o comando "+ command +" no server "+ message.guild.name);
};