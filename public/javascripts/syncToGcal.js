/* OAuth client ID for google calendar API. Client ID can be retrieved from your project in the Google
 * Developer Console, https://console.developers.google.com
 */
var CLIENT_ID = '';
/* Set the read and write permission for calendar API. */
var SCOPES = ["https://www.googleapis.com/auth/calendar"];

$(document).ready(function() {
  /* If user wants to export events to google calendar. */
  $('#toGoogle').on('click', checkAuthExport);
});

/* Check if current user has authorized this application. */
function checkAuthExport(e) {
  e.preventDefault();
  if(gapi && gapi.auth) {
    gapi.auth.authorize({
        'client_id': CLIENT_ID,
        'scope': SCOPES.join(' '),
        'immediate': true
    }, handleAuthResultExport);
  }
}

/* Handle response from authorization server.
 * @param {Object} authResult Authorization result.
 */
function handleAuthResultExport(authResult) {
  if (authResult && !authResult.error) {
    loadCalendarApiExport();
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
          handleAuthClickExport(event);
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
function handleAuthClickExport(event) {
  gapi.auth.authorize(
    {client_id: CLIENT_ID, scope: SCOPES, immediate: false},
    handleAuthResultExport
  );
  return false;
}

/* Load Google Calendar client library. Send events to google calendar
 * once client library is loaded.
 */
function loadCalendarApiExport() {
  gapi.client.load('calendar', 'v3', sendEvntsToGcal);
}


function sendEvntsToGcal() {
  /* Get all local events from database. */
  $.getJSON('/getevents', function(data) {
    /* If there are any events. */
    if (data.length) {
      $.each(data, function(){
        var localEvent = this;
        /* If this event does not have googleId, the it was added locally and not added to google cal. */
        if (!localEvent.googleId) {
          var event = {
            'summary': localEvent.description,
            'location': localEvent.place,
            'start': {
              'dateTime': localEvent.startDate+'T'+localEvent.startTime+':00',
              'timeZone': 'Europe/Helsinki'
            },
            'end': {
              'dateTime': localEvent.endDate+'T'+localEvent.endTime+':00',
              'timeZone': 'Europe/Helsinki'
            }
          };
          /* Insert event to google calendar. */
          var request = gapi.client.calendar.events.insert({
            'calendarId': 'primary',
            'resource': event
          });
          /* Added event is in response, add google id to local event. */
          request.execute(function(response) {
            var googleIdEvent = {
              'googleId': response.id
            };
            $.ajax({
              type: 'PUT',
              url: '/editevent/' + localEvent._id,
              data: googleIdEvent,
              dataType: 'JSON'
            }).done(function(res, status){
              if (status){
                /* Nothing to do, if added successfully. */
              } else {
                alert('Error: ' + res);
              }
            });
          });
        }
        /* If this event has google id then already addded to google cal,
         * chekc if it was modified locally.
         */
        else {
          /* Event to send to server, if update required. */
          var updEvent = {};
          /* Chekck if event has been modified. */
          var isModified = false;
          /* Get event from google cal with google id. */
          var request = gapi.client.calendar.events.get({
            'calendarId': 'primary',
            'eventId': localEvent.googleId
          });
          request.execute(function(response) {
            /* Convert the recieved event to local format. Function definition in syncFromGcal.js. */
            var formatdEv = toLocalFormat(response);
            /* Start and end are required parameters for using Google APT UPDATE method.
             * If update is required, then all of following parametert must be used.
             * Otherwise, event will have empty fields in google cal corresponding to those parameters.
             */
            updEvent = {
              'start': {
                'dateTime': localEvent.startDate+'T'+localEvent.startTime+':00',
                'timeZone': 'Europe/Helsinki'
              },
              'end': {
                'dateTime': localEvent.endDate+'T'+localEvent.endTime+':00',
                'timeZone': 'Europe/Helsinki'
              },
              'summary': localEvent.description,
              'location': localEvent.place
            };
            /* Check if it has been modified or not? */
            if (localEvent.startDate != formatdEv.startDate || localEvent.startTime != formatdEv.startTime) {
              isModified = true;
            }
            if (localEvent.endDate != formatdEv.endDate || localEvent.endTime != formatdEv.endTime) {
              isModified = true;
            }
            if (localEvent.description != formatdEv.description) {
              isModified = true;
            }
            if (localEvent.place != formatdEv.place) {
              isModified = true;
            }
            if (isModified) {
              /* Update event on google calendar. */
              var request = gapi.client.calendar.events.update({
                'calendarId': 'primary',
                'eventId': localEvent.googleId,
                'resource': updEvent
              });
              /* Added event is in response. */
              request.execute(function(response) {
                /* Nothing to do. */
              });
            }
          });
        }
      });
      alert('Sync complete.');
    }
    else {
      alert('No new events to update.');
    }
  });
}
