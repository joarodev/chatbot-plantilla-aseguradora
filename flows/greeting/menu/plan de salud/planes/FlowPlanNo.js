const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const FlowEnd = require("../../end/FlowEnd");

const FlowPlanFinal = addKeyword(EVENTS.ACTION)
  .addAction(
    {capture: false},
    async (ctx, { flowDynamic, state }) => {
      const myState = await state.getMyState();
      const name = myState.name;
      const plan = myState.ingreso
      const childrensValidator = myState.hijos;

      if(!childrensValidator) {
        await state.update({ hijos: "0" });
      }

      const childrens = myState.hijos

      await flowDynamic([
        {
          body: `Buscando los mejores planes para ${plan}, a nombre de *${name}*, cantidad de hijos: ${childrens}...\n\n_Para finalizar coloque "chau" o "adios"._`,
        },
      ]);
    }
  )
  .addAction({ capture: true }, async (ctx, { gotoFlow }) => {
    // Flujo despedida
    if (
      ctx.body.toString().toLowerCase() === "chau" ||
      ctx.body.toString().toLowerCase() === "adiós"
    ) {
      return gotoFlow(FlowEnd);
    }

    return;
  });


const FlowHijos = addKeyword(EVENTS.ACTION).addAnswer(
    ["¿Cuantos *hijos* tienes?\n*1-* 1\n*2-* 2\n*3-* 3\n*4-* 4\n*5-* 5 o más"],
    {capture: true},
    async (ctx, { flowDynamic, state, gotoFlow }) => {
      const userResponse = ctx.body.toString();
      if (userResponse === "1") {

        await state.update({ hijos: "1" });
        return gotoFlow(FlowPlanFinal);

      } else if (userResponse === "2") {

        await state.update({ hijos: "2" });
        return gotoFlow(FlowPlanFinal);

      } else if (userResponse === "3") {

        await state.update({ hijos: "3" });
        return gotoFlow(FlowPlanFinal);
      } else if (userResponse === "4"){

        await state.update({ hijos: "4" });
        return gotoFlow(FlowPlanFinal);
      } else if (userResponse === "5"){

        await state.update({ hijos: "5 o más" });
        return gotoFlow(FlowPlanFinal);

      } else {
        await flowDynamic([{body: "Opcion invalida, prueba de nuevo"}])
        return fallBack;
      }
    },
    [FlowPlanFinal]
)

const FlowMonotributo = addKeyword(EVENTS.ACTION).addAnswer(
  ["¿Sos Monotributista/responsable inscripto?\n*1-* Si\n*2-* No"],
  { capture: true },
  async (ctx, { flowDynamic, state, gotoFlow }) => {
    const userResponse = ctx.body.toString();

    if (userResponse === "1") {
      const monotributo = "Monotributista o responsable inscripto";
      await state.update({ monotributo: monotributo });
      await flowDynamic([{ body: "¡Muchas gracias por su respuesta!" }]);
      return;
    } else if (userResponse === "2") {
      const monotributo = "No es Monotributista o responsable inscripto";
      await state.update({ monotributo: monotributo });
      await flowDynamic([{ body: "¡Muchas gracias por su respuesta!" }]);
      return gotoFlow(FlowRecibo);
    } else {
      await flowDynamic([
        { body: "Opción inválida, por favor intenta de nuevo" },
      ]);
      return fallBack();
    }
  }
);

const FlowRecibo = addKeyword(EVENTS.ACTION)
  .addAnswer(
    [
      "¿Quienes ingresarían a la prepaga?\n",
      "*1-* Yo.\n",
      "*2-* Mi pareja y yo.\n",
      "*3-* Mi pareja, Hijo/s menos de 25 años y yo.\n",
      "*4-* Hijo/s de 25 años y yo.\n",
    ],
    { capture: true },
    async (ctx, { flowDynamic, state, gotoFlow, fallBack }) => {
      const userOption = ctx.body.toString();

      if (userOption == "1") {
        const ingreso = "Una individuo";
        await state.update({ ingreso: ingreso });
        await flowDynamic([{ body: "¡Muchas gracias por su respuesta!" }]);
        return gotoFlow(FlowPlanFinal);

      } else if (userOption == "2") {
        const ingreso = "dos individuos";
        await state.update({ ingreso: ingreso });
        await flowDynamic([{ body: "¡Muchas gracias por su respuesta!" }]);
        return gotoFlow(FlowPlanFinal);

      } else if (userOption == "3") {
        const ingreso = "Varios individuos";
        await state.update({ ingreso: ingreso });
        await flowDynamic([
          {
            body: "¡Muchas gracias por su respuesta!, ¿puedes decirme la cantidad de hijos?\nPorfavor envie solamente el numero:",
          },
        ]);
        return gotoFlow(FlowHijos);

      } else if (userOption == "4") {
        const ingreso = "Varios individuos";
        await state.update({ ingreso: ingreso });
        await flowDynamic([
          {
            body: "¡Muchas gracias por su respuesta! ¿puedes decirme la cantidad de hijos?\nPorfavor envie solamente el numero:",
          },
        ]);
        return gotoFlow(FlowHijos);
      } else {
        await flowDynamic([{ body: "Opcion invalida, intentalo de nuevo" }]);
        return fallBack();
      }
    },
    [FlowPlanFinal, FlowHijos]
  )
  .addAction(
    { capture: true },
    async (ctx, { state, flowDynamic }) => {
      const numberChildrens = ctx.body;

      if (isNaN(numberChildrens)) {
        await state.update({ numberChildrens: numberChildrens });

        const myState = await state.getMyState();
        const name = myState.name;
        const ingreso = myState.ingreso;

        await flowDynamic([
          {
            body: "Genial, muchas gracias por tus respuestas, un profesional de la compañia se contactara con usted. ",
          },
        ]);

        await flowDynamic([
          {
            body: `Estamos buscando el mejor plan para *${ingreso}* a nombre de *${name}*, en breves nos contactaremos con usted\n `,
          },
        ]);
      } else {
        await flowDynamic([{ body: "Por favor envie solamente el numero:" }]);
        return fallBack();
      }
    }
  )

  .addAction({ capture: true }, async (ctx, { gotoFlow }) => {
    // Flujo despedida
    if (
      ctx.body.toString().toLowerCase() === "chau" ||
      ctx.body.toString().toLowerCase() === "adiós"
    ) {
      return gotoFlow(FlowEnd);
    }

    return;
  });

const FlowPlanNo = addKeyword(EVENTS.ACTION).addAnswer(
  [
    "Excelente, lo ayudaremos a darle la mejor cotización del mercado...\n¿Tienes recibo de sueldo?\n*1-* Si\n*2-* No",
  ],
  { capture: true },
  async (ctx, { flowDynamic, state, gotoFlow }) => {
    const sueldo = ctx.body.toString();

    if (sueldo === "1") {
      const sueldoSi = "Tengo recibo de sueldo";
      await state.update({ sueldo: sueldoSi });

      await flowDynamic([{ body: "¡Muchas gracias por su respuesta!" }]);
      return gotoFlow(FlowRecibo);

    } else if (sueldo === "2") {
      const sueldoNo = "No tengo recibo de sueldo";
      await state.update({ sueldo: sueldoNo });
      await flowDynamic([{ body: "¡Muchas gracias por su respuesta!" }]);
      return gotoFlow(FlowMonotributo);

    } else {
      await flowDynamic([
        { body: "Opción inválida, por favor intenta de nuevo" },
      ]);
      return fallBack();
    }
  },
  [FlowMonotributo, FlowRecibo]
);

module.exports = FlowPlanNo;
