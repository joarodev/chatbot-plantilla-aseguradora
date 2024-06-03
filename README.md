### Plantilla Chatbot Aseguradora

**Con esta librería, puedes construir flujos automatizados de conversación de manera agnóstica al proveedor de WhatsApp,** configurar respuestas automatizadas para preguntas frecuentes, recibir y responder mensajes de manera automatizada, y hacer un seguimiento de las interacciones con los clientes.  Además, puedes configurar fácilmente disparadores que te ayudaran a expandir las funcionalidades sin límites. **[Ver documentación](https://bot-whatsapp.netlify.app/)**


## Correr el proyecto local

Clonar proyecto

```bash
  git clone https://github.com/RSTArgentina/chatbot-aseguradora
```

Ir al directorio del proyecto

```bash
  cd chat-aseguradora
```

Instalar dependecias

```bash
  npm install
```

Iniciar servidor

```bash
  npm run start
```


---
## Recursos
- [📄 Documentación](https://bot-whatsapp.netlify.app/)
- [🚀 Roadmap](https://github.com/orgs/codigoencasa/projects/1)
- [💻 Discord](https://link.codigoencasa.com/DISCORD)
- [👌 Twitter](https://twitter.com/leifermendez)
- [🎥 Youtube](https://www.youtube.com/watch?v=5lEMCeWEJ8o&list=PL_WGMLcL4jzWPhdhcUyhbFU6bC0oJd2BR)

## Estructura del proyecto
```
chatbot-aseguradora

├─ flows
│  ├─ campaign
│  │  └─ FlowCampaing.js
│  ├─ FlowMain.js
│  └─ greeting
│     ├─ FlowGreeting.js
│     └─ menu
│        ├─ accidentes
│        │  └─ FlowAccidentes.js
│        ├─ alarmas
│        │  └─ FlowAlarmas.js
│        ├─ autos
│        │  ├─ asegurado
│        │  │  ├─ FlowAutoNo.js
│        │  │  └─ FlowAutoSeguro.js
│        │  └─ FlowAutos.js
│        ├─ camaras
│        │  └─ FlowCamaras.js
│        ├─ end
│        │  └─ FlowEnd.js
│        ├─ FlowMenu.js
│        ├─ hogar
│        │  └─ FlowHogar.js
│        ├─ integral
│        │  └─ FlowIntegral.js
│        ├─ moto
│        │  └─ FlowMoto.js
│        ├─ plan de salud
│        │  ├─ FlowPlanSalud.js
│        │  └─ planes
│        │     └─ FlowPlanNo.js
│        ├─ plan viajes
│        │  └─ FlowViajes.js
│        ├─ seguro celular
│        │  └─ FlowCelular.js
│        └─ seguro vida
│           └─ FlowVida.js
├─ package-lock.json
├─ package.json
├─ README.md
├─ sheets
│  └─ googleSheets.js
└─ utils
   └─ enviarMensaje.js

```
## Menú - Flujos
1- Seguros del automotor 🚗

2- Seguros de Moto 🏍️

3- Seguro de accidentes personales 👤

4- Seguro de integral de comercio 🏪

5- Seguro de vida - retiro - inversión 🍃

6- Plan de salud prepago ⛑️

7- Seguros de Hogar 🏡

## Flujos funcionales

- "FlowCampaign": Se activa con la palabra "Campaña" o "campaña", esta diseñado para gestionar la ejecucion de campañas a travez de mensajes de WhatsApp, el flujo le pedira al usuario de un ID de google sheets y el nombre de la hoja especifica donde se encuentran los datos.

## API Google referencia

#### Get all items

```http
  GET https://www.googleapis.com/auth/spreadsheets

  range: "Sheet!A[Numero]:C[Numero]"
```
#### Get item

```http
  GET https://www.googleapis.com/auth/spreadsheets

  range: "Sheet!A1:C1"
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `project_id` | `string` | **Required**. Proyecto id |
| `private_key` | `string` | **Required**. API privada |
| `client_email` | `string` | **Required**. email cliente |


### Funciones:

#### leerDatos()

Lee los datos de un rango harcodeado de la base de datos, esta funcion esta pensada para desarrollo.

#### cargarDatos(proveedor, idSheets, sheetName)

Lee los datos de un rango y hoja de calculo que le pasamos por el chat de WhatsApp, utiliza una funcion para enviar mensajes que esta dentro del proveedor, por esta razon debemos pasarlo por parametro.

#### cargarDatosEnCeldas(idSheets, sheetName, datos)

Carga los datos que enviamos por parametros, en una hoja de calculo la cual tambien pasaremos por parametros, esta se encuentra dentro del id "idSheets".