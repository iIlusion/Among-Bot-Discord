const Discord = require("discord.js");

module.exports = async (client, rateLimitInfo) => {
    console.log(`Client -> foi limitado por ${rateLimitInfo.timeout}ms
    Só pode ser feito ${rateLimitInfo.limit} requests para esse evento
    Método: ${rateLimitInfo.method}
    Path: ${rateLimitInfo.path}
    Rota: ${rateLimitInfo.route}
    `)
}