const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const FlowEnd = require("../end/FlowEnd");

// Flujo cotización hogar
const FlowHogar = addKeyword(EVENTS.ACTION)
  .addAnswer(
    [
      "Puedes decirme el *tipo de vivienda* en el que te encuentras\n",
      "*1.* Casa\n",
      "*2.* Departamento\n",
    ],
    // capturamos la elección del usuario
    { capture: true },
    async (ctx, { fallBack, flowDynamic, state }) => {
      try {
        // convertimos en string el mensaje
        const userOption = ctx.body.toString();

        // enviamos respuesta dependiendo de la opción del usuario
        if (userOption === "1") {
          const casa = "Casa";
          await state.update({ state: casa });
          await flowDynamic([
            { body: `¿Que *superficie aproximada* tiene su casa?` },
          ]);
          return;
        } else if (userOption === "2") {
          const departamento = "Departamento";

          // guardamos en un estado el valor de departamento
          await state.update({ state: departamento });
          await flowDynamic([
            { body: `¿Que *superficie aproximada* tiene su departamento?` },
          ]);
          return;
        } else {
          // Si la respuesta no es válida, enviamos un mensaje de error y volvemos al flujo anterior.
          await flowDynamic([
            { body: "*Opcion incorrecta, intentalo de nuevo*" },
          ]);
          return fallBack();
        }
      } catch (error) {
        // Envia un mensaje de error por el body y por consola.
        console.log("Error en el flujo FlowHogar", error);
        await flowDynamic([
          { body: "Ocurrio un error, por favor intentalo de nuevo" },
        ]);
        return fallBack();
      }
    }
  )
  .addAction(
    { capture: true },
    async (ctx, { flowDynamic, fallBack, state }) => {
      try {
        // capturamos el valor de la superficie
        const superficie = ctx.body.toString();
        // Verificamos si el mensaje no es nulo
        if (!superficie) {
          await flowDynamic([{ body: "*Por favor ingresa una superficie*" }]);
          return fallBack();
        }

        // guardamos en un estado el valor de superficie
        await state.update({ superficie: superficie });
        await flowDynamic([
          {
            body: `Gracias por tu respuesta, ¿Podrías decirme cual es el *codigo postal*?`,
          },
        ]);
        return;
      } catch (error) {
        // Envia un mensaje de error por el body y por consola.
        console.log("Error en el flujo FlowHogar", error);
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
        // capturamos el valor del codigo postal y lo guardamos en un estado
        const codigoPostal = ctx.body.toString();

        // verificamos que el valor no sea nulo
        if (!codigoPostal) {
          await flowDynamic([{ body: "*Por favor ingresa un codigo postal*" }]);
          return fallBack();
        }

        // guardamos en un estado el valor del codigo postal
        await state.update({ codigoPostal: codigoPostal });
        return;
      } catch (error) {
        // Envia un mensaje de error por el body y por consola.
        console.log("Error en el flujo FlowHogar", error);
        await flowDynamic([
          { body: "Ocurrio un error, por favor intentalo de nuevo" },
        ]);
        return fallBack();
      }
    }
  )
  .addAction({ capture: false }, async (_, { state, flowDynamic }) => {
    try {
      // guardamos en variables los valores que traemos en un estado
      const myState = await state.getMyState();
      const casa = myState.state;
      const superficie = myState.superficie;
      const codigoPostal = myState.codigoPostal;
      const name = myState.name;

      await flowDynamic([
        {
          body: `¡Gracias ${name}! Un profesional de la compañía se contactará con usted.\nNos esmeramos en asesorarlo y darle una cotización adecuada a sus necesidades.`,
        },
      ]);
      await flowDynamic([
        {
          body: `Esperando cotización para: *${casa}* con *${superficie}* metros cuadrados, en *${codigoPostal}*\n\nPara *volver al menú* escriba 0\n\n_Si deseas finalizar coloca "chau" o "adiós"_`,
        },
      ]);
      return;
    } catch (error) {
      // Envia un mensaje de error por el body y por consola.
      console.log("Error en el flujo FlowHogar", error);
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
        return gotoFlow(require("../FlowMenu"));
      }
      else {
        await flowDynamic([{ body: "Opción no valida, intentalo de nuevo" }]);
        return fallBack();
      }

      return;
    } catch (error) {
      // Envia un mensaje de error por el body y por consola.
      console.log("Error en el flujo FlowHogar", error);
      await flowDynamic([
        { body: "Ocurrio un error, por favor intentalo de nuevo" },
      ]);
      return fallBack();
    }
  });

module.exports = FlowHogar;
