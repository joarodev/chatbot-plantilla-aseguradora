async function enviarMensaje(adapterProvider, numero, mensaje) {
  try {
    setTimeout(async () => {
      const numeroCompleto = `${numero}@c.us`;

      await adapterProvider.sendText(numeroCompleto, mensaje);
    }, 5000);
  } catch (error) {
    console.log("Error en la función enviarMensaje: ", error);
  }
}

module.exports = enviarMensaje;
