$(document).ready(function() {
  $('#schevnt').on('click', searchEventhtml);
  $('#eventform').on('click', '#btnSchEvent', srchEvent);
  $('#eventform').on('click', '#btnSchCloseEvent', closeForm);
  $('#eventform').on('click', '#btnTablCloseEvent', closeForm);
  $('#eventform').on('click', '#btnSchAgain', searchEventhtml);
});

function searchEventhtml(e) {
  e.preventDefault();
  $('#eventform').html(''+
    '<form class="form" role="form">' +
      '<legend><strong>Search Events</strong>:</legend>' +
      '<div class="col-sm-6">' +
      '<div class="form-group">' +
        '<label for="startdate">Start Date:</label>' +
        '<input type="date" placeholder="YYYY-MM-DD" class="form-control" id="startDate" autofocus title="YYYY-MM-DD" />' +
      '</div> </div>' +
      '<div class="col-sm-6">' +
      '<div class="form-group">' +
        '<label for="enddate">End Date:</label>' +
        '<input type="date" placeholder="YYYY-MM-DD" class="form-control" id="endDate" title="YYYY-MM-DD" />' +
      '</div> </div> <br />' +
      '<div class="col-sm-5"></div>' +
      '<div class="btn-group">' +
        '<button id="btnSchEvent" class="btn btn-info"><span class="glyphicon glyphicon-search"></span> Search</button>' +
        '<button id="btnSchCloseEvent" class="btn btn-warning"><span class="glyphicon glyphicon-remove"></span> Close</button>' +
      '</div> <br />' +
    '</form>  <hr />'
  );
}

function srchEvent(e) {
  e.preventDefault();
  var d1 = $('#eventform input#startDate').val();
  var d2 = $('#eventform input#endDate').val();
  if ( d1 && d2 ) {
    if ( Date.parse(d1) > Date.parse(d2) ) {
      alert('Start date is later than end date. Please try again.');
      return;
    }
  }
  var conditions = {
    'startDate': d1,
    'endDate': d2
  }
  $.ajax({
    type: 'POST',
    data: conditions,
    url: '/searchevents',
    dataType: 'JSON'
  }).done(function( res, status ) {
    if (status) {
      $('#eventform input').val('');
      showEventsTable(res);
    } else {
      alert('Error: ' + res);
    }
  });
};

function showEventsTable(events) {
  var tableContent = '';
  if (events && events.length) {
    $.each(events, function(){
      tableContent += '<tr>';
      tableContent += '<td>' + this.startDate + '</td>';
      tableContent += '<td>' + this.endDate + '</td>';
      tableContent += '<td>' + this.startTime + '</td>';
      tableContent += '<td>' + this.endTime + '</td>';
      tableContent += '<td>' + this.description + '</td>';
      tableContent += '<td>' + this.place + '</td>';
      tableContent += '<td><button id="btnEditDel" class="btn btn-info center-block" name=' + this._id  + '>Edit/Del</button></td>'; 
      tableContent += '</tr>';
    });
    $('#eventform').html(''+
      '<h5><strong>Search Results:</strong></h5>' +
      '<div class="table-responsive">' +
        '<table class="table table-striped table-bordered table-sm">' +
          '<thead class="bg-success text-center">' +
            '<tr><th>Start Date</th><th>End Date</th><th>Start Time</th><th>End Time</th><th>Description</th><th>Location</th><th>Action</tr>' +
          '</thead>' + 
          '<tbody>' + tableContent + '</tbody>' +
        '</table>' +
      '</div>' +
      '<div class="col-sm-5"></div>' +
      '<div class="btn-group">' +
        '<button id="btnSchAgain" class="btn btn-info"><span class="glyphicon glyphicon-search"></span> Search</button>' +
        '<button id="btnTablCloseEvent" class="btn btn-warning"><span class="glyphicon glyphicon-remove"></span> Close</button>' +
      '</div> <br />  <hr />'
    );
  } else {
    alert('No events found. Please try again.');
  }
};

