const { createBot, createProvider, createFlow } = require("@bot-whatsapp/bot");

const QRPortalWeb = require("@bot-whatsapp/portal");
const BaileysProvider = require("@bot-whatsapp/provider/baileys");
const MockAdapter = require("@bot-whatsapp/database/mock");
const FLowMain = require("./flows/FlowMain");
const FlowGreeting = require("./flows/greeting/FlowGreeting");
const FlowMenu = require("./flows/greeting/menu/FlowMenu");
const FlowCampaign = require("./flows/campaign/FlowCampaing");
const FlowAutos = require("./flows/greeting/menu/autos/FlowAutos");
const FlowAutoSeguro = require("./flows/greeting/menu/autos/asegurado/FlowAutoSeguro");
const FlowAutoNo = require("./flows/greeting/menu/autos/asegurado/FlowAutoNo");
const FlowMoto = require("./flows/greeting/menu/moto/FlowMoto");
const FlowAccidentPersonal = require("./flows/greeting/menu/accidentes/FlowAccidentes");
const FlowHogar = require("./flows/greeting/menu/hogar/FlowHogar");
const FlowIntegralComerce = require("./flows/greeting/menu/integral/FlowIntegral");
const FlowPlanSalud = require("./flows/greeting/menu/plan de salud/FlowPlanSalud");
const FlowPlanNo = require("./flows/greeting/menu/plan de salud/planes/FlowPlanNo");
const FlowLife = require("./flows/greeting/menu/seguro vida/FlowVida");


const main = async () => {
  const adapterDB = new MockAdapter();
  const adapterProvider = createProvider(BaileysProvider);
  const flowCampaing = FlowCampaign(adapterProvider);
  const adapterFlow = createFlow([
    FLowMain,
    FlowGreeting,
    flowCampaing,
    FlowMenu,
    FlowAutos,
    FlowMoto,
    FlowAutoSeguro,
    FlowAutoNo,
    FlowAccidentPersonal,
    FlowHogar,
    FlowIntegralComerce,
    FlowPlanSalud,
    FlowPlanNo,
    FlowLife,

  ]);

  createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
  });

  QRPortalWeb();
};

main();
