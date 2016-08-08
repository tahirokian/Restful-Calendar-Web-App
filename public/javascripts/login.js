/* login.js */
$(document).ready(function() {
  $("#loginbtn").on("click", userLogin);
});

function userLogin(e) {
  e.preventDefault();
  var errorCnt = 0;
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
      if(response.success){
        window.location.replace(response.url);
      } else{
	alert(response.message);
      }
    });
  }
  else {
    alert('Please provide correct information for Login');
    return false;
  }
}

