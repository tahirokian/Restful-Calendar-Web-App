$(document).ready(function() {
  /* User clicked login button */
  $("#loginbtn").on("click", userLogin);
});

function userLogin(e) {
  e.preventDefault();
  var errorCnt = 0;
  /* Check if user has filled in all fields? */
  $('#loginform input').each(function(index, val) {
    if($(this).val() === '') { errorCnt++; }
  });
  if(errorCnt === 0) {
    var loginuser = {
      'username': $('#username').val(),
      'password': $('#password').val()
    }
    $.ajax({
      type: 'POST',
      url: '/login',
      data: loginuser
    }).done(function(response, status) {
      if(response.success){   //If login sucess
        window.location.replace('/home');
      } else {
        alert('Entered credentials are not correct.');
      }
    });
  }
  else {
    alert('Please provide username and password for login.');
    return false;
  }
}
