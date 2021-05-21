$(document).ready(function () {

  //Flag variable
  var validuser = false;

  //Redirection to Profile page
  $('#userutton').click(function () {
    window.location.href = "../ui/profile.html"
  })

  //Force Required Check for login form
  $(function () {
    var validator = $("#form1").validate({
      rules: { name1: { required: true, minlength: 2 } },
      messages: { name1: "bad name" },
      onfocusout: function (element) { $(element).valid(); }
    });
  });
  //Force Required Check for Registration form
  $(function () {
    var validator = $("#form2").validate({
      rules: { name1: { required: true, minlength: 2 } },
      messages: { name1: "bad name" },
      onfocusout: function (element) { $(element).valid(); }
    });
  });

  //Tooltip activator
  $(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip();
  });

  //function to logout
  $('#logoutbutton').click(function () {
    sessionStorage.clear();
    window.location.replace('../Home.html');
  });

  //Function to close Login Modal
  $('#closes').click(function () {
    $('#login').modal('hide');
    $('#form1')[0].reset();
    location.reload();
  });

  //Function to close Registration Modal
  $('#close1').click(function () {
    $('#register').modal('hide');
    $('#form2')[0].reset();
    location.reload();
  });

  //FUnction to reset form
  $('#reset1').click(function () {
    $('#form2')[0].reset();
  });

  // Function to Register New User
  $("#createuser").click(function () {

    //Getting All the values
    var id = $('#emailid').val();
    var username = $('#name').val();
    var phone = $('#phone').val();
    var password = $('#passwordnew').val();
    var cnfpass = $('#confirm-password').val();

    //Password Confirmation
    if (password != cnfpass) {
      alert("Passwords Don't Match");
      return;
    }

    //AJAX Request to post data to rest API
    $.ajax({
      type: 'POST',
      url: 'http://localhost:3000/users/',
      data: JSON.stringify({ "id": id, "username": username, "phone": phone, "password": password ,"recentlyPlayed":["none","none"]}),
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
        // console.log($('#email').val);
        var uid = $('#email').val();
        var pass = $('#passwd').val();

        //iterating through RES object
        for (var i = 0; i < res.length; i++) {
          //if UserID and passowrd are correct
          if (uid === res[i].id && pass === res[i].password) {
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
        if (validuser === false) {
          alert('User Not Exist');
          $('#form1')[0].reset();
          return;
        }

        //If User is Valid, DO THE RITUALS
        if (validuser === true) {

          //Set Language to selected
          $('#lang').change(function () {
            sessionStorage.setItem("lang", $('#lang').val());

            //setting User ID
            sessionStorage.setItem("id", uid);

            //HIDE LOGIN BUTTON
            $('#loginbutton').hide();

            //Show Hidden Buttons
            $('#userbutton').removeAttr('hidden');
            $('#logoutbutton').removeAttr('hidden');

            //Toggling UI Buttons
            $('#musicLibAnchor').prop("disabled", false).removeClass('btn-outline-secondry').addClass('btn-outline-success');
            $('#nowPlayingAnchor').prop("disabled", false).removeClass('btn-outline-secondry').addClass('btn-outline-success');

            // Toggling Modals
            $('#login').modal('hide');
            $('#language').modal('hide');

            //setting User ID
            sessionStorage.setItem("id", uid);

            //HIDE LOGIN BUTTON
            $('#loginbutton').hide();

            //Show Hidden Buttons
            $('#userbutton').removeAttr('hidden');
            $('#logoutbutton').removeAttr('hidden');

            //Toggling UI Buttons
            $('#musicLibAnchor').prop("disabled", false).removeClass('btn-outline-secondry').addClass('btn-outline-success');
            $('#nowPlayingAnchor').prop("disabled", false).removeClass('btn-outline-secondry').addClass('btn-outline-success');

            // Toggling Modals
            $('#login').modal('hide');
            $('#language').modal('hide');
            window.location.href = "ui/music_library.html"
          })

        }

      }
    });
  });

});
