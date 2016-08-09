$(document).ready(function() {
  $('#addevnt').on('click', addEventhtml);
  $('#eventform').on('click', '#btnAddEvent', addEvent);
  $('#eventform').on('click', '#btnAddCloseEvent', closeForm);
});

function addEventhtml() {
  $('#eventform').html(''+
    '<form class="form" role="form">' +
      '<legend><strong>Add Event</strong>:</legend>' +
      '<div class="col-sm-2">' +
      '<div class="form-group">' +
        '<label for="startdate">Start Date:</label>' +
        '<input type="date" placeholder="YYYY-MM-DD" autofocus class="form-control" id="startDate" title="YYYY-MM-DD" />' +
      '</div> </div>' +
      '<div class="col-sm-2">' +
      '<div class="form-group">' +
        '<label for="enddate">End Date:</label>' +
        '<input type="date" placeholder="YYYY-MM-DD" class="form-control" id="endDate" title="YYYY-MM-DD" />' +
      '</div> </div>' +
      '<div class="col-sm-2">' +
      '<div class="form-group">' +
        '<label for="starttime">Start Time:</label>' +
        '<input type="time" placeholder="HH:MM (24hr format)" class="form-control" id="startTime" title="HH:MM" />' +
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

function addEvent(e) {
  e.preventDefault();
  var errorCnt = 0;
  $('#eventform input').each(function(index, val) {
    if($(this).val() === '') { errorCnt++; }
  });
  if(errorCnt === 0) {
    var d1 = $('#eventform input#startDate').val();
    var d2 = $('#eventform input#endDate').val();
    var t1 = $('#eventform input#startTime').val();
    var t2 = $('#eventform input#endTime').val();
    if ( !checkDateFormat(d1) || !checkDateFormat(d2) ) {
      alert('Please enter a valid date in YYYY-MM-DD format.');
      return;
    }
    if ( !checkTimeFormat(t1) || !checkTimeFormat(t2) ) {
      alert('Please enter a valid time in HH:MM 24 hour format.');
      return;
    }
    if ( Date.parse(d1) > Date.parse(d2) ) {
      alert('Start date is later than end date');
    } else if ( (t1 > t2)  && (Date.parse(d1) == Date.parse(d2)) ) {
      alert("Start time is later than end time");
    } else {
      var newEvent = {
        'startDate': d1,
        'endDate': d2,
        'startTime': t1,
        'endTime': t2,
        'description': $('#eventform input#description').val(),
        'place': $('#eventform input#place').val()
      }
      $.ajax({
        type: 'POST',
        data: newEvent,
        url: '/addevent',
        dataType: 'JSON'
      }).done(function( res, status ) {
        if (status) {
          window.location.replace('/home');
        } else {
    alert('Error: ' + res);
        }
      });
    }
  } else {
    alert('Please fill in all fields');
    return false;
  }
};

function closeForm(e) {
  e.preventDefault();
  $('#eventform').html('');
}

function checkDateFormat (dateVal) {
  var dateRegEx = /^(19|20)\d\d[-](0[1-9]|1[012])[-](0[1-9]|[12][0-9]|3[01])$/;
  return dateRegEx.test(dateVal);
}

function checkTimeFormat(timeVal) {
  var timeRegEx = /^(0[0-9]|1[0-9]|2[0-3])[:]([0-5][0-9])$/;
  return timeRegEx.test(timeVal);
}