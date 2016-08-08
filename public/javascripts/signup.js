/* signup.js */
$(document).ready(function() {
  $("#signupbtn").on("click", userSignUp);
});

function userSignUp(e) {
  e.preventDefault();
  var errorCnt = 0;
  $('#signupform input').each(function(index, val) {
    if($(this).val() === '') { errorCnt++; }
  });
  if (errorCnt === 0) {
    var signupuser = {
      'username': $('#username').val(),
      'password': $('#password').val(),
      'email': $('#email').val(),
      'fullname': $('#fullname').val()	
    }
    $.ajax({
      type: 'POST',
      url: '/signup',
      data: signupuser
    }).done(function(response, status) {
      if (response.success) {
        window.location.replace(response.url);
        if (response.message)
	  alert(response.message);
      } else {
          if (response.message)
	    alert(response.message);
      }
    });
  }
  else {
    alert('Please provide all information for SignUp');
    return false;
  } 
}
