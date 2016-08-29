$(document).ready(function() {
  /* Edit or delete an event from search result table */
  $('#eventform').on('click', '#btnEditDel', showEditDelDialog);
});

function showEditDelDialog(e) {
  e.preventDefault();
  /* name attribute contains id value. From showEventsTable function in searchEvent.js */
  var id = $(this).attr('name');
  $('#dialog-editDel').html('Please select what you want to do:');
  $('#dialog-editDel').dialog({
    resizable: false,
    height: 'auto',
    width: 'auto',
    modal: true,
    buttons: {
      Edit: function() {
        $( this ).dialog( 'close' );
        editEvent(id);  /* Update event based on event id */
      },
      Delete: function() {
        $( this ).dialog( 'close' );
        deleteEvent(id);  /* Delete event based on event id */
      },
      Close: function() {
        $( this ).dialog( 'close' );
      }
    }
  });
}

var deleteEvent = function(id) {
  var confirmation = confirm('Are you sure you want to delete this event?');
  if (confirmation) {
    $.ajax({
      type: 'DELETE',
      url: '/delevent/' + id,
      dataType: 'JSON'
    }).done(function(res, status){
      if (status) {
        window.location.replace('/home');
        alert('Event deleted successully');
      } else {
        alert('Error: ' + res);
      }
    });
  }
};

var editEvent = function(id) {
  var inputData;
  /* Show form on dialog box to update an event */
  editFormHtml();
  $('#dialog-form').dialog({
    height: 'auto',
    width: 'auto',
    modal: true,
    buttons: {
      Update: function() {
        /* Validate form input data when update button is clicked */
        inputData = processInputData();
        /* If user has entered valid data. */
        if (!inputData.isInValid){
          sendUpdateEvent(inputData.event, id);
          $(this).dialog( 'close' );
        }
        /* If user has clicked update button without providing any input. Only show this
         * alert box if no alert box shown to user in processInputData().
         */
        else if (!inputData.alertValue && inputData.isInValid) {
          alert('Nothing to update. Press OK to continue.');
          $(this).dialog( 'close' );
        }
      },
      Close: function() {
        $( this ).dialog( 'close' );
      }
    }
  });
}

var editFormHtml = function() {
  $('#dialog-form').html('' +
    '<form class="form" role="form">' +
      '<div class="form-group">' +
        '<label for="startdate">Start Date:</label>' +
        '<input type="date" placeholder="YYYY-MM-DD" class="form-control" id="startDate" autofocus title="YYYY-MM-DD" />' +
      '</div>' +
      '<div class="form-group">' +
        '<label for="enddate">End Date:</label>' +
        '<input type="date" placeholder="YYYY-MM-DD" class="form-control" id="endDate" title="YYYY-MM-DD" />' +
      '</div>' +
      '<div class="form-group">' +
        '<label for="starttime">Start Time:</label>' +
        '<input type="time" placeholder="HH:MM (24hr format)" class="form-control" id="startTime" title="HH:MM" />' +
      '</div>' +
      '<div class="form-group">' +
        '<label for="endtime">End Time:</label>' +
        '<input type="time" placeholder="HH:MM (24hr format)" class="form-control" id="endTime" title="HH:MM" />' +
      '</div>' +
      '<div class="form-group">' +
        '<label for="description">Description:</label>' +
        '<input type="text" placeholder="Description" maxlength="80" class="form-control" id="description" />' +
      '</div>' +
      '<div class="form-group">' +
        '<label for="place">Place:</label>' +
        '<input type="text" placeholder="Place" maxlength="80" class="form-control" id="place" />' +
      '</div>' +
    '</form>'
  );
}

var processInputData = function() {
  var isInValid = true; /* Checks if user has entered valid data? */
  var eventData = {};
  var d1, d2, t1, t2;
  d1 = $('#dialog-form input#startDate').val();
  d2 = $('#dialog-form input#endDate').val();
  t1 = $('#dialog-form input#startTime').val();
  t2 = $('#dialog-form input#endTime').val();
  /* Date update require both start and end date. Time update require start/end date && start/end time.
   * Description and place can be updated independently.
   */
  if ( (d1 && !d2) || (!d1 && d2) ) {
    alert('Please provide both start date and end date.');
    /* alertValue key checks if any alert has been shown to user because of invalid/incomlete data? */
    return { isInValid: isInValid, event: eventData, alertValue: true };
  }
  /* If both dates entered, checkDateFormat function from addEvent.js */
  else if ( d1 && d2  ) {
    if ( !checkDateFormat(d1) || !checkDateFormat(d2) ) {
      alert('Please enter a valid date in YYYY-MM-DD format.');
      return { isInValid: isInValid, event: eventData, alertValue: true };
    }
    if ( Date.parse( d1 ) > Date.parse( d2 ) ) {
      alert('Start date is later than end date. Please try again.');
      return { isInValid: isInValid, event: eventData, alertValue: true };
    }
    /* If one of start or end time is provided by user and both dates are provided. */
    else if ( (t1 && !t2) || (!t1 && t2) ) {
      alert('Please provide both start time and end time.');
      return { isInValid: isInValid, event: eventData, alertValue: true };
    }
    /* If both start and end time are entered, checkTimeFormat function from addEvent.js */
    else if ( (t1 && t2) && (!checkTimeFormat(t1) || !checkTimeFormat(t2)) ) {
      alert('Please enter a valid time in HH:MM 24 hour format.');
      return { isInValid: isInValid, event: eventData, alertValue: true };
    }
    /* Check if start time is later than end time when start and end date are same */
    else if ( (t1 && t2) && (t1 > t2) && (d1 == d2) ) {
      alert('Start time is later than end time. Please try again.');
      return { isInValid: isInValid, event: eventData, alertValue: true };
    }
    /* Create update event */
    else {
      eventData.startDate = d1;
      eventData.endDate = d2;
      isInValid = false;  /* Valid data */
      if ( t1 && t2 ){    /* If user want to update time of event. */
        eventData.startTime = t1;
        eventData.endTime = t2;
      }
    }
  }
  /* If start and end date not provided but one or both the time values are entered by the user.
   * Time update require both start and end date.
   */
  else if ( (t1 || t2) ){
    alert('Please provide start date and end date alongwith start time and end time.');
    return { isInValid: isInValid, event: eventData, alertValue: true };
  }
  if ($('#dialog-form input#description').val()) {
    eventData.description = $('#dialog-form input#description').val();
    isInValid = false;
  }
  if ($('#dialog-form input#place').val()) {
    eventData.place = $('#dialog-form input#place').val();
    isInValid = false;
  }
  /* If user has not filled any field, isInValid will still be true, otherwise fasle. */
  return { isInValid: isInValid, event: eventData, alertValue: false };
};

var sendUpdateEvent = function(docs, id){
  $.ajax({
    type: 'PUT',
    url: '/editevent/' + id,
    data: docs,
    dataType: 'JSON'
  }).done(function(res, status){
    if (status){
      window.location.replace('/home');
      alert('Event updated successully');
    } else {
      alert('Error: ' + res);
    }
  });
}
