$(document).ready(function () {
  
  //Flag variable
  var validuser = false;

  //Form Validation Using JQuery
  $('#loginuser').click(function(){
    var uid = document.getElementById('email').value;
    var pass = document.getElementById('passwd').value;
    var regex =  /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;

    if(uid == null || uid<3 || uid>25 ||regex.test(uid) || pass<3 || pass>25 || pass == null){
      alert('Invalid User ID');
      return false;
    }


  })

  //function to logout
  $('#logoutbutton').click(function () {
    sessionStorage.clear();
    location.reload();
  });

  //Function to close Login Modal
  $('#closes').click(function () {
    $('#login').modal('hide');
    $('#form1')[0].reset();
  });

  //Function to close Registration Modal
  $('#close1').click(function () {
    $('#register').modal('hide');
  });

  // //Function to close Language Modal
  // $('#close3').click(function () {
  //   $('#language').modal('hide');
  // });

  //FUnction to reset form
  $('#reset1').click(function () {
    $('#form2')[0].reset();
  });

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
      dataType: "json",
      success: function (res) {

        //Getting Essential Data
        var uid = document.getElementById('email').value;
        var pass = document.getElementById('passwd').value;

        //iterating through RES object
        for (var i = 0; i < res.length; i++) {
          //if UserID and passowrd are correct
          if (uid == res[i].id && pass == res[i].password) {
            //toggle FLAG
            validuser = true;
          }
          //check for UserID, If Match is found, There must be problem in password
          else if (uid == res[i].id) {
            alert("Wrong Password");
            return;
          }

        }
        //if UserID Not found 
        if (validuser == false) {
          alert('User Not Exist');
          $('#form1')[0].reset();
          return;
        }

        //If User is Valid, DO THE RITUALS
        if (validuser == true) {

          //Toggle modal  
          $('#login').modal('toggle');

          //HIDE LOGIN BUTTON
          $('#loginbutton').hide();

          //Show Hidden Buttons
          $('#userbutton').removeAttr('hidden');
          $('#logoutbutton').removeAttr('hidden');

          //Toggling UI Buttons
          $('#musicLibAnchor').prop("disabled", false).removeClass('btn-outline-secondry').addClass('btn-outline-success');
          $('#nowPlayingAnchor').prop("disabled", false).removeClass('btn-outline-secondry').addClass('btn-outline-success');

          //setting Session storage
          sessionStorage.setItem("id", uid);

          //toggle language MOdal
          // $('#languagemodal').modal('show');

        }

      }
    });
  });
});
