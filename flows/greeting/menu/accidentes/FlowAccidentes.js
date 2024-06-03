const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");

const FlowAccidentPersonal = addKeyword(EVENTS.ACTION)
  .addAnswer(
    ["¿Puedes decirme que *tipo de actividad* realizas? "],
    { capture: true, delay: 1000 },
    async (ctx, { flowDynamic, fallBack, state }) => {
      try {
        const activity = ctx.body.toString();

        if (!activity) {
          await flowDynamic([
            { body: `*El mensaje es incorrecto, intentalo de nuevo*` },
          ]);
          return fallBack();
        }

        await state.update({ activity: activity });

        await flowDynamic([
          {
            body: `¿Que *cantidad de personal* tienes a cargo? \n(Coloca un numero)`,
          },
        ]);

        return;

      } catch (error) {
        // Envia un mensaje de error por el body y por consola.
        console.log("Error en el flujo FlowAccidentes", error);
        await flowDynamic([
          { body: "Ocurrio un error, por favor intentalo de nuevo" },
        ]);
        return fallBack();
      }
    }
  )
  .addAction(
    { capture: true, delay: 1000 },
    async (ctx, { flowDynamic, fallBack, state }) => {
      try {
        const personal = ctx.body;

        if (!personal || personal === NaN) {
          await flowDynamic([
            { body: `*El mensaje es incorrecto, intentalo de nuevo*` },
          ]);
          return fallBack();
        }

        await state.update({ personal: personal });

        await flowDynamic([
          {
            body: `Gracias por tu respuesta, ¿Puedes decirme la *cantidad de tiempo* que nesesitas asegurarlo?\n\n*1-* Una semana.\n*2-* Dos semanas.\n*3-* Un mes.\n*4-* Tres meses.\n*5-* Seis meses.\n*6-* Doce meses.`,
          },
        ]);
      } catch (error) {
        // Envia un mensaje de error por el body y por consola.
        console.log("Error en el flujo FlowAccidentes", error);
        await flowDynamic([
          { body: "Ocurrio un error, por favor intentalo de nuevo" },
        ]);
        return fallBack();
      }
    }
  )
  .addAction(
    { capture: true, delay: 1000 },
    async (ctx, { flowDynamic, fallBack, state }) => {
      try {
        const time = ctx.body.toString();

        if (!time) {
          await flowDynamic([
            { body: `*El mensaje es incorrecto, intentalo de nuevo*` },
          ]);
          return fallBack();
        }

        if (time === "1") {
          const timeAsegurado = "Una semana";
          await state.update({ time: timeAsegurado });
        } else if (time === "2") {
          const timeAsegurado = "Dos semanas";
          await state.update({ time: timeAsegurado });
        } else if (time === "3") {
          const timeAsegurado = "1 mes";
          await state.update({ time: timeAsegurado });
        } else if (time === "4") {
          const timeAsegurado = "3 meses";
          await state.update({ time: timeAsegurado });
        } else if (time === "5") {
          const timeAsegurado = "6 meses";
          await state.update({ time: timeAsegurado });
        } else if (time === "6") {
          const timeAsegurado = "12 meses";
          await state.update({ time: timeAsegurado });
        } else {
          await flowDynamic([
            { body: `*El mensaje es incorrecto, intentalo de nuevo*` },
          ]);
          return fallBack();
        }
        //return;
      } catch (error) {
        // Envia un mensaje de error por el body y por consola.
        console.log("Error en el flujo FlowAccidentes", error);
        await flowDynamic([
          { body: "Ocurrio un error, por favor intentalo de nuevo" },
        ]);
        return fallBack();
      }
    }
  )
  .addAction(
    { capture: false, delay: 1000 },
    async (ctx, { flowDynamic, state }) => {
      try {
        const myState = await state.getMyState();
        const activity = myState.activity;
        const personal = myState.personal;
        const time = myState.time;
        const name = myState.name;

        await flowDynamic([
          {
            body: `Gracias por todas tus respuestas ${name}, un profesional de la compañía se contactará con usted.\nNos esmeraremos en asesorarlo y darle una cotización adecuada a sus necesidades`,
          },
        ]);
        await flowDynamic([
          {
            body: `Buscando la mejor opción para: *Tipo de actividad: ${activity}*\n*Cantidad de personal: ${personal}*\n*Tiempo asegurado: ${time}*\n\nPara *volver al menú* escriba 0\n\n_Para finalizar coloca "chau o "adios"._`,
          },
        ]);
      } catch (error) {
        // Envia un mensaje de error por el body y por consola.
        console.log("Error en el flujo FlowAccidentes", error);
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
      console.log("Error en el flujo FlowAccidentes", error);
      await flowDynamic([
        { body: "Ocurrio un error, por favor intentalo de nuevo" },
      ]);
      return fallBack();
    }
  });
module.exports = FlowAccidentPersonal;
