/* OAuth client ID for google calendar API. Client ID can be retrieved from your project in the Google
 * Developer Console, https://console.developers.google.com
 */
var CLIENT_ID = '';
/* Set the read and write permission for calendar API. */
var SCOPES = ["https://www.googleapis.com/auth/calendar"];

$(document).ready(function() {
  /* If user want to import events from google calendar. */
  $('#fromGoogle').on('click', checkAuthImport);
});

/* Check if current user has authorized this application. */
function checkAuthImport(e) {
  e.preventDefault();
  if(gapi && gapi.auth) {
    gapi.auth.authorize({
      'client_id': CLIENT_ID,
      'scope': SCOPES.join(' '),
      'immediate': true
    },
    handleAuthResultImport);
  }
}

/* Handle response from authorization server.
 * @param {Object} authResult Authorization result.
 */
function handleAuthResultImport(authResult) {
  if (authResult && !authResult.error) {
    loadCalendarApiImport();
  } else {
    /* Show authorization UI dialog box, allowing the user to initiate authorization by
     * clicking Yes button.
     */
    $('#dialog-googleAuth').html('<p>Authorize access to Google Calendar API?</p>');
    $('#dialog-googleAuth').dialog({
      height: 'auto',
      width: 'auto',
      modal: true,
      buttons: {
        Yes: function() {
          $( this ).dialog( 'close' );
          handleAuthClickImport(event);
        },
        No: function() {
          $( this ).dialog( 'close' );
        }
      }
    });
  }
}

/* Initiate auth flow in response to user clicking authorize button.
 * @param {Event} event Button click event.
 */
function handleAuthClickImport(event) {
  gapi.auth.authorize(
    {client_id: CLIENT_ID, scope: SCOPES, immediate: false},
    handleAuthResultImport
  );
  return false;
}

/* Load Google Calendar client library. Get upcoming events
 * once client library is loaded.
 */
function loadCalendarApiImport() {
  gapi.client.load('calendar', 'v3', getUpcomingEvents);
}

/* Get next 50 up coming events from in the authorized user's calendar.
 * If no events are found, an appropriate message is printed.
 */
function getUpcomingEvents() {
  var request = gapi.client.calendar.events.list({
    'calendarId': 'primary',
    'timeMin': (new Date()).toISOString(),
    'showDeleted': false,
    'singleEvents': true,
    'maxResults': 50,
    'orderBy': 'startTime'
  });
  request.execute(function(resp) {
    var events = resp.items;
    /* If there are any up coming events. */
    if (events.length) {
      $.each(events, function() {
        /* Convert the google event to local event format. */
        var formatdEv = toLocalFormat(this);
        /* Event to send to server, if update required. */
        var updEvent = {};
        /* Chekck if event has been modified. */
        var isModified = false;
        /* Get this event from local database */
        $.getJSON('/getevent/' + formatdEv.googleId, function( data ) {
          /* If this google event already exists on local database. */
          if (data.length) {
            /* Event id in local database. */
            var localId = data[0]._id;
            /* Check if any field has been modified or not? */
            if (formatdEv.startDate != data[0].startDate) {
              updEvent.startDate = formatdEv.startDate;
              isModified = true;
            }
            if (formatdEv.endDate != data[0].endDate) {
              updEvent.endDate = formatdEv.endDate;
              isModified = true;
            }
            if (formatdEv.startTime != data[0].startTime) {
              updEvent.startTime = formatdEv.startTime;
              isModified = true;
            }
            if (formatdEv.endTime != data[0].endTime) {
              updEvent.endTime = formatdEv.endTime;
              isModified = true;
            }
            if (formatdEv.description != data[0].description) {
              updEvent.description = formatdEv.description;
              isModified = true;
            }
            if (formatdEv.place != data[0].place) {
              updEvent.place = formatdEv.place;
              isModified = true;
            }
            if (isModified) {
              updateEvent(updEvent, localId);
            }
          }
          /* If this google event is a new event. */
          else {
            importGoogleEvent(formatdEv);
          }
        });
      });
      alert('Synch complete.');
      window.location.replace('/home');
    }
    /* If now new or modified events to import. */
    else {
      alert('No new events to update.');
    }
  });
}

var toLocalFormat = function(googleEvent) {
  var start = googleEvent.start.dateTime;
  var end = googleEvent.end.dateTime;
  //If this an all day event
  if (!start) start = googleEvent.start.date + 'T00:00:00';
  if (!end) end = googleEvent.start.date + 'T23:59:59';
  var localEvent = {
    'startDate': start.substr(0,start.indexOf('T')),
    'endDate': end.substr(0,end.indexOf('T')),
    'startTime': start.substr(start.indexOf('T')+1,5),
    'endTime': end.substr(end.indexOf('T')+1,5),
    'description': googleEvent.summary,
    'place': googleEvent.location,
    'googleId': googleEvent.id
  }
  return localEvent;
}

var updateEvent = function(updEvent, id){
  $.ajax({
    type: 'PUT',
    url: '/editevent/' + id,
    data: updEvent,
    dataType: 'JSON'
  }).done(function(res, status){
    if (status){

    } else {
      alert('Error: ' + res);
    }
  });
}

var importGoogleEvent = function(formatdEv) {
  $.ajax({
    type: 'POST',
    data: formatdEv,
    url: '/addevent',
    dataType: 'JSON'
  }).done(function(res, status) {
    if (status) {

    } else {
      alert('Error: ' + res);
    }
  });
}
