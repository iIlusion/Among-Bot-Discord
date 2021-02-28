let Discord;
let channel;
let emoji;
let author;
let footer;

async function wiki(client, message, args, config, discord) {
	author = "『🤔』 Wiki", footer = "Wiki",
	emojiW = emoji('770338662868451370');
	
	sendEmbed(`•━━━━━   ${emojiW}   Wiki   ${emojiW}   ━━━━━•`, 
			  "Informações aqui, nao sei bem oq vai ser\n" +
			  "entao, colocarei textos aleatórios só pra preencher\n" +
			  "espaço mesmo... e ver como vai ficar tbm, aq\n" +
			  "nn sei se vai ter campos (fields) mas se for ter\n" +
			  "é só deixar igual o Faq mais ou menos",
			  "https://media.discordapp.net/attachments/760916147784122401/773645397041872916/unknown.png",
			  "#bd93f9"
	);
}

async function faq(client, message, args, config, discord) {
	author = "『❓』 Faq", footer = "Faq",
	emojiF = emoji('770333703972192311');

	sendEmbed(`•━━━━━   ${emojiF}   Faq   ${emojiF}   ━━━━━•`, 
			  "Encontre aqui as perguntas e respostas mais frequentes do servidor.",
			  "https://media.discordapp.net/attachments/760916147784122401/773644901437931520/unknown.png",
			  "#bd93f9", 
			  [
				{name: "→ Porque não consigo entrar na call?", 
				value: "Tem q confirma o email e spera 10 minuto"},
				{name: "→ Como ganho cargo?", 
				value: "Subindo de nivel digitnao no xet e por tempo em call"},
			  ]
	);
}


async function regras(client, message, args, config, discord) {
	author  = "『📕』 Regras",        	  footer = "Regras",
	emojiRG = emoji('777276337769152562'), emojiP = emoji('773337790972428318'),
	emojiRP = emoji('777276577066647572'), emojiA = emoji('775297614953840640'),
	emojiCargo1 = emoji('783871943861338133'), emojiCargo2 = emoji('783871943853998091')

	sendEmbed(`•━━━━   ${emojiRG}   Regras  Chat   ${emojiRG}   ━━━━•`, 
			  "• Use o <#788115705802784810> para **conversar** e fazer novas amizades.\n• Use os canais de texto de maneira correta, **cada** canal de texto **tem sua função** especifica.\n• Utilize **comandos** no canal <#788115707514716200>.\n• **Evite** fazer marcações desnecessárias. (marcando muitas vezes um cargo ou pessoa)\n• **Necessita** da ajuda da moderação? Marque um @Moderador(a).\n• Respeite o próximo.\n• Siga as Diretrizes da Comunidade do Discord.",
			  "https://media.discordapp.net/attachments/757840599796809750/773307251557007391/321.png",
			  "#50fa7b"
	);

	sendEmbed(`**•━━━━━   ${emojiP}  Proibidos  ${emojiP}   ━━━━━•**`, 
			  "• Fazer qualquer tipo de divulgação que **não** seja live jogando Among Us **sem antes** falar com Administração.\n• Atrapalhar partidas alheias.\n• Utilizar fakes para se passarem por outra pessoa\n• Divulgar links de **outro** Discord.\n• Enviar links **fora** do canal de <#788115711217369128>\n• Fomentar **brigas** ou começá-las.\n• Fazer **flood** de mensagens/fotos/videos/gifs (enviar uma grande sequencia em pouco tempo).",
			  "https://media.discordapp.net/attachments/757840599796809750/773307203125248031/148.png",
			  "#f1fa8c"
	);

	sendEmbed(`**•━━   ${emojiRP} Rigorosamente Proibidos ${emojiRP}   ━━•**`, 
			  "• Discurso de ódio.\n• Nudez e conteúdo adulto **não** são permitidos no servidor.\n• Racismo, Homofobia, Pedofilia, Xenofobia, Gore, Sexismo, Assédio.\n• Postar fotos de **outros membros** sem autorização\n• FLOOD/SPAM em **qualquer** canal.",
			  "https://media.discordapp.net/attachments/757840599796809750/773307323292450846/92.png",
			  "#ffb86c"
	);

	sendEmbed(`**•━━━━━  ${emojiA} Advertências ${emojiA}  ━━━━━•**`, 
			  "Infrações consideras leves serão punidas com **Avisos**.\n - Caso você receba um número `x` de avisos, você receberá uma punição, segue tabela de punições abaixo:```2 Avisos  = 30 minutos de mute.\n3 Avisos  = 3 horas de mute.\n4 Avisos+ = 1 hora de ban por cada aviso.```",
			  "https://cdn.discordapp.com/attachments/757840599796809750/773322249474277426/2C3M14C.png",
			  "#ff5555"
	);
}

function sendEmbed(title, desc, thumb, color, fields=[]) {         
	let embed = new Discord.MessageEmbed()  
	  .setAuthor(author, "https://cdn.discordapp.com/avatars/694398980016177182/077c4980e3bada4b1ef66d160592041d.png")
	  .setTitle(title)
	  .addFields(fields)
      .setDescription(desc)
      .setThumbnail(thumb)
      .setColor(color)
      .setTimestamp()
      .setFooter(footer + " do Among Us Out Of Context", "https://media.discordapp.net/attachments/757840599796809750/773307174193332224/226.png");  
    channel.send(embed);
}

module.exports.run = async function (client, message, args, config, discord) {
	if (message.member.hasPermission("ADMINISTRATOR")) {
		message.delete(); 
		Discord = discord;
		channel = message.channel;
		emoji   = id => client.emojis.cache.get(id);
		if (args[0]==='regras') regras(client, message, args, config, discord);
		else if (args[0]==='wiki') wiki(client, message, args, config, discord);
		else if (args[0]==='faq') faq(client, message, args, config, discord);
	}
}

module.exports.config = {
    name: 'embed',
	aliases: ["embed"],
	staff: true,
	changelog: '!'
}