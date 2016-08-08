$(document).ready(function() {
  $('#btnUpdateUser').on('click', userUpdate);
});

function userUpdate(e) {
  var emptyCnt = 2;
  var userData = {};
  e.preventDefault();
  $('#dialog-user').html('' +
    '<form class="form" role="form">' +
      '<div class="form-group">' +
        '<label for="name">Name:</label>' +
        '<input type="text" autofocus placeholder="Full name" class="form-control" id="fullname" />' +
      '</div>' +
      '<div class="form-group">' +
        '<label for="email">Email:</label>' +
        '<input type="email" placeholder="email@domain.com" class="form-control" id="email" />' +
      '</div>' +
    '</form>'
  );
  $('#dialog-user').dialog({
    height: 'auto',
    width: 350,
    modal: true,
    buttons: {
      Ok: function() {
        if ($('#dialog-user input#fullname').val()){
          userData.fullname = $('#dialog-user input#fullname').val();
          emptyCnt--;
        }
        if ($('#dialog-user input#email').val()){
          userData.email = $('#dialog-user input#email').val();
          emptyCnt--;
        }
        if (emptyCnt < 2){
          sendToServer(userData);
        } else {
          alert('Nothing to update. Press OK to continue.');
        }
        $( this ).dialog( 'close' );
      },
      Cancel: function() {
        $( this ).dialog( 'close' );
      }
    }
  });
}

var sendToServer = function(docs){
  $.ajax({
    type: 'PUT',
    url: '/edituser/',
    data: docs,
    dataType: 'JSON'
  }).done(function(res, status){
    if (status){
      window.location.replace('/home');
      alert('User data updated successully');
    } else {
      alert('Error: ' + res);
    }
  });
}
