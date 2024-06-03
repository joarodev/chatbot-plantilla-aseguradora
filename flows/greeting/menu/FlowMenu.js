const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const FlowAutos = require("./autos/FlowAutos");
const FlowHogar = require("./hogar/FlowHogar");
const FlowMoto = require("./moto/FlowMoto");
const FlowAccidentPersonal = require("./accidentes/FlowAccidentes");
const FlowIntegralComerce = require("./integral/FlowIntegral");
const FlowPlanSalud = require("./plan de salud/FlowPlanSalud");
const FlowLife = require("./seguro vida/FlowVida");
const {
  cargarDatosEnCeldas,
  leerDatos,
} = require("../../../sheets/googleSheets");

require("dotenv").config(); // Importar variables de entorno

const FlowMenu = addKeyword(EVENTS.ACTION).addAnswer(
  //MENÚ
  [
    "*Seguros de:* \n",
    "*1-* Automotor 🚗\n",
    "*2-* Moto 🏍️\n",
    "*3-* Accidentes personales 👤\n",
    "*4-* Integral de comercio 🏪\n",
    "*5-* Vida - Retiro - Inversión 🍃\n",
    "*6-* Plan de salud prepago ⛑️\n",
    "*7-* Hogar 🏡\n",
    `\n_Si deseas finalizar coloca "chau o adíos"_`,
  ],
  { capture: true, delay: 1000 },
  async (ctx, { flowDynamic, fallBack, gotoFlow, state }) => {
    try {
      const selectOption = ctx.body.toString();

      //OPCIONES DE MENÚ
      if (selectOption === "1") {
        // guardamos en una variable nuestro estado
        const myState = await state.getMyState();
        // guardamos en variables el contenido nombre,, numero y mensaje de nuestro estado:
        const name = myState.name;
        const phone = myState.phone;
        const message = "Usuario interesado en seguro automotor";

        // guardamos las variables en el array data
        const data = [[name, phone, message]];

        // enviamos los datos a google sheets
        await cargarDatosEnCeldas(process.env.ID_SHEETS, "UserData", data);

        // retornamos al flujo
        return gotoFlow(FlowAutos);
      } else if (selectOption === "2") {
        // guardamos en una variable nuestro estado
        const myState = await state.getMyState();
        // guardamos en variables el contenido nombre,, numero y mensaje de nuestro estado:
        const name = myState.name;
        const phone = myState.phone;
        const message = "Usuario interesado en seguro para motos";

        // guardamos las variables en el array data
        const data = [[name, phone, message]];

        // enviamos los datos a google sheets
        await cargarDatosEnCeldas(process.env.ID_SHEETS, "UserData", data);

        // retornamos al flujo
        return gotoFlow(FlowMoto);
      } else if (selectOption === "3") {
        // guardamos en una variable nuestro estado
        const myState = await state.getMyState();
        // guardamos en variables el contenido nombre,, numero y mensaje de nuestro estado:
        const name = myState.name;
        const phone = myState.phone;
        const message = "Usuario interesado en seguro para accidentes personales";

        // guardamos las variables en el array data
        const data = [[name, phone, message]];

        // enviamos los datos a google sheets
        await cargarDatosEnCeldas(process.env.ID_SHEETS, "UserData", data);

        // retornamos al flujo
        return gotoFlow(FlowAccidentPersonal);
      } else if (selectOption === "4") {
        // guardamos en una variable nuestro estado
        const myState = await state.getMyState();
        // guardamos en variables el contenido nombre,, numero y mensaje de nuestro estado:
        const name = myState.name;
        const phone = myState.phone;
        const message = "Usuario interesado en seguro para el comercio";

        // guardamos las variables en el array data
        const data = [[name, phone, message]];

        // enviamos los datos a google sheets
        await cargarDatosEnCeldas(process.env.ID_SHEETS, "UserData", data);

        // retornamos al flujo
        return gotoFlow(FlowIntegralComerce);
      } else if (selectOption === "5") {
        // guardamos en una variable nuestro estado
        const myState = await state.getMyState();
        // guardamos en variables el contenido nombre,, numero y mensaje de nuestro estado:
        const name = myState.name;
        const phone = myState.phone;
        const message = "Usuario interesado en seguro de vida";

        // guardamos las variables en el array data
        const data = [[name, phone, message]];

        // enviamos los datos a google sheets
        await cargarDatosEnCeldas(process.env.ID_SHEETS, "UserData", data);

        // retornamos al flujo
        return gotoFlow(FlowLife);
      } else if (selectOption === "6") {
        // guardamos en una variable nuestro estado
        const myState = await state.getMyState();
        // guardamos en variables el contenido nombre,, numero y mensaje de nuestro estado:
        const name = myState.name;
        const phone = myState.phone;
        const message = "Usuario interesado en planes para la salud";

        // guardamos las variables en el array data
        const data = [[name, phone, message]];

        // enviamos los datos a google sheets
        await cargarDatosEnCeldas(process.env.ID_SHEETS, "UserData", data);

        // retornamos al flujo
        return gotoFlow(FlowPlanSalud);
      } else if (selectOption === "7") {
        // guardamos en una variable nuestro estado
        const myState = await state.getMyState();
        // guardamos en variables el contenido nombre,, numero y mensaje de nuestro estado:
        const name = myState.name;
        const phone = myState.phone;
        const message = "Usuario interesado en seguros para el hogar";

        // guardamos las variables en el array data
        const data = [[name, phone, message]];

        // enviamos los datos a google sheets
        await cargarDatosEnCeldas(process.env.ID_SHEETS, "UserData", data);

        // retornamos al flujo
        return gotoFlow(FlowHogar);
        //--------FLUJO DESPEDIDA-----------
      } else if (
        ctx.body.toString().toLowerCase() === "chau" ||
        ctx.body.toString().toLowerCase() === "adiós"
      ) {
        return gotoFlow(FlowEnd);
      } else {
        await flowDynamic([
          { body: "Opción inválida, por favor intenta de nuevo" },
        ]);
        return fallBack();
      }
    } catch (error) {
      // Envia un mensaje de error por el body y por consola.
      console.log("Error en el flujo FlowMenu", error);
      await flowDynamic([
        { body: "Ocurrio un error, por favor intentalo de nuevo" },
      ]);
      return fallBack();
    }
  },
  []
);

module.exports = FlowMenu;
