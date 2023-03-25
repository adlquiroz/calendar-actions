export const listLabels = (gmail) => {
    return gmail.users.labels.list({
        userId: 'me',
    });
}

export const searchMessageByQuery = (gmail) => {
    const dateAsNumber = parseInt(Number(new Date()) / 1000);
    const backDays = 14;
    let today = new Date((dateAsNumber - (3600 * 24 * backDays)) * 1000);
    const day = today.getDate().toString().padStart(2, '0');
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const year = today.getFullYear();
    const actualDate = `${year}/${month}/${day}`;

    return gmail.users.messages.list({
        q: `in:inbox from:nu@nu.com.mx newer:${actualDate} "Ya está disponible el estado de cuenta de tu tarjeta de crédito Nu"`,
        userId: "me",
    })
}

export const getMessageById = (gmail, messageId) => {
    return gmail.users.messages.get({
        userId: "me",
        id: messageId,
    })
}

//