$(document).ready(function () {

  var id = "mk@123";  //take it from session

  //---------------------------------------------------------------------------------------------------------//
  /*loading profile image from json server */
  //---------------------------------------------------------------------------------------------------------//

  $("body").on("load", function () {

    $.ajax({
      type: "GET",
      url: `http://localhost:3000/users/${id}`,
      dataType: "json",
      async: true,
      success: function (data) {
        // console.log(data);
        var name = data.username;

        //loading profile
        $(".title").append(name);
        $("#userName").append(name);

        $("#ename").attr('value', `${data.username}`);
        $("#ephone").attr('value', `${data.phone}`);
        $("#eemail").attr('value', `${data.id}`);


        //loading profile img on profile page

        if (data.profilePic == "") {
          $(".avatar").css({ "background-color": "gray", "width": "200px", "height": "200px", "border-radius": "50%" });
        } else {
          $(".avatar").append(`
    <img  src="${data.profilePic}" alt="Circle Image"
    class="img-raised rounded-circle img-fluid my-img">
    `  );
        }
        //loading profile img on edit-profile page

        $(".my-pic").append(`<img class="profile-pic"
     style="width: 140px; height: 140px; border-radius: 20px;" src="${data.profilePic}" alt=""> `);


      },
      error: function () {
        console.log("not able to process request");
      },
    });
  });
  $("body").trigger("load");

  //---------------------------------------------------------------------------------------------------------//
  /* change profile pic */
  //---------------------------------------------------------------------------------------------------------//
  var filePath = function (i) {
    var pic = i.files[0].name;


    // to get all values
    $.ajax({
      type: "GET",
      url: `http://localhost:3000/users/${id}`,
      dataType: "json",
      async: true,
      success: function (data) {
        var myProfile = {

          "id": data.id,
          "username": data.username,
          "phone": data.phone,
          "password": data.password,
          "profilePic": `../assets/${pic}`
        }

        //  call for updating profile picture
        $.ajax({
          url: `http://localhost:3000/users/${id}`,
          type: 'PUT',
          data: myProfile,
          success: function (data) {
            alert('uploaded successfully');
          }
        });

      }
    });

  }

  // caling input
  $(".file-upload").on('change', function () {
    filePath(this);
  });

  //call for file-upload on click of button
  $(".upload-button").on('click', function () {
    $(".file-upload").click();
  });

  //-------------------------------------------------------------------------------------------------------//
  // edit profilr data
  //---------------------------------------------------------------------------------------------------------//

  // $('#enewPassword , #cnfPassword').on('keyup', function(){
  //   var newP=$('#enewPassword').val();
  //   var cnfP=$('#cnfPassword').val();
  //   if(newP==cnfP){
  //     $('#msg').html('Matching').css('color','green');
  //   }else{
  //     $('#msg').html('Not Matching').css('color','red');
  //   }

  //  });

  $("#submitData").on('click', function (e) {
    //Getting All the values
    e.preventDefault();
    var name = $("#ename").val();
    // var id = $("#eemail").val();
    var phone = $("#ephone").val();
    var curPassword = $("#ecurPassword").val();
    var newPassword = $("#enewPassword").val();
    var cnfPassword = $("#ecnfPassword").val();

    // console.log(name);


    //for getting profile pic
    $.ajax({
      type: "GET",
      url: `http://localhost:3000/users/${id}`,
      dataType: "json",
      async: true,
      success: function (data) {

        if (curPassword == "" && cnfPassword == "") {

          var body = {
            "id": data.id,
            "username": name,
            "phone": phone,
            "password": data.password,
            "profilePic": data.profilePic
          }
          //AJAX Request to update data to rest API

          $.ajax({
            url: `http://localhost:3000/users/${id}`,
            type: 'PUT',
            data: body,
            success: function (data) {
              alert('uploaded successfully');
            }
          });

        } else {


          //Password Confirmation
          if (curPassword != data.password) {
            alert("Current Passwords Don't Match");
            return;
          }
          //Password Confirmation
          if (newPassword != cnfPassword) {
            alert("Passwords Don't Match");
            return;
          }
          var body = {
            "id": data.id,
            "username": name,
            "phone": phone,
            "password": cnfPassword,
            "profilePic": data.profilePic
          }
          //AJAX Request to update data to rest API

          $.ajax({
            url: `http://localhost:3000/users/${id}`,
            type: 'PUT',
            data: body,
            success: function (data) {
              alert('uploaded successfully');
            }
          });

        }



      }

    });
  });

  //---------------------------------------------------------------------------------------------------------//
  //---------------------------------------------------------------------------------------------------------//



});

