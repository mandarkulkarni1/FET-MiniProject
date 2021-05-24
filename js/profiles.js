$(document).ready(function () {
  //take it from session
  var id = sessionStorage.getItem("id"); 

  //Function to display Playlist in User Profile
  $.ajax({
    type: "GET",
    url: `http://localhost:3000/playlists/`,
    dataType: "json",
    async: true,
    success: function (data) {
      for (var i = 0; i < data.length; i++) {
        if (data[i].userEmail === id) {
          $('.mysongs').append(`<div style="text-align:center" class="text"><img style="margin:3px;" height=50% width=50% src=${data[i].image}></image><p>${data[i].name}</p></div>`)
        }
      }
    }
  });



  //Function To Display Recently Played

  $.ajax({
    type: "GET",
    url: `http://localhost:3000/users/${id}`,
    dataType: "json",
    async: true,
    success: function (data) {
      data = JSON.parse(JSON.stringify(data).replace("recentlyPlayed[]", "recentlyPlayed"))
      $.ajax({
        type: "GET",
        url: `http://localhost:3000/songs/`,
        dataType: "json",
        async: true,
        success: function (songs) {
          $.each(songs, function (i, song) {
            for (var j = 0; j < data.recentlyPlayed.length; j++) {
              if (data.recentlyPlayed[j] === song.id) {
                $.ajax({
                  type: "GET",
                  url: `http://localhost:3000/albums/${song.album_id}`,
                  dataType: "json",
                  async: true,
                  success: function (album) {
                    $('.recentlyPlayed').append(`<div style="text-align:center"><img style="margin:3px;" height=50% width=50% src=${album.cover}></image><p>${song.name}</p></div>`)
                  }

                })
              }
            }

          });
        }
      })

    }
  });



  /*loading profile image from json server */
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

 
});
