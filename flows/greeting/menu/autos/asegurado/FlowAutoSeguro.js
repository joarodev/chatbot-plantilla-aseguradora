const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const FlowEnd = require("../../end/FlowEnd");

const FlowAutoSeguro = addKeyword(EVENTS.ACTION)
  .addAnswer(
    ["Excelente, ¿En que *compañía te encuentras* actualmente?"],
    { capture: true },
    async (ctx, { state, flowDynamic }) => {
      try {
        const company = ctx.body.toString();

        await state.update({ company: company });

        await flowDynamic([
          {
            body: `Gracias por la información, puedes decirme *como es el trato en la compañía ${company}*`,
          },
        ]);
        return;
      } catch (error) {
        // Envia un mensaje de error por el body y por consola.
        console.log("Error en el flujo FlowAutoSeguro", error);
        await flowDynamic([
          { body: "Ocurrio un error, por favor intentalo de nuevo" },
        ]);
        return fallBack();
      }
    },
    []
  )
  .addAction({ capture: true }, async (ctx, { state, flowDynamic }) => {
    try {
      const relationCompany = ctx.body.toString();

      await state.update({ relationCompany: relationCompany });

      const myState = await state.getMyState();
      const company = myState.company;

      await flowDynamic([
        {
          body: `Gracias por tu respuesta, *¿Cuando has necesitado algún servicio de ${company}, han respondido satisfactoriamente?*`,
        },
      ]);
      return;
    } catch (error) {
      // Envia un mensaje de error por el body y por consola.
      console.log("Error en el flujo FlowAutoSeguro", error);
      await flowDynamic([
        { body: "Ocurrio un error, por favor intentalo de nuevo" },
      ]);
      return fallBack();
    }
  })
  .addAction({ capture: true }, async (ctx, { state, flowDynamic }) => {
    try {
      const responseCompany = ctx.body.toString();

      await state.update({ responseCompany: responseCompany });

      const myState = await state.getMyState();
      const name = myState.name;
      const company = myState.company;
      const relationCompany = myState.relationCompany;
      const response = myState.responseCompany;

      await flowDynamic([
        {
          body: `Gracias por todas tus respuestas, analizaremos cada una de ella y en el caso de poder ofrecerte algo mucho mejor nos volveremos a contatar...`,
        },
      ]);

      await flowDynamic([
        {
          body: `*Nombre:* ${name}\n*Companía:* ${company}\n*Tu trato con la compañía es:* ${relationCompany}\n*La respuesta por parte de ${company} es:* ${response}\n\nPara *volver al menú* escriba 0\n\n_Si deseas finalizar coloca "chau o adíos"_`,
        },
      ]);
    } catch (error) {
      // Envia un mensaje de error por el body y por consola.
      console.log("Error en el flujo FlowAutoSeguro", error);
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
        await flowDynamic([{ body: "Gracias por tu tiempo, hasta luego!" }]);
        return gotoFlow(FlowEnd);
      } else if (ctx.body.toString().toLowerCase() === "0") {
        return gotoFlow(require("../../FlowMenu"));
      } else {
        await flowDynamic([{ body: "Opción no valida, intentalo de nuevo" }]);
        return fallBack();
      }

      return;
    } catch (error) {
      // Envia un mensaje de error por el body y por consola.
      console.log("Error en el flujo FlowAutoSeguro", error);
      await flowDynamic([
        { body: "Ocurrio un error, por favor intentalo de nuevo" },
      ]);
      return fallBack();
    }
  });

module.exports = FlowAutoSeguro;
