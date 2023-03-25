export const insertEvents = (calendar, event, auth) => {

    calendar.events.insert({
        auth: auth,
        calendarId: 'adlquirozcontacto@gmail.com',
        resource: event,
    }, function (err, event) {
        if (err) {
            console.log('There was an error contacting the Calendar service: ' + err);
            return;
        }
        console.log('Event created: %s', event.htmlLink);
    });

}