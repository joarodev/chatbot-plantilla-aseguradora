const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const FlowPlanNo = require("./planes/FlowPlanNo");
const FlowEnd = require("../end/FlowEnd");

const FlowPlanSalud = addKeyword(EVENTS.ACTION)
  .addAnswer(
    ["Genial, ¿Actualmente *tienes una cobertura de salud*?\n1- Si\n2- No"],
    { capture: true },
    async (ctx, { flowDynamic, gotoFlow }) => {
      try {
        const userOption = ctx.body.toString();

        if (userOption === "1") {
          await flowDynamic([{ body: "Gracias por tu respuesta" }]);
          await flowDynamic([
            { body: "Puedes decirme cual es tu *compañía de salud*" },
          ]);
          return;
        } else if (userOption === "2") {
          await flowDynamic([{ body: "Gracias por la respuesta" }]);
          return gotoFlow(FlowPlanNo);
        }
      } catch (error) {
        // Envia un mensaje de error por el body y por consola.
        console.log("Error en el flujo FlowPlanSalud", error);
        await flowDynamic([
          { body: "Ocurrio un error, por favor intentalo de nuevo" },
        ]);
        return fallBack();
      }
    }
  )
  .addAction({ capture: true }, async (ctx, { flowDynamic, state }) => {
    try {
      const company = ctx.body.toString();

      await state.update({ company: company });

      await flowDynamic([
        {
          body: "Gracias por la información, ¿Puedes decirme como es el *trato en esta empresa*?",
        },
      ]);

      return;
    } catch (error) {
      // Envia un mensaje de error por el body y por consola.
      console.log("Error en el flujo FlowPlanSalud", error);
      await flowDynamic([
        { body: "Ocurrio un error, por favor intentalo de nuevo" },
      ]);
      return fallBack();
    }

  })
  .addAction({ capture: true }, async (ctx, { state, flowDynamic }) => {
    try {
      const trato = ctx.body.toString();

      await state.update({ trato: trato });

      await flowDynamic([
        {
          body: "Gracias por la respuesta, ¿Cuando los has necesitado, *han respondido de forma satisfactoria*?",
        },
      ]);

      return;
    } catch (error) {
      // Envia un mensaje de error por el body y por consola.
      console.log("Error en el flujo FlowPlanSalud", error);
      await flowDynamic([
        { body: "Ocurrio un error, por favor intentalo de nuevo" },
      ]);
      return fallBack();
    }
  })

  .addAction({ capture: true }, async (ctx, { state, flowDynamic }) => {
    try {
      const respuesta = ctx.body.toString();

      await state.update({ respuesta: respuesta });

      const myState = await state.getMyState();
      const name = myState.name;

      await flowDynamic([
        {
          body: `Genial ${name}, un profesional de la compañía se contactará con usted. Nos esmeraremos en asesorarlo y darle una cotización adecuada a sus necesidades.\n\nPara volver al menú escriba 0\n\n_Si deseas finalizar coloca "chau o adíos"_`,
        },
      ]);
    } catch (error) {
      // Envia un mensaje de error por el body y por consola.
      console.log("Error en el flujo FlowPlanSalud", error);
      await flowDynamic([
        { body: "Ocurrio un error, por favor intentalo de nuevo" },
      ]);
      return fallBack();
    }
  })

  .addAction({ capture: true }, async (ctx, { gotoFlow }) => {
    try {
      // Flujo despedida
      if (
        ctx.body.toString().toLowerCase() === "chau" ||
        ctx.body.toString().toLowerCase() === "adiós"
      ) {
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
      console.log("Error en el flujo FlowPlanSalud", error);
      await flowDynamic([
        { body: "Ocurrio un error, por favor intentalo de nuevo" },
      ]);
      return fallBack();
    }
  });

module.exports = FlowPlanSalud;
