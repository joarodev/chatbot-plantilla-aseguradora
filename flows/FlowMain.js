const { addKeyword } = require("@bot-whatsapp/bot");
const FlowEnd = require("./greeting/menu/end/FlowEnd");

const FLowMain = addKeyword("Main", "main", { sensitive: true })
  .addAnswer(
    [
      "*¡Hola! Somos asesores de seguros.*\nEntendemos los desafíos actuales con los aumentos de costos y la necesidad de mantener servicios. \n*¡Queremos ayudarte a vivir tranquilo!*\nCuéntanos qué servicio necesitas cotizar o recotizar para reducir costos y te proporcionaremos una solución adecuada a tus necesidades.",
    ],
    { capture: false },
    async (ctx, {}) => {},
    []
  )
  .addAction({ capture: false }, async (ctx, { flowDynamic }) => {
    await flowDynamic([
      {
        body: "*Entendemos que tu tiempo es valioso y tal vez no te interese dicha información. Elige la opción que refleje mejor tu postura:*\n\n*A_* _Estas ocupado y te gustaría que te contacten en otro momento?_\n*B_* _No soy el decisor, pero sé a quién le puede ayudar._\n*C_* _No me interesa comparar servicios y precios con otras empresas._",
      },
    ]);
  })
  .addAction(
    { capture: true },
    async (ctx, { gotoFlow, flowDynamic, fallBack }) => {
      // transformamos la respuesta en minusculas
      const selectOption = ctx.body.toString().toLowerCase();

      // comparamos la respuesta con las opciones y enviamos un mensaje personalizado al usuario.
      if (selectOption === "a") {
        await flowDynamic([
          { body: "Te contactaremos en otro momento. Gracias por tu tiempo." },
        ]);
      } else if (selectOption === "b") {
        await flowDynamic([
          {
            body: "Te contactaremos en otro momento para saber a quien podremos ayudar",
          },
        ]);
      } else if (selectOption === "c") {
        await flowDynamic([
          { body: "Entendemos tu decisión, muchas gracias por tu tiempo" },
        ]);
        return gotoFlow(FlowEnd);
      } else {
        await flowDynamic([
          { body: "Opción inválida, por favor intenta de nuevo" },
        ]);
        return fallBack();
      }

      return;
    }
  );
module.exports = FLowMain;
