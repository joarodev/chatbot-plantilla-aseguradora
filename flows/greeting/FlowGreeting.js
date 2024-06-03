const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const FlowMenu = require("./menu/FlowMenu");

// Función para verificar si el horario es laboral
const isAfterHours = (hour) => {
  // Hora de entrada
  const entrada = 8;

  // Hora de salidas
  const salida = 18;

  // Devuelve true si la hora está dentro del horario laboral
  return entrada >= hour && hour <= salida;
};

const FlowGreeting = addKeyword(EVENTS.WELCOME)
  .addAnswer([], { delay: 2000 }, async (ctx, { flowDynamic }) => {
    try {
      // Obtenemos la fecha actual
      const now = new Date();
      // Obtenemos la hora actual
      const hourNow = now.getHours();

      // Si el horario es laboral
      if (isAfterHours(hourNow)) {
        // Enviamos un mensaje de fuera de horario
        await flowDynamic(
          "🤖 Actualmente nos encontramos fuera de horario de servicio, por favor vuelva a comunicarse de 8 a 18hs"
        );
        // No hacemos nada más
        return;
      } else {
        // Pasamos al siguiente comentario
        return;
      }
    } catch (error) {
      console.log(error);
      await flowDynamic([
        { body: "🤖 Ocurrio un error, por favor intentalo de nuevo" },
      ]);
      return fallBack();
    }
  })

  .addAction(
    { capture: false, delay: 1000 },
    async (ctx, { flowDynamic, gotoFlow, state, fallBack }) => {
      try {
        
        // Colocamos el nombre y telefono dentro de una variable de estado
        const name = ctx.pushName.toString();
        const phone = ctx.from;

        // Guardamos el nombre del usuario dentro de la variable de estado "name" y "phone"
        await state.update({ name: name });
        await state.update({ phone: phone });

        // Enviamos un mensaje personalizado al usuario con su nombre.
        await flowDynamic(
          `*¡Hola ${name}*!, somos *asesores de seguros*, ¿En que puedo ayudarte hoy?`
        );

        // Enviamos al usuario al flujo con el menú
        return gotoFlow(require("./menu/FlowMenu"));
      } catch (error) {
        console.log(error);
        await flowDynamic([
          { body: "Ocurrio un error, por favor intentalo de nuevo" },
        ]);
        return fallBack();
      }
    }
  );

module.exports = FlowGreeting;
