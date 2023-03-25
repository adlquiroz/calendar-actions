import { google } from "googleapis";
import { authorize } from "./google-auth.js"
import { insertEvents } from "./google-calendar.js"
import { searchMessageByQuery, getMessageById } from "./google-gmail.js";

authorize()
    .then(async (auth) => {
        const gmail = google.gmail({ version: 'v1', auth });
        const responseQuery = await searchMessageByQuery(gmail);

        if (responseQuery.data.hasOwnProperty("messages")) {
            const nuBankMessage = responseQuery.data.messages[0];
            const responseGetMessage = await getMessageById(gmail, nuBankMessage.id);
            //console.log(responseGetMessage.data.payload.body.data);
            const rawData = responseGetMessage.data.payload.body.data;
            const decodeData = Buffer.from(rawData, 'base64').toString();
            //console.log(decodeData);
            const paymentDate = labelSeparator(decodeData);
            const payload = createEvent('Pago Nu Bank', 'No te olvides de pagar la TDC', paymentDate);

            const calendar = google.calendar({ version: 'v3', auth });
            await insertEvents(calendar, payload, auth);

        } else {
            console.log("No hay nuevos correos de Nu Bank el dia de hoy.");
        }
    })
    .catch(console.error);

function labelSeparator(decodeData) {
    const coincidencias = [];
    const regex = [/\<strong\>\d{2} \<\/strong\>/, /\<strong\>[a-z]{1,}\.\<\/strong\>/];
    for (let i = 0; i < regex.length; i++) {
        coincidencias.push(regex[i].exec(decodeData)[0].replace(/<(strong|\/strong)>/g, '').replace('.', '').trim())
    }
    return coincidencias;
}

function createEvent(summary, description, eventDate) {
    let today = new Date();
    const year = today.getFullYear();
    const months = {
        'enero': '01',
        'febrero': '02',
        'marzo': '03'
    };

    const eventDateFormat = `${year}-${months[eventDate[1]]}-${eventDate[0]}`

    return {
        'summary': summary,
        'description': description,
        'start': {
            'date': eventDateFormat,
        },
        'end': {
            'date': eventDateFormat, //YYYY-mm-dd 
        }
    }
};