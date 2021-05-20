$(document).ready(function () {
  var id = sessionStorage.getItem("id"); //take it from session

  //Function to display Playlist in User Profile
  $.ajax({
    type: "GET",
    url: `http://localhost:3000/playlists/`,
    dataType: "json",
    async: true,
    success: function (data) {
      for (var i = 0; i < data.length; i++) {
        if (data[i].userEmail == id) {
          $('.mysongs').append(`<div style="text-align:center"><img style="margin:3px;" height=50% width=50% src=${data[i].image}></image><p>${data[i].name}</p></div><hr>`)
        }
      }
    }
  });



  //Function To Display Favorites

  $.ajax({
    type: "GET",
    url: `http://localhost:3000/users/${id}`,
    dataType: "json",
    async: true,
    success: function (data) {
      // console.log(data);
      data = JSON.parse(JSON.stringify(data).replace("recentlyPlayed[]", "recentlyPlayed"))
      // console.log('recently played'+ data.recentlyPlayed);
      $.ajax({
        type: "GET",
        url: `http://localhost:3000/songs/`,
        dataType: "json",
        async: true,
        success: function (songs) {
          // for (var i = 0; i < songs.length; i++) {
          $.each(songs, function (i, song) {
            for (var j = 0; j < data.recentlyPlayed.length; j++) {
              if (data.recentlyPlayed[j] === song.id) {
                $.ajax({
                  type: "GET",
                  url: `http://localhost:3000/albums/${song.album_id}`,
                  dataType: "json",
                  async: true,
                  success: function (album) {
                    $('.recentlyPlayed').append(`<div style="text-align:center"><img style="margin:3px;" height=50% width=50% src=${album.cover}></image><p>${song.name}</p></div><hr>`)
                  }

                })








              }
            }

          });
        }
      })

    }
  });



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
        var name = data.username;

        //loading profile
        $(".title").append(name);
        $(".userName").append(data.id);
        $(".phone").append(data.phone);

        //loading profile img on profile page

        if (data.profilePic == null) {
          //Default Photo if Not present
          $(".avatar").append(`
            <img  src="../assets/images/profile/profile1.jpeg" alt="Circle Image"
            class="img-raised rounded-circle img-fluid my-img">
            `);
        } else {
          $(".avatar").append(`
            <img  src="${data.profilePic}" alt="Circle Image"
            class="img-raised rounded-circle img-fluid my-img">
            `);
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
        data = JSON.parse(
          JSON.stringify(data).replace("recentlyPlayed[]", "recentlyPlayed")
        );
        var myProfile = {
          id: data.id,
          username: data.username,
          phone: data.phone,
          password: data.password,
          profilePic: `../assets/images/profile/${pic}`,
          recentlyPlayed: data.recentlyPlayed,
        };

        //  call for updating profile picture
        $.ajax({
          url: `http://localhost:3000/users/${id}`,
          type: "PUT",
          data: myProfile,
          success: function (data) {
            alert("uploaded successfully");
          },
        });
      },
    });
  };

  // caling input
  $(".file-upload").on("change", function () {
    filePath(this);
  });

  //call for file-upload on click of button
  $(".upload-button").on("click", function () {
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

  $("#submitData").on("click", function (e) {
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
          data = JSON.parse(
            JSON.stringify(data).replace("recentlyPlayed[]", "recentlyPlayed")
          );
          var body = {
            id: data.id,
            username: name,
            phone: phone,
            password: data.password,
            profilePic: data.profilePic,
            recentlyPlayed: data.recentlyPlayed,
          };
          //AJAX Request to update data to rest API

          $.ajax({
            url: `http://localhost:3000/users/${id}`,
            type: "PUT",
            data: body,
            success: function (data) {
              alert("uploaded successfully");
            },
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
            id: data.id,
            username: name,
            phone: phone,
            password: cnfPassword,
            profilePic: data.profilePic,
            recentlyPlayed: data.recentlyPlayed,
          };
          //AJAX Request to update data to rest API
          body = JSON.parse(
            JSON.stringify(body).replace("recentlyPlayed[]", "recentlyPlayed")
          );
          $.ajax({
            url: `http://localhost:3000/users/${id}`,
            type: "PUT",
            data: body,
            success: function (data) {
              alert("uploaded successfully");
            },
          });
        }
      },
    });
  });

  //---------------------------------------------------------------------------------------------------------//
  //---------------------------------------------------------------------------------------------------------//
});
