$(document).ready(function() {
  /* User clicekd signup button */
  $("#signupbtn").on("click", userSignUp);
});

function userSignUp(e) {
  e.preventDefault();
  var errorCnt = 0;
  /* Check if user has filled in all fields? */
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
      if (response.success) {   //If signup success
        window.location.replace('/home');
      } else {
        alert('Username already exists. Please try again.');
      }
    });
  }
  else {
    alert('Please provide all information for signup.');
    return false;
  }
}
