$(document).ready(function() {
  /* When user click update user button */
  $('#btnUpdateUser').on('click', userUpdate);
});

function userUpdate(e) {
  var isEmpty = true; /* Has user filled any field to update user data? */
  var userData = {};
  e.preventDefault();
  /* Add user data update form on dialog box. */
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
    width: 'auto',
    modal: true,
    buttons: {
      OK: function() {
        if ($('#dialog-user input#fullname').val()){
          userData.fullname = $('#dialog-user input#fullname').val();
          isEmpty = false;
        }
        if ($('#dialog-user input#email').val()){
          userData.email = $('#dialog-user input#email').val();
          isEmpty = false;
        }
        if (!isEmpty){
          sendUserData(userData);
        } else {  /* If user has not filled any field */
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

var sendUserData = function(docs){
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
