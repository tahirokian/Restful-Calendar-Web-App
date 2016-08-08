$(document).ready(function() {
  $('#eventform').on('click', '#btnEditDel', editDel);
});

function editDel() {
  var id = $(this).attr('name');
  $('#dialog-editDel').html('Please select what you want to do:');
  $('#dialog-editDel').dialog({
    resizable: false,
    height: 'auto',
    width: 400,
    modal: true,
    buttons: {
      Edit: function() {
        $( this ).dialog( 'close' );
        editEvent(id);
      },
      Delete: function() {
        $( this ).dialog( 'close' );
        deleteEvent(id);
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
  var editData, noData = true;
  editFormHtml();
  $('#dialog-form').dialog({
    height: 'auto',
    width: 350,
    modal: true,
    buttons: {
      Update: function() {
        editData = processInputData();
        if ( editData.alertValue ) noData = false;
        if (editData.emptyCnt < 6){
          updateEvent(editData.formData, id);
          $(this).dialog( 'close' );
        } else if ( noData ) {
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
        '<input type="date" autofocus="autofocus" placeholder="YYYY-MM-DD" required class="form-control" id="startDate" />' +
      '</div>' +
      '<div class="form-group">' +
        '<label for="enddate">End Date:</label>' +
        '<input type="date" placeholder="YYYY-MM-DD" required class="form-control" id="endDate" />' +
      '</div>' +
      '<div class="form-group">' +
        '<label for="starttime">Start Time:</label>' +
        '<input type="time" placeholder="HH:MM (24hr format)" required class="form-control" id="startTime" />' +
      '</div>' +
      '<div class="form-group">' +
        '<label for="endtime">End Time:</label>' +
        '<input type="time" placeholder="HH:MM (24hr format)" required class="form-control" id="endTime" />' +
      '</div>' +
      '<div class="form-group">' +
        '<label for="description">Description:</label>' +
        '<input type="text" placeholder="Description" maxlength="80" required class="form-control" id="description" />' +
      '</div>' +
      '<div class="form-group">' +
        '<label for="place">Place:</label>' +
        '<input type="text" placeholder="Place" maxlength="80" required class="form-control" id="place" />' +
      '</div>' +
    '</form>'
  );
}

var processInputData = function() {
  var emptyCnt = 6;
  var formData = {};
  var d1, d2, t1, t2;
  d1 = $('#dialog-form input#startDate').val();
  d2 = $('#dialog-form input#endDate').val();
  t1 = $('#dialog-form input#startTime').val();
  t2 = $('#dialog-form input#endTime').val();
  if ( (d1 && !d2) || (!d1 && d2) ) {
    alert('Please provide both start date and end date.');
    return { emptyCnt: emptyCnt, formData: formData, alertValue: true };
  } else if ( d1 && d2  ) {
    if ( Date.parse( d1 ) > Date.parse( d2 ) ) {
      alert('Start date is later than end date. Please try again.');
      return { emptyCnt: emptyCnt, formData: formData, alertValue: true };
    } else if ( (t1 && !t2) || (!t1 && t2) ) {
      alert('Please provide both start time and end time.');
      return { emptyCnt: emptyCnt, formData: formData, alertValue: true };
    } else if ( (t1 && t2) && (t1 > t2) && (d1 == d2) ) {
      alert('Start time is later than end time. Please try again.');
      return { emptyCnt: emptyCnt, formData: formData, alertValue: true };
    } else {
      formData.startDate = d1;
      formData.endDate = d2;
      emptyCnt -= 2;
      if ( t1 && t2 ){
        formData.startTime = t1;
        formData.endTime = t2;
        emptyCnt -= 2;
      }
    }
  } else if ( (t1 || t2) ){
    alert('Please provide start date and end date alongwith start time and end time.');
    return { emptyCnt: emptyCnt, formData: formData, alertValue: true };
  }
  if ($('#dialog-form input#description').val()) {
    formData.description = $('#dialog-form input#description').val();
    emptyCnt--;
  }
  if ($('#dialog-form input#place').val()) {
    formData.place = $('#dialog-form input#place').val();
    emptyCnt--;
  }
  return { emptyCnt: emptyCnt, formData: formData, alertValue: false };
};

var updateEvent = function(docs, id){
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

