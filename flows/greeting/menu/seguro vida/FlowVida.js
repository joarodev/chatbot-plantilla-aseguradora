// gabi - proceso

const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");

const FLowMain = addKeyword(EVENTS.ACTION)
  .addAnswer([
    "Perfecto! Para ofrecerte una cotización adecuada para algo tan importante como tu Seguro de Vida o Retiro, bríndame los siguientes datos:",
  ])
  .addAnswer(["¿Cuál es tu *año de nacimiento*? (día/mes/año)"])
  .addAction(
    { capture: true },
    async (ctx, { state, fallBack, flowDynamic }) => {
      try {
        const añoNacimiento = ctx.body.toString();

        await state.update({ añoNacimiento: añoNacimiento });

        const myState = await state.getMyState();

        await flowDynamic([
          {
            body: `¿Cuál es tu *ocupación*?`,
          },
        ]);
        return;
      } catch (error) {
        // Envia un mensaje de error por el body y por consola.
        console.log("Error en el flujo FlowVida", error);
        await flowDynamic([
          { body: "Ocurrio un error, por favor intentalo de nuevo" },
        ]);
        return fallBack();
      }
    }
  )
  .addAction(
    { capture: true },
    async (ctx, { state, fallBack, flowDynamic }) => {
      try {
        const ocupacion = ctx.body.toString();

        await state.update({ ocupacion: ocupacion });

        const myState = await state.getMyState();


        await flowDynamic([
          {
            body: `¿Cuál es tu *código postal*?`,
          },
        ]);
        return;
      } catch (error) {
        // Envia un mensaje de error por el body y por consola.
        console.log("Error en el flujo FlowVida", error);
        await flowDynamic([
          { body: "Ocurrio un error, por favor intentalo de nuevo" },
        ]);
        return fallBack();
      }
    }
  )

  .addAction(
    { capture: true },
    async (ctx, { state, fallBack, flowDynamic }) => {
      try {
        const codigoPostal = ctx.body.toString();

        await state.update({ codigoPostal: codigoPostal });

        const myState = await state.getMyState();
        const añoNacimiento = myState.añoNacimiento;
        const ocupacion = myState.ocupacion;

        await flowDynamic([
          {
            body: `Gracias por todas tus respuestas, analizaremos cada una de ella y en el caso de poder ofrecerte algo mucho mejor nos volveremos a contactar...`,
          },
        ]);

        await flowDynamic([
          {
            body: `*Año de nacimiento:* ${añoNacimiento}\n*Ocupación:* ${ocupacion}\n*Código postal:* ${codigoPostal}\n\nPara volver al menú escriba 0\n\n_Si deseas finalizar coloca "chau o adíos"_`,
          },
        ]);
      } catch (error) {
        // Envia un mensaje de error por el body y por consola.
        console.log("Error en el flujo FlowVida", error);
        await flowDynamic([
          { body: "Ocurrio un error, por favor intentalo de nuevo" },
        ]);
        return fallBack();
      }
    }
  )
  .addAction({ capture: true }, async (ctx, { gotoFlow, flowDynamic }) => {
    try {
      // Flujo despedida
      if (
        ctx.body.toString().toLowerCase() === "chau" ||
        ctx.body.toString().toLowerCase() === "adiós"
      ) {
        await flowDynamic([{ body: "Gracias por tu tiempo, hasta luego!" }]);
        return gotoFlow(FlowEnd);
      } else if (ctx.body.toString().toLowerCase() === "0") {
        return gotoFlow(require("../FlowMenu"));
      }
      else {
        await flowDynamic([{ body: "Opción no valida, intentalo de nuevo" }]);
        return fallBack();
      }
      
    } catch (error) {
      // Envia un mensaje de error por el body y por consola.
      console.log("Error en el flujo FlowVida", error);
      await flowDynamic([
        { body: "Ocurrio un error, por favor intentalo de nuevo" },
      ]);
      return fallBack();
    }
  });

module.exports = FLowMain;
