const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");

const FlowIntegralComerce = addKeyword(EVENTS.ACTION)
  .addAnswer(
    ["Bien, puedes decirme ¿Que *tipo de comercio* es?"],
    { capture: true },
    async (ctx, { state, flowDynamic }) => {
      try {
        const comerceUser = ctx.body.toString();
        await state.update({ comerce: comerceUser });

        await flowDynamic([
          {
            body: "Gracias por tu respuesta, ¿Puedes decirme que *superficie aproximada* tiene tu comercio?",
          },
        ]);
        return;

      } catch (error) {
        // Envia un mensaje de error por el body y por consola.
        console.log("Error en el flujo FlowIntegral", error);
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
        const superficieComercio = ctx.body.toString();
        await state.update({ superficie: superficieComercio });

        await flowDynamic([
          {
            body: "Gracias por tu respuesta, ¿Cual es el *codigo postal* donde se encuentra tu comercio?",
          },
        ]);
        return;
      } catch (error) {
        // Envia un mensaje de error por el body y por consola.
        console.log("Error en el flujo FlowIntegral", error);
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
        const codigoPostal = ctx.body.toString();
        await state.update({ codigo: codigoPostal });

        await flowDynamic([
          {
            body: "Gracias por tu respuesta, Me gusaría saber que es lo *que desea que cubra el seguro*\n*1- Plan Basico:* Responsabilidad civil, Incendio.\n*2- Plan Premium*: Responsabilidad civil, Incendio, Robo, Cristales, Equipos electronicos",
          },
        ]);
        return;
      } catch (error) {
        // Envia un mensaje de error por el body y por consola.
        console.log("Error en el flujo FlowIntegral", error);
        await flowDynamic([
          { body: "Ocurrio un error, por favor intentalo de nuevo" },
        ]);
        return fallBack();
      }
    }
  )

  .addAction(
    { capture: true, delay: 1000 },
    async (ctx, { state, flowDynamic, fallBack }) => {
      try {
        const cubrimiento = ctx.body.toString();

        if (cubrimiento === "1") {
          const plan = "Plan Basico";
          await state.update({ plan: plan });
          await flowDynamic([
            { body: "Gracias por tu respuesta, seleccionaste el plan básico." },
          ]);
          return;
        } else if (cubrimiento === "2") {
          const plan = "Plan Premium";
          await state.update({ plan: plan });
          await flowDynamic([
            { body: "Gracias por tu respuesta, seleccionaste el plan premium." },
          ]);
          return;
        } else {
          await flowDynamic([{ body: "Por favor ingresa una opción válida" }]);
          return fallBack();
        }
      } catch (error) {
        // Envia un mensaje de error por el body y por consola.
        console.log("Error en el flujo FlowIntegral", error);
        await flowDynamic([
          { body: "Ocurrio un error, por favor intentalo de nuevo" },
        ]);
        return fallBack();
      }
    }
  )

  .addAction(
    { capture: false, delay: 1000 },
    async (_, { state, flowDynamic }) => {
      try {
        const myState = await state.getMyState();
        const name = myState.name;
        const comerce = myState.comerce;
        const superficie = myState.superficie;
        const codigo = myState.codigo;
        const plan = myState.plan;

        await flowDynamic([
          {
            body: `Genial ${name}, un profesional de la compañía se contactará con usted.\nNos esmeraremos en asesorarlo y darle una cotización adecuada a sus necesidades.`,
          },
        ]);

        await flowDynamic([
          {
            body: `*Buscando el mejor ${plan} para comercio de ${comerce}, con superficie de ${superficie}, ubicado en la zona con CP ${codigo}*\n\nPara *volver al menú* escriba 0\n\n_Para finalizar coloca "chau o "adios"._`,
          },
        ]);
      } catch (error) {
        // Envia un mensaje de error por el body y por consola.
        console.log("Error en el flujo FlowIntegral", error);
        await flowDynamic([
          { body: "Ocurrio un error, por favor intentalo de nuevo" },
        ]);
        return fallBack();
      }
    }
  )

  .addAction({ capture: true }, async (ctx, { gotoFlow, flowDynamic, fallBack }) => {
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

      return;
    } catch (error) {
      // Envia un mensaje de error por el body y por consola.
      console.log("Error en el flujo FlowIntegral", error);
      await flowDynamic([
        { body: "Ocurrio un error, por favor intentalo de nuevo" },
      ]);
      return fallBack();
    }
  });

module.exports = FlowIntegralComerce;
