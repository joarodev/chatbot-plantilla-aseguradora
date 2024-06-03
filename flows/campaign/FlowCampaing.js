const { addKeyword } = require("@bot-whatsapp/bot");
const FlowEnd = require("../greeting/menu/end/FlowEnd");
const { cargarDatos } = require("../../sheets/googleSheets");


//si el usuario escribe campaña entra en este modo
const FlowCampaign = (adapterProvider) => addKeyword("campaña", "Campaña", { sensitive: true })
  .addAnswer(
    [
      "*Bienvenido al modo campaña*\n",
      'Recuerda colocar dinamicamente el nombre de tu hoja de excel o sheets...""\n\n',
      "*1-* Comenzar\n",
      "*2-* Cancelar",
    ],
    { capture: true },
    async (ctx, { flowDynamic, gotoFlow, fallBack }) => {
      const userOption = ctx.body.toString();

      if (userOption === "1") {
        await flowDynamic([
          { body: "*Por favor enviame el ID de la hoja de calculos: *" },
        ]);
        return;
      } else if (userOption === "2") {
        await flowDynamic([{ body: "Cancelando..." }]);
        return gotoFlow(FlowEnd);
      } else {
        await flowDynamic([{ body: "Opción no valida, intenta de nuevo" }]);
        return fallBack();
      }
    },
    []
  )
  .addAction(
    { capture: true },
    async (ctx, { flowDynamic, fallBack, state }) => {
      try {
        const sheetId = ctx.body.toString();
        //se pide el id de la hoja de cálculo de google sheets
        //se valida si el id es correcto

        if (!sheetId || sheetId == "") {
          await flowDynamic([{ body: "*Envia un nombre correcto*" }]);
          return fallBack();
        }

        await state.update({ idSheets: sheetId });

        await flowDynamic([{ body: `*El id de la hoja es:* _${sheetId}_` }]);

        //se precisará el nombre de la hoja
        await flowDynamic([
          { body: "*Por favor enviame el nombre de la hoja: *" },
        ]);
        return;
      } catch (error) {
        console.log(error);
      }
    }
  )
  .addAction(
    { capture: true },

    async (ctx, { flowDynamic, gotoFlow, state, fallBack }) => {
      const nameSheet = ctx.body.toString();

      //se valida si el nombre de la hoja es correcto
      if (!nameSheet || nameSheet == "") {
        await flowDynamic([{ body: "*Envia un nombre correcto*" }]);
        return fallBack();
      }
      await state.update({ sheetName: nameSheet });

      const myState = await state.getMyState();
      const sheetName = myState.sheetName;
      const idSheets = myState.idSheets;

      await cargarDatos(adapterProvider, idSheets, sheetName);
      await flowDynamic([{ body: "Campaña ejecutada con exito ✅" }]);

      return gotoFlow(FlowEnd);
    }
  );
module.exports = FlowCampaign;
