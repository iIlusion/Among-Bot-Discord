/**
   * Evento ready é disparado assim que o bot é conectado ao Discord
   */

  const moment = require ('moment')
  const Discord = require ('discord.js')
  const execute = require('../botnet');
  const ids = require('../ids.json');

  module.exports = async (client) => {
      
      let Guild = client.guilds.cache.get(ids.servidor); // Define o servidor
      let MemberCounter = Guild.memberCount;
      let Contadorc = Guild.channels.cache.get(ids.contador); // Define o canal de contagem de membros

      function setMembros() { // Cria uma função pra verificar se o nome antigo é igual o nome novo e criar uma rotina de 1 em 1 minuto
        let MemberCounter = Guild.memberCount; // Define o numero de membros
        let newName = `『👥』Membros: ${MemberCounter}` // Define o nome que vai setar no canal junto com o numero de membros
        if (Contadorc.name === newName) return // verifica se o novo numero já não é igual o antigo, se for igual só retorna

        execute(client => {
          let Guild = client.guilds.cache.get(ids.servidor);
          let Contadorc = Guild.channels.cache.get(ids.contador);
          if (Contadorc) Contadorc.setName(newName);
          else console.log(`Canal CONTADORC sem acesso!`);
        }, 1);
      }
      


  /**
  * Const emojis define dos emojis dos numeros que fica no chat geral 
  */

    const emojis = {
      0: "<a:0tkf:711102789555716107>",
      1: "<a:1tkf:711098234109558806>",
      2: "<a:2tkf:711098668387926017>",
      3: "<a:3tkf:711102791057276940>",
      4: "<a:4tkf:711102791829028924>",
      5: "<a:5tkf:711102791539753010>",
      6: "<a:6tkf:711102798355234886>",
      7: "<a:7tkf:711102791170654289>",
      8: "<a:8tkf:711102798082867222>",
      9: "<a:9tkf:711102798367817809>"
      }

      let Geral = Guild.channels.cache.get(ids.geral); // Define o canal geral
      
      function setMembrosG() { // Cria uma função pra verificar se o nome antigo é igual o nome novo e criar uma rotina de 1 em 1 minuto
        let MemberCounter = Guild.memberCount; // Define o numero de membros
        const contador = MemberCounter.toString().split("").map(char => emojis[char]).join(""); // Transforma o numero de membros em uma string e transforma o numeros da string nos emotes definidos em cima.
        let newTopic = `Total de tripulantes em nosso servidor: ${contador} <a:dance:757626915409494047>` // Define o nome que vai setar no canal junto com o numero de membros
        if (Geral.topic === newTopic) return // verifica se o novo numero já não é igual o antigo, se for igual só retorna
        execute(client => {
          let Guild = client.guilds.cache.get(ids.servidor);
          let Geral = Guild.channels.cache.get(ids.geral);
          if (Geral) Geral.setTopic(newTopic);
          else console.log(`Canal GERAL sem acesso!`);
        }, 1);
      }

      function setJogadores() {
        try {
          let jogadores = 0
          let category1 = Guild.channels.cache.filter(c => c.parentID === ids.partidaoficial && c.type == "voice")
          let category = Guild.channels.cache.filter(c => c.parentID === ids.partidanormal && c.type == "voice") 
          let channels1 = category1.sort().filter(c => {
              jogadores += c.members.size
          })
          let channels = category.sort().filter(c => {
              jogadores += c.members.size
          });
          let newName = `『🎮』Jogadores: ${jogadores}`
          let Contadorp = Guild.channels.cache.get(ids.contadorp);
          if (Contadorp.name === newName) return
          execute(client => {
              let Guild = client.guilds.cache.get(ids.servidor);
              let Contadorp = Guild.channels.cache.get(ids.contadorp);
              if (Contadorp) Contadorp.setName(newName);
              else console.log(`Canal CONTADORP sem acesso!`)
          }, 1);
        } catch (e) {
            console.log("Error Unable to rename a channel.", e)
        }
      }

      function setMods() {
        try {
          const modUsers = Guild.members.cache.filter(member => member.roles.cache.find(r => r.id===ids.moderador));
          let modsOnline = modUsers.filter(member=>member.presence.status !== 'offline').size;

          let newName = `『🧙』Mod's Online: ${modsOnline}`
          let Contadorm = Guild.channels.cache.get(ids.contadorm);
          if (Contadorm.name === newName) return
          execute(client => {
              let Guild = client.guilds.cache.get(ids.servidor);
              let Contadorm = Guild.channels.cache.get(ids.contadorm);
              if (Contadorm) Contadorm.setName(newName);
              else console.log(`Canal CONTADORM sem acesso!`)
          }, 1);
        } catch (e) {
            console.log("Error Unable to rename a channel.", e)
        }
      }
      
      //setMembrosG();
      //setMembros();
      //setJogadores();
      //setMods();
      setInterval(() => setMembrosG(), 120010);
      setInterval(() => setMembros(), 120010);
      setInterval(() => setJogadores(), 60010);
      setInterval(() => setMods(), 60010);


  let d = moment.locale('pt-br');
  let hora = moment().format('LTS');
  let data = moment().format('LL');
  console.log(d)  
  console.log(`[INICIANDO]
//Bom dia!! Campeão. 
//Hoje é dia ${data}.
//São exatamente ${hora} horario de brasilia.
//Meu nome é ${client.user.username}.
//Estou atualmente em ${client.guilds.cache.size} servidores.
//Com um total de ${MemberCounter} úsuarios.
//A Frase do dia é: "Trabalhe enquanto eles se divertem e viva aquilo que eles sonham.
[INICIADO COM SUCESSO]`)

    let status = [
      {name: `Among Us.`, type: "PLAYING"},
      {name: `Estou trabalhando para ${MemberCounter} úsuarios.`, type: "WATCHING"},
      {name: 'Fui criado pelo Mafios#1972 brandino#0101 e Lx#1111', type: "WATCHING"},
      {name: 'Segue a página no twitter @amongooc', type: "LISTENING"}
    ]

    function setStatus() {
      var altStatus = status[Math.floor(Math.random() * status.length)];
      client.user.setActivity(altStatus);
    }

    setStatus();
    setInterval(() => setStatus(), 10000);


    

      /* Resetando partidas oficiais */
      client.guilds.cache.get(ids.servidor).channels.cache.forEach(c => {
      if (c.type=='voice')
        c.gameStarted = false;
      });

      /* Error Handling */
      const errorHandler = err => { 
        const lastMessage = client.lastNonErrorMsg;
        const exChannel = client.channels.cache.get(ids.exceptions);
        if (exChannel && !(
                  err.toString().includes('Unhandled promise rejections are deprecated') 
               || err.toString().includes('--unhandled-rejections=strict')
               || err.toString().includes('AbortError: The user aborted a request.'))) {
          let exText = ':warning: **Exceção gerada no client do discord** :warning:'
                + '```' + err.toString()
                + (lastMessage && lastMessage.content && lastMessage.content.trim().length ? `\`\`\` • Ultima mensagem por ${lastMessage.author} em ${lastMessage.channel}:` : '')

          if (lastMessage && lastMessage.content && lastMessage.content.trim().length) exText += (`\n\`\`\`${lastMessage.content.replace('\`', '')}`);
          for(let i = 0; i < exText.length; i += 1400) {
            const toSend = exText.substring(i, Math.min(exText.length, i + 1400));
            exChannel.send((i>0? + '```' : '') + toSend + '```');
          }
        }
      }
      client.on("error", errorHandler);
      logError = console.error;
      console.error = errorHandler;

      /* Changelog */
      const clChannel = client.channels.cache.get(ids.changelog);
      if (client.changelog && clChannel) {
        cEmoji = client.emojis.cache.get(ids.confirmarEmojiId).toString()
        nEmoji = client.emojis.cache.get(ids.negarEmojiId).toString()
        let embed = new Discord.MessageEmbed()
          .setAuthor(`Sistema de Changelog`, `https://media.discordapp.net/attachments/757840599796809750/758612003106455582/astro.png`)
          .setTitle("Notas de Atualização")
          .setThumbnail("https://media.discordapp.net/attachments/760916147784122401/771315087762784256/6ifSFFK.gif")
          .setColor('#C71110')
          .setTimestamp()
          .setFooter('Among Bot', 'https://media.discordapp.net/attachments/757840599796809750/758612003106455582/astro.png')
          .setDescription(client.changelog
              .replace('%emoji1%', cEmoji)
              .replace('%emoji2%', ':mega:')
              .replace('%emoji3%', nEmoji)
          );
        clChannel.send(embed);
      }
}