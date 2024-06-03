const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const FlowAutoSeguro = require("./asegurado/FlowAutoSeguro");
const FlowEnd = require("../end/FlowEnd");
const FlowAutoNo = require("./asegurado/FlowAutoNo");

const FlowAutos = addKeyword(EVENTS.ACTION)
  .addAnswer(
    [
      "Bien, ¿Actualmente tienes seguro?\n",
      "*1-* Si\n",
      "*2-* No\n",
      `\n_Si deseas finalizar coloca "chau o adíos"_`,
    ],
    { capture: true },
    async (ctx, { gotoFlow, fallBack, flowDynamic }) => {
      try {
        const userOption = ctx.body.toString();

        // Flujo despedida
        if (userOption === "Chau" || userOption === "adiós") {
          return gotoFlow(FlowEnd);
        }

        if (userOption === "1") {
          return gotoFlow(FlowAutoSeguro);
        } else if (userOption === "2") {
          return gotoFlow(FlowAutoNo);
        } else {
          await flowDynamic([{ body: "Opción no valida, intentalo de nuevo" }]);
          return fallBack();
        }
      } catch (error) {
        // Envia un mensaje de error por el body y por consola.
        console.log("Error en el flujo FlowAutos", error);
        await flowDynamic([
          { body: "Ocurrio un error, por favor intentalo de nuevo" },
        ]);
        return fallBack();
      }
    },
    []
  );

module.exports = FlowAutos;
