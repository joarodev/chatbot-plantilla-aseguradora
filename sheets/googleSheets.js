const { google } = require("googleapis");
const enviarMensaje = require("../utils/enviarMensaje.js");

require("dotenv").config(); // Importar variables de entorno

//claves que precisa google
const keys = {
  type: "service_account",
  project_id: process.env.GOOGLE_PROJECT_ID,
  private_key_id: "963ce1df2d2ab83df284da61676afccdcd420b92",
  private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  client_email: process.env.GOOGLE_CLIENT_EMAIL,
  client_id: "104440294889094322008",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/chatbot-sheets%40chatbot-405017.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
};

// leer datos de una hoja de calculos
async function leerDatos() {
  const client = new google.auth.JWT(
    keys.client_email,
    null,
    keys.private_key,
    ["https://www.googleapis.com/auth/spreadsheets"]
  );

  try {
    await client.authorize();
    console.log("Autenticación exitosa");

    const sheets = google.sheets({ version: "v4", auth: client });
    const respuesta = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID, // ID de tu hoja de cálculo
      range: "UserData!A1:C20", // Rango que deseas leer, por ejemplo 'Sheet1!A1:C'
    });

    const valores = respuesta.data.values;
    if (valores.length) {
      console.log("Datos obtenidos:");
      valores.forEach((fila) => {
        const nombre = fila[0];
        const telefono = fila[1];
        const mensaje = fila[2];
        console.log(
          `Nombre: ${nombre}, Teléfono: ${telefono}, Mensaje: ${mensaje}`
        );
      });
    } else {
      console.log("No se encontraron datos.");
    }
  } catch (error) {
    console.error("Error al leer datos:", error);
  }
}

// función para enviar mensajes a partir de una hoja de calculos
async function cargarDatos(adapterProvider, idSheets, sheetName) {
  const adaptador = adapterProvider;

  const client = new google.auth.JWT(
    keys.client_email,
    null,
    keys.private_key,
    ["https://www.googleapis.com/auth/spreadsheets"]
  );

  try {
    await client.authorize();
    console.log("Autenticación exitosa");

    const sheets = google.sheets({ version: "v4", auth: client });

    // guardamos en una variable el id de la hoja de calculos
    const hojaId = `${idSheets}`;
    // guardamos en una variable el rango de la hoja de calculos
    const rango = `${sheetName}!A2:C101`;

    // Obtener el rango actual de la hoja de cálculo para determinar la última fila ocupada
    const respuesta = await sheets.spreadsheets.values.get({
      spreadsheetId: hojaId,
      range: rango,
    });

    // guardamos en una variable los valores de la hoja de calculos
    const valores = respuesta.data.values;
    if (valores.length) {
      console.log("Números obtenidos:");
      let count = 0;
      for (let i = 0; i < valores.length; i++) {
        const fila = valores[i];
        const numero = fila[1]; // Suponiendo que el número de teléfono está en la segunda columna
        const mensaje = fila[2]; // Mensaje que deseas enviar
        await enviarMensaje(adaptador, numero, mensaje);
        count++;
        if (count >= 20) {
          // Espera 20 minutos antes de enviar más mensajes
          await new Promise((resolve) => setTimeout(resolve, 20 * 60 * 1000)); // 20 minutos en milisegundos
          count = 0; // Reinicia el contador
        }
      }
    } else {
      console.log("No se encontraron números.");
    }
  } catch (error) {
    console.error("Error al cargar datos:", error);
  }
}

// función para cargar datos en celdas de una hoja de calculos
async function cargarDatosEnCeldas(idSheets, sheetName, datos) {

  // verificamos las credenciales de la api
  const client = new google.auth.JWT(
    keys.client_email,
    null,
    keys.private_key,
    ["https://www.googleapis.com/auth/spreadsheets"]
  );

  try {
    await client.authorize();
    console.log("Autenticación exitosa");

    const sheets = google.sheets({ version: "v4", auth: client });

    // guardamos en una variable el id de la hoja de calculos y el nombre de la hoja de calculos a la que se le va a cargar los datos.
    const hojaId = `${idSheets}`;
    const rango = `${sheetName}!A:C`;

    // Obtener el rango actual de la hoja de cálculo para determinar la última fila ocupada
    const respuesta = await sheets.spreadsheets.values.get({
      spreadsheetId: hojaId,
      range: rango,
    });

    let filasActuales = 0;
    if (respuesta.data.values) {
      filasActuales = respuesta.data.values.length;
    }

    const proximaFila = filasActuales + 1;

    const valores = [];

    // Iterar sobre cada conjunto de datos en el array datos
    datos.forEach((dato) => {
      // Agregar un nuevo array con los datos a valores
      valores.push(dato);
    });

    // Actualizar los valores en la hoja de cálculo en la rango especificada.
    const response = await sheets.spreadsheets.values.update({
      spreadsheetId: hojaId,
      range: `${sheetName}!A${proximaFila}:C${proximaFila}`,
      valueInputOption: "RAW",
      requestBody: {
        values: valores,
      },
    });

    console.log(`${response.data.updatedCells} celdas actualizadas.`);
  } catch (error) {
    console.error("Error al cargar datos en celdas:", error);
  }
}

module.exports = { leerDatos, cargarDatos, cargarDatosEnCeldas };
