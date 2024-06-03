//Gabi - desarrollo
const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const FlowEnd = require("../end/FlowEnd");

const FlowMoto = addKeyword(EVENTS.ACTION)
  .addAnswer([
    "Perfecto! Para ofrecerte una cotización adecuada para tu moto, bríndame los siguientes datos:",
  ])
  .addAnswer(["¿Cuál es la *marca* de la moto?"])
  .addAction(
    { capture: true },
    async (ctx, { state, fallBack, flowDynamic }) => {
      try {
        const marcaMoto = ctx.body.toString();

        await state.update({ marcaMoto: marcaMoto });

        const myState = await state.getMyState();

        await flowDynamic([
          {
            body: `¿Cuál es el *modelo* de la moto ${marcaMoto}?`,
          },
        ]);
        return;
      } catch (error) {
        // Envia un mensaje de error por el body y por consola.
        console.log("Error en el flujo FlowMoto", error);
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
        const modeloMoto = ctx.body.toString();

        await state.update({ modeloMoto: modeloMoto });

        const myState = await state.getMyState();
        const marcaMoto = myState.marcaMoto;

        await flowDynamic([
          {
            body: `¿Cuál es la *cilindrada* de la moto ${marcaMoto}?`,
          },
        ]);
        return;
      } catch (error) {
        // Envia un mensaje de error por el body y por consola.
        console.log("Error en el flujo FlowMoto", error);
        await flowDynamic([
          { body: "Ocurrio un error, por favor intentalo de nuevo" },
        ]);
        return fallBack();
      }
    }
  )
  .addAction(
    { capture: true },
    async (ctx, { state, fallBack, gotoFlow, flowDynamic }) => {
      try {
        const cilindrada = ctx.body.toString();

        await state.update({ cilindrada: cilindrada });

        const myState = await state.getMyState();
        const marcaMoto = myState.marcaMoto;
        const modeloMoto = myState.modeloMoto;

        await flowDynamic([
          {
            body: `¿Cuál es el *año* de la moto ${marcaMoto}?`,
          },
        ]);
        return;
      } catch (error) {
        // Envia un mensaje de error por el body y por consola.
        console.log("Error en el flujo FlowMoto", error);
        await flowDynamic([
          { body: "Ocurrio un error, por favor intentalo de nuevo" },
        ]);
        return fallBack();
      }
    }
  )
  .addAction(
    { capture: true },
    async (ctx, { state, fallBack, gotoFlow, flowDynamic }) => {
      try {
        const añoMoto = ctx.body.toString();

        await state.update({ añoMoto: añoMoto });

        const myState = await state.getMyState();
        const marcaMoto = myState.marcaMoto;
        const modeloMoto = myState.modeloMoto;
        const cilindrada = myState.cilindrada;

        await flowDynamic([
          {
            body: `¿Cuál es tu *código postal*?`,
          },
        ]);
        return;
      } catch (error) {
        // Envia un mensaje de error por el body y por consola.
        console.log("Error en el flujo FlowMoto", error);
        await flowDynamic([
          { body: "Ocurrio un error, por favor intentalo de nuevo" },
        ]);
        return fallBack();
      }
    }
  )

  .addAction(
    { capture: true },
    async (ctx, { state, fallBack, gotoFlow, flowDynamic }) => {
      try {
        const codigoPostal = ctx.body.toString();

        await state.update({ codigoPostal: codigoPostal });

        const myState = await state.getMyState();
        const marcaMoto = myState.marcaMoto;
        const modeloMoto = myState.modeloMoto;
        const cilindrada = myState.cilindrada;
        const añoMoto = myState.añoMoto;

        await flowDynamic([
          {
            body: `Gracias por todas tus respuestas, analizaremos cada una de ella y en el caso de poder ofrecerte algo mucho mejor nos volveremos a contatar...`,
          },
        ]);

        await flowDynamic([
          {
            body: `*Marca:* ${marcaMoto}\n*Modelo:* ${modeloMoto}\n*Cilindrada:* ${cilindrada}\n*Año:* ${añoMoto}\n*Código postal:* ${codigoPostal}\n\nPara *volver al menú* escriba 0\n\n_Si deseas finalizar coloca "chau o adíos"_`,
          },
        ]);
      } catch (error) {
        // Envia un mensaje de error por el body y por consola.
        console.log("Error en el flujo FlowMoto", error);
        await flowDynamic([
          { body: "Ocurrio un error, por favor intentalo de nuevo" },
        ]);
        return fallBack();
      }
    }
  )
  .addAction(
    { capture: true },
    async (ctx, { state, fallBack, gotoFlow, flowDynamic }) => {
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

        return;
      } catch (error) {
        // Envia un mensaje de error por el body y por consola.
        console.log("Error en el flujo FlowMoto", error);
        await flowDynamic([
          { body: "Ocurrio un error, por favor intentalo de nuevo" },
        ]);
        return fallBack();
      }
    }
  );

module.exports = FlowMoto;
