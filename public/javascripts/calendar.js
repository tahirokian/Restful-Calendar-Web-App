$(document).ready(function() {
  /* Get all events from data base */
  getAllEvents();
});

var getAllEvents = function() {
  var events = [];
  $.getJSON('/getevents', function( data ) {
    if (data && data.length) {
      k=0;
      $.each(data, function(){
        /* Make events array according to fullcalendar event format. */
        events[k] = {
          title: this.description,
          start: this.startDate+'T'+this.startTime+':00',
          end: this.endDate+'T'+this.endTime+':00',
          id : this._id,
          startDate: this.startDate,
          endDate: this.endDate,
          startTime: this.startTime,
          endTime: this.endTime,
          description: this.description,
          place: this.place
        };
        k++;
      });
    }
    /* Show calendar on the web page with events retrieved from data base */
    showCalendar(events);
  });
};

var showCalendar = function(events) {
  $('#calendar').fullCalendar({
    theme: true,
    header: {
      left: 'prev,next today',
      center: 'title',
      right: 'month,agendaWeek,agendaDay'
    },
    weekNumbers: true,
    defaultDate: new Date(),
    editable: true,
    eventColor: '#808080',
    eventLimit: true, /* Allow "more" link when too many events. */
    events: events,
    timeFormat: 'H(:mm)',
    /* If user clicks on a day view on calendar. */
    dayClick: function(date, jsEvent, view) {
      $('#dialog-clickDay').html('<p>Do you want to add an event?</p>');
      /* Show dialog box */
      $('#dialog-clickDay').dialog({
        height: 'auto',
        width: 'auto',
        modal: true,
        buttons: {
          Yes: function() {
            $( this ).dialog( 'close' );
            /* Show form for adding an event with the clicked date. */
            showAddEventhtml(date.format());
          },
          No: function() {
            $( this ).dialog( 'close' );
          }
        }
      });
    },
    /* If user clicks on an event on the calendar. */
    eventClick: function(calEvent, jsEvent, view) {
      /* Show event detail on dialog box. */
      $('#dialog-confirm').html('<p>Description: ' + calEvent.description + '<br />Place: ' + calEvent.place + '<br />Starts: ' +
        calEvent.startTime + ' on ' + calEvent.startDate + '<br />' + 'Ends: ' + calEvent.endTime + ' on ' + calEvent.endDate + '</p>');
      $('#dialog-confirm').dialog({
        height: 'auto',
        width: 'auto',
        modal: true,
        buttons: {
          Edit: function() {
            $( this ).dialog( 'close' );
            /* Call editEvent function defined in editDelEvent.js */
            editEvent(calEvent.id);
          },
          Delete: function() {
            $( this ).dialog( 'close' );
            /* Call deleteEvent function defined in editDelEvent.js */
            deleteEvent(calEvent.id);
          },
          Close: function() {
            $( this ).dialog( 'close' );
          }
        }
      });
    }
  });
}

function showAddEventhtml(clickedDate) {
  $('#eventform').html(''+
    '<form class="form" role="form">' +
      '<legend><strong>Add Event</strong>:</legend>' +
      '<div class="col-sm-2">' +
      '<div class="form-group">' +
        '<label for="startdate">Start Date:</label>' +
        '<input type="date" placeholder="YYYY-MM-DD" value='+clickedDate+' class="form-control" id="startDate" title="YYYY-MM-DD" />' +
      '</div> </div>' +
      '<div class="col-sm-2">' +
      '<div class="form-group">' +
        '<label for="enddate">End Date:</label>' +
        '<input type="date" placeholder="YYYY-MM-DD" value='+clickedDate+' class="form-control" id="endDate" title="YYYY-MM-DD" />' +
      '</div> </div>' +
      '<div class="col-sm-2">' +
      '<div class="form-group">' +
        '<label for="starttime">Start Time:</label>' +
        '<input type="time" placeholder="HH:MM (24hr format)" autofocus class="form-control" id="startTime" title="HH:MM" />' +
      '</div> </div>' +
      '<div class="col-sm-2">' +
      '<div class="form-group">' +
        '<label for="endtime">End Time:</label>' +
        '<input type="time" placeholder="HH:MM (24hr format)" class="form-control" id="endTime" title="HH:MM" />' +
      '</div> </div>' +
      '<div class="col-sm-2">' +
      '<div class="form-group">' +
        '<label for="description">Description:</label>' +
        '<input type="text" placeholder="Description" maxlength="80" class="form-control" id="description" />' +
      '</div> </div>' +
      '<div class="col-sm-2">' +
      '<div class="form-group">' +
        '<label for="place">Place:</label>' +
        '<input type="text" placeholder="Place" maxlength="80" class="form-control" id="place" />' +
      '</div> </div> <br /> <br />' +
      '<div class="col-sm-5"></div>' +
      '<div class="btn-group">' +
        '<button id="btnAddEvent" class="btn btn-info"><span class="glyphicon glyphicon-plus"></span> Add</button>' +
        '<button id="btnAddCloseEvent" class="btn btn-warning"><span class="glyphicon glyphicon-remove"></span> Close</button>' +
      '</div> <br />' +
    '</form>  <hr />'
  );
}
