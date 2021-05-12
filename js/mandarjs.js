// $(document).ready(function () {
//   $("#createuser").click(function () {
//     var username = document.getElementById("name").value;
//     var phone = document.getElementById("phone").value;
//     var emailid = document.getElementById("emailid").value;
//     var password = document.getElementById("passwordnew").value;
//     var cnfpass = document.getElementById("confirm-password").value;

//     if (password != cnfpass) {
//       alert("Passwords Don't Match");
//       return;
//     }

//     // var users = [];
//     var newuser = { 'username': username, 'password': password, 'email': emailid, 'phone': phone };

//     var validateuser = localStorage.getItem(emailid);
//     if (validateuser == null) {
//       localStorage.setItem(emailid, JSON.stringify(newuser));
//     }
//     else {
//       alert("User Already Exists!!!");
//     }
//   });

//   $('#loginuser').click(function () {

//     var userid = localStorage.getItem(document.getElementById('uid').value);
//     if (userid == null) {
//       alert('User Not Exist please Register!!!');
//     }
//     else {
//       userid = JSON.parse(userid);
//       if (document.getElementById('password').value != userid.password) {
//         alert("Wrong Password");
//       }
//       else {
//         console.log("Login Successful!!!");
//       }
//     }

//   });

//   $('#reset1').click(function(){
//     $('#form2')[0].reset();
//   });
// });
// ====================================================================================================

$(document).ready(function () {

  //Function to close Login Modal
  $('#closes').click(function () {
    $('#login').modal('hide'); });

  //Function to close Registration Modal
  $('#close1').click(function () {
    $('#register').modal('hide'); });
  
    //FUnction to reset form
  $('#reset1').click(function () {
    $('#form2')[0].reset(); });

    // Function to Register New User
    $("#createuser").click(function () {

      //Getting All the values
      var id = document.getElementById("emailid").value;
      var username = document.getElementById("name").value;
      var phone = document.getElementById("phone").value;
      var password = document.getElementById("passwordnew").value;
      var cnfpass = document.getElementById("confirm-password").value;

      //Password Confirmation
      if (password != cnfpass) {
        alert("Passwords Don't Match");
        return;
      }

      //AJAX Request to post data to rest API
      $.ajax({
        type: 'POST',
        url: 'http://localhost:3000/users/',
        data: JSON.stringify({ "id": id, "username": username, "phone": phone, "password": password }),
        success: alert('Account Created Successfully'),
        contentType: "application/json",
        dataType: 'json'
      });
    });

    //Function to Login user
    $('#loginuser').click(function () {

      //AJAX call to get data
      $.ajax({
        url: "http://localhost:3000/users/",
        type: 'GET',
        contentType: "application/json",
        success: function (res) {

          //Getting UserID
          var temp = document.getElementById('email').value;

          //Iterating through array to find User ID
          $.each(res, function (i, val) {
            //If UserID FOund
            if (val.id == temp) {
              //Check for password
              if (val.password == document.getElementById('passwd').value) {
                //If Password Correct, Toggle modal and alert user
                $(function () {
                  $('#login').modal('toggle');
                });
                // alert('Login successful');
                
                
                //HIDE LOGIN BUTTON
                $('#loginbutton').hide();

                //Show Hidden Buttons
                $('#userbutton').removeAttr('hidden');
                $('#logoutbutton').removeAttr('hidden');



              }
              //If Password incorrect alert user
              else {
                alert('Wrong Password');
                return;
              }
            }
            //If UserID not fount, Alert User
            else {
              alert('Wrong Email ID');
            }
          })
        }
      });
    });
  });
