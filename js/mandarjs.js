$(document).ready(function () {
  $("#createuser").click(function () {
    var username = document.getElementById("name").value;
    var phone = document.getElementById("phone").value;
    var emailid = document.getElementById("emailid").value;
    var password = document.getElementById("passwordnew").value;
    var cnfpass = document.getElementById("confirm-password").value;

    if (password != cnfpass) {
      alert("Passwords Don't Match");
      return;
    }

    // var users = [];
    var newuser = { 'username': username, 'password': password, 'email': emailid, 'phone': phone };

    var validateuser = localStorage.getItem(emailid);
    if (validateuser == null) {
      localStorage.setItem(emailid, JSON.stringify(newuser));
    }
    else {
      alert("User Already Exists!!!");
    }
  });

  $('#loginuser').click(function () {

    var userid = localStorage.getItem(document.getElementById('uid').value);
    if (userid == null) {
      alert('User Not Exist please Register!!!');
    }
    else {
      userid = JSON.parse(userid);
      if (document.getElementById('password').value != userid.password) {
        alert("Wrong Password");
      }
      else {
        console.log("Login Successful!!!");
      }
    }

  });

  $('#reset1').click(function(){
    $('#form2')[0].reset();
  });
});
