const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const FlowEnd = require("../../end/FlowEnd");

const FlowAutoNo = addKeyword(EVENTS.ACTION)
  .addAnswer(
    [
      "Bien, lo ayudaremos a darle la mejor cotización del mercado\b",
      "Por favor puede brindarme la *marca de su vehículo*: ",
    ],
    { capture: true, delay: 1000 },
    async (ctx, { state, flowDynamic }) => {
      try {
        const brandVehicle = ctx.body.toString();

        await state.update({ brand: brandVehicle });

        await flowDynamic([
          {
            body: `Muchas gracias por su respuesta, podría decirme el *modelo y versión* de su ${brandVehicle}: `,
          },
        ]);
        return;
      } catch (error) {
        // Envia un mensaje de error por el body y por consola.
        console.log("Error en el flujo FlowAutoNo", error);
        await flowDynamic([
          { body: "Ocurrio un error, por favor intentalo de nuevo" },
        ]);
        return fallBack();
      }
    },
    []
  )
  .addAction(
    { capture: true, delay: 1000 },
    async (ctx, { state, flowDynamic }) => {
      try {
        const modelVehicle = ctx.body.toString();

        await state.update({ model: modelVehicle });

        const myState = await state.getMyState();
        const brand = myState.brand;
        const model = myState.model;

        await flowDynamic([
          {
            body: `Genial, ¿De que *año* es su ${brand} ${model}?`,
          },
        ]);
        return;
      } catch (error) {
        // Envia un mensaje de error por el body y por consola.
        console.log("Error en el flujo FlowAutoNo", error);
        await flowDynamic([
          { body: "Ocurrio un error, por favor intentalo de nuevo" },
        ]);
        return fallBack();
      }
    }
  )
  .addAction(
    { capture: true, delay: 1000 },
    async (ctx, { state, flowDynamic }) => {
      try {
        const ageVehicle = ctx.body.toString();

        await state.update({ ageVehicle: ageVehicle });

        const myState = await state.getMyState();
        const brand = myState.brand;
        const model = myState.model;

        await flowDynamic([
          {
            body: `¿Cuenta con *GNC*?\n*1-* SI\n*2-* NO`,
          },
        ]);
        return;
      } catch (error) {
        // Envia un mensaje de error por el body y por consola.
        console.log("Error en el flujo FlowAutoNo", error);
        await flowDynamic([
          { body: "Ocurrio un error, por favor intentalo de nuevo" },
        ]);
        return fallBack();
      }
    }
  )
  .addAction(
    { capture: true, delay: 1000 },
    async (ctx, { state, fallBack, flowDynamic }) => {
      try {
        const optionUser = ctx.body.toString();

        if (optionUser === "1" || optionUser.toLowerCase() === "si") {
          const gncVehicle = "con GNC";
          await state.update({ gncVehicle: gncVehicle });
        } else if (optionUser === "2" || optionUser.toLowerCase() === "no") {
          const gncVehicle = "sin GNC";
          await state.update({ gncVehicle: gncVehicle });
        } else {
          await flowDynamic([{ body: "Por favor ingresa una opción válida" }]);
          return fallBack();
        }

        await flowDynamic([
          {
            body: `Para finalizar puedes enviarme tu *codigo postal*: `,
          },
        ]);
        return;
      } catch (error) {
        // Envia un mensaje de error por el body y por consola.
        console.log("Error en el flujo FlowAutoNo", error);
        await flowDynamic([
          { body: "Ocurrio un error, por favor intentalo de nuevo" },
        ]);
        return fallBack();
      }
    }
  )
  .addAction({ capture: true }, async (ctx, { state, flowDynamic }) => {
    try {
      const responseCompany = ctx.body.toString();

      await state.update({ responseCompany: responseCompany });

      const myState = await state.getMyState();
      const brand = myState.brand;
      const model = myState.model;
      const age = myState.ageVehicle;
      const gnc = myState.gncVehicle;

      await flowDynamic([
        {
          body: `Gracias por todas tus respuestas, analizaremos cada una de ellas. Nos esmeraremos en asesorarlo y darle una cotización adecuada a sus necesidades`,
        },
      ]);

      await flowDynamic([
        {
          body: `Buscando la mejor cotización para *${brand} ${model} ${age} ${gnc}*...\n\nPara *volver al menú* escriba 0\n\n _Si deseas finalizar coloca "chau o adíos"_`,
        },
      ]);
    } catch (error) {
      // Envia un mensaje de error por el body y por consola.
      console.log("Error en el flujo FlowAutoNo", error);
      await flowDynamic([
        { body: "Ocurrio un error, por favor intentalo de nuevo" },
      ]);
      return fallBack();
    }
  })
  .addAction({ capture: true }, async (ctx, { gotoFlow, flowDynamic }) => {
    try {
      // Flujo despedida
      if (
        ctx.body.toString().toLowerCase() === "chau" ||
        ctx.body.toString().toLowerCase() === "adiós"
      ) {
        return gotoFlow(FlowEnd);
      } else if (ctx.body.toString().toLowerCase() === "0") {
        return gotoFlow(require("../../FlowMenu"));
      }
      else {
        await flowDynamic([{ body: "Opción no valida, intentalo de nuevo" }]);
        return fallBack();
      }

      return;
    } catch (error) {
      // Envia un mensaje de error por el body y por consola.
      console.log("Error en el flujo FlowAutoNo", error);
      await flowDynamic([
        { body: "Ocurrio un error, por favor intentalo de nuevo" },
      ]);
      return fallBack();
    }
  });

module.exports = FlowAutoNo;
