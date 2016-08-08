$(document).ready(function() {
  getAllEvents();
});

var getAllEvents = function() {
  var events = [];
  $.getJSON('/getevents', function( data ) {
    if (data && data.length) {
      k=0;
      $.each(data, function(){
        events[k] = {
          title: this.description + ' at ' + this.place, 
          start: this.startDate+'T'+this.startTime+':00', 
          end: this.endDate+'T'+this.endTime+':00', 
          id : this._id,
          startDate: this.startDate,
          endDate: this.endDate,
          startTime: this.startTime,
          endTime: this.endTime
        };
	      k++;
      });
    }
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
    eventLimit: true, // allow "more" link when too many events
    events: events,
    timeFormat: 'H(:mm)',
    dayClick: function(date, jsEvent, view) {
      $('#dialog-clickDay').html('<p>Do you want to add an event?</p>');
      $('#dialog-clickDay').dialog({
        height: 'auto',
        width: 400,
        modal: true,
        buttons: {
          Yes: function() {
            $( this ).dialog( 'close' );
            addEventhtml();
          },
          No: function() {
            $( this ).dialog( 'close' );
          }
        }
      });
    },
    eventClick: function(calEvent, jsEvent, view) {
      $('#dialog-confirm').html('<p>Event detail: ' + calEvent.title + '<br />Start time: ' + calEvent.startDate + ', ' + calEvent.startTime + '<br />' +
        'End time: ' + calEvent.endDate + ', ' + calEvent.endTime + '</p>');
      $('#dialog-confirm').dialog({
        height: 'auto',
        width: 400,
        modal: true,
        buttons: {
          Edit: function() {
            $( this ).dialog( 'close' );
            editEvent(calEvent.id);
          },
          Delete: function() {
            $( this ).dialog( 'close' );
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
