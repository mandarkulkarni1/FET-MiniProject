$(document).ready(function () {

  //logout and redirect to home page
  $("#logoutbutton").click(function () {
    sessionStorage.clear();
    window.location.replace("../Home.html");
  });

  //Display artists as per selected language
  let selectedLang = {};
  selectedLang = sessionStorage.getItem("lang");
  if (selectedLang === "english") {
    $("#hindi-artists").hide();
    $("#marathi-artists").hide();
  }
  if (selectedLang === "hindi") {
    $("#english-artists").hide();
    $("#marathi-artists").hide();
  }
  if (selectedLang === "marathi") {
    $("#hindi-artists").hide();
    $("#english-artists").hide();
  }
  if (selectedLang === "all") selectedLang = {};

  //Get and display trending albums as per language
  $.ajax({
    type: "GET",
    url: "http://localhost:3000/albums",
    dataType: "json",
    data: { trending: "yes", language: selectedLang },
    async: true,
    success: function (data) {
      if (data.length === 0) console.log("Not found");
      else {
        let albumlist = "";
        $.each(data, function (i, a) {                      //For each album display card
          var albumId = a.id;
          albumlist += `
                                        <div id=${albumId} class="card">
                                        <img class="card-img-top" src=${a.cover} alt="Card image cap">
                                        <h5 class="card-title">${a.name}</h5>
                                        <p class="card-text" style="font-size: 12px;">${a.artist}</p>
                                        </div>
      
                                    `;
        });

        $("#albums").append(albumlist);
      }
    },
    error: function () {
      console.log("not able to process request");
    },
  });


  //On selecting a trending album 
  $("#albums").on("click", ".card", function (e) {
    let albumId = e.currentTarget.id;
    sessionStorage.setItem("selectedAlbum", albumId);   //Store selected album id in session variable
    window.location.href = "songlist.html";        //Navigate to album song list page    
  });

  //On selecting an album category
  $("#category .card").on("click", function () {
    let selectedSection = $(this).parent().attr("id");
    sessionStorage.setItem("section", selectedSection);  //Storing page section(category) selected in session variable
    sessionStorage.setItem("value", $(this).attr("id"));  //Storing selected category in session variable
    window.location.href = "list.html";             //Navigate to the songs and album list page
  });

  //On selecting an artist
  $("#artists .card").on("click", function () {
    let selectedSection = $(this).parent().parent().attr("id");
    sessionStorage.setItem("section", selectedSection);  //Storing page section(srtist) selected in session variable
    sessionStorage.setItem("value", $(this).attr("name")); //Storing selected artist name in session variable
    window.location.href = "list.html";
  });

  //Getting and displaying recently played songs of user
  $.ajax({                                            
    type: "GET",
    url: "http://localhost:3000/users/" + sessionStorage.getItem("id"),  //Getting specific user info
    dataType: "json",
    async: true,
    success: function (user) {
      user = JSON.parse(
        JSON.stringify(user).replace("recentlyPlayed[]", "recentlyPlayed")
      );
      $.each(user.recentlyPlayed, function (i, songId) {     //Getting information of each recently played song by song id
        $.ajax({
          type: "GET",
          url: "http://localhost:3000/songs",
          dataType: "json",
          data: { id: songId },
          async: true,
          success: function (data) {
            $.each(data, function (i, song) {           //Getting album info of the song
              $.ajax({
                type: "GET",
                url: "http://localhost:3000/albums",
                dataType: "json",
                data: { id: song.album_id },
                async: true,
                success: function (data) {
                  let songlist = "";
                  $.each(data, function (i, album) {          //Display each recently played song using card
                    songlist += `
                                                    <div class="song">
                                                    <div id=${song.id} class="card">
                                                    <img class="card-img-top" src=${album.cover} alt="Card image cap">
                                                    <div class="card-body" style="text-align: left;">
                                                    <h5 class="card-title" style="margin:2px;">${song.name}</h5>
                                                    <p class="card-text" style="font-size: 12px;margin:2px;">Album : ${album.name}</p>
                                                    <p class="card-text" style="font-size: 12px;margin:2px;">Artist(s) : ${song.artist}</p>
                                                    <p class="card-text" style="font-size: 12px;margin:2px;">Duration : ${song.duration}</p>
                                                    </div>
                                                    <img class="play-img" src="../assets/images/play.png" >
                                                    </div>
                                                    </div>
                                                `;
                  });
                  $("#recent").append(songlist);
                },

                error: function () {
                  console.log("not able to process request");
                },
              });
            });
          },
          error: function () {
            console.log("not able to process request");
          },
        });
      });
    },

    error: function () {
      console.log("not able to process request");
    },
  });

  //On selecting a particular recently played song
  $(".song-container").on("click", ".card", function (e) {
    let selectedSong = e.currentTarget.id;              
    window.location.href = "audio.html?id=" + selectedSong;   //Navigate to audio player page to play the selected song by passing song id in url
  });

  //Search by song name functionality
  $("#search button").on("click", function () {
    let searchSong = $("#searchbox").val().trim().toLowerCase();   
    if (searchSong.match(/^$/)) console.log("Empty");  //If empty search box , no navigation
    else {
      sessionStorage.setItem("section", "search");    //Store section selected as search in session variable
      window.location.href = "list.html?searchSong=" + searchSong;  //Pass user entered searched song name in url and navigate to result page 
    }
  });
});
