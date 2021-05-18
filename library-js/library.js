
 let selectedLang={}

$(document).ready(function () {

 selectedLang=sessionStorage.getItem("lang");
 if(selectedLang==="english"){
   $("#hindi-artists").hide()
   $("#marathi-artists").hide()
 }

 if(selectedLang==="hindi"){
  $("#english-artists").hide()
  $("#marathi-artists").hide()
}

if(selectedLang==="marathi"){
  $("#hindi-artists").hide()
  $("#english-artists").hide()
}
  if(selectedLang==="all")
  selectedLang={}

  
  console.log(selectedLang);
  $.ajax({
    type: "GET",
    url: "http://localhost:3000/albums",
    dataType: "json",
    data: { "trending":"yes",
            "language":selectedLang},
    async: true,
    success: function (data) {
      if (data.length === 0)
        console.log("Not found")

      else {
        let albumlist=""
        $.each(data, function (i, a) {
          var albumId = a.id;
          console.log(albumId)

                        albumlist +=`
                                        <div id=${albumId} class="card">
                                        <img class="card-img-top" src=${a.cover} alt="Card image cap">
                                        <h5 class="card-title">${a.name}</h5>
                                        <p class="card-text" style="font-size: 12px;">${a.artist}</p>
                                        </div>
      
                                    `
        })

        $("#albums").append(albumlist);
      }
    },
    error: function () {
      console.log("not able to process request");
    },
  });


  $("#albums").on("click",".card",function (e) {
    
      let aId=e.currentTarget.id;
      sessionStorage.setItem("selectedAlbum",aId)
      console.log(sessionStorage.getItem("selectedAlbum"))
      window.location.href="songlist.html"
  
})


$("#category .card").on("click",function () {
    
  let selectedSection=$(this).parent().attr('id')
  
  sessionStorage.setItem("section",selectedSection)
  console.log(sessionStorage.getItem("section"))
  sessionStorage.setItem("value",$(this).attr('id'))
  console.log(sessionStorage.getItem("value"))
  window.location.href="list.html"
})

  $("#artists .card").on("click",function () {
    
    let selectedSection=$(this).parent().parent().attr('id')
    
    sessionStorage.setItem("section",selectedSection)
    console.log(sessionStorage.getItem("section"))
    sessionStorage.setItem("value",$(this).attr('name'))
    console.log(sessionStorage.getItem("value"))
    window.location.href="list.html"
  
    // $.ajax({
    //   type: "GET",
    //   url: "http://localhost:3000/albums",
    //   dataType: "json",
    //   data: {"category": cat},
    //   async: true,
    //   success: function (data) {
    //     if (data.length === 0)
    //       console.log("Not found")
  
    //     else {
  
    //       $.each(data, function (i, v) {
    //         console.log(data)
  
  
    //       })
    //     }
    //   },
    //   error: function () {
    //     console.log("not able to process request");
    //   },
    // });

  })


          $.ajax({
             type: "GET",
              url: "http://localhost:3000/users/"+sessionStorage.getItem("id"),
              dataType: "json",
              async: true,
              success: function (user) {
                user=JSON.parse(JSON.stringify(user).replace("recentlyPlayed[]","recentlyPlayed"));
                $.each(user.recentlyPlayed,function(i,songId){

                  $.ajax({
                    type: "GET",
                    url: "http://localhost:3000/songs",
                    dataType: "json",
                    data: {"id":songId},
                    async: true,
                    success: function (data) {
                        console.log(data)
                        $.each(data, function (i, song) {
                          console.log("udshsd"+song)
                          $.ajax({
                             type: "GET",
                              url: "http://localhost:3000/albums",
                              dataType: "json",
                              data: {"id":song.album_id},
                              async: true,
                              success: function (data) {
                                let songlist="";
                                $.each(data, function (i, album) {
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
                                                    <img class="play-img" src="../library-assets/images/play.png" >
                                                    </div>
                                                    </div>
                                                `;
                                })
                                $("#recent").append(songlist);
              
                              },
              
                              error: function () {
                                console.log("not able to process request");
                              },
              
              
                          })
                    })
                     
                    },
                    error: function () {
                      console.log("not able to process request");
                    },
                  });
                })

              },

              error: function () {
                console.log("not able to process request");
              },


          })
    
          $(".song-container").on("click",".card",function (e) {
    
            let selectedSong=e.currentTarget.id;
            window.location.href="../ui_audio/audio.html?id="+selectedSong
      
          })
  
          $("#search button").on("click",function () {
    
            let searchSong=$("#searchbox").val().trim().toLowerCase();
            console.log(searchSong+searchSong)

            if(searchSong.match(/^$/))
              console.log("Empty")

            else{
            sessionStorage.setItem("section","search")
            window.location.href="list.html?searchSong="+searchSong
            }
      
          })
  
});


