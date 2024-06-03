const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");


const FlowEnd = addKeyword("chau", "adiós", {sensitive: true})
    .addAnswer("Gracias por participar, hasta luego")

module.exports = FlowEnd;