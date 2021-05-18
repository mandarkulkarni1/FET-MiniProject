


$(document).ready(function () {

    let selectedLang={}
    selectedLang=sessionStorage.getItem("lang");
    
    if(selectedLang==="all")
    selectedLang={}

    console.log(selectedLang);

    var selectedCategory;
    if (sessionStorage.getItem("section") === "category") {
        $("#song-heading").hide();
        selectedCategory = sessionStorage.getItem("value")
        console.log(selectedCategory)

        $.ajax({
            type: "GET",
            url: "http://localhost:3000/albums",
            dataType: "json",
            data: { "category": selectedCategory ,
                    "language": selectedLang},
            async: true,
            success: function (albums) {
                if (albums.length === 0)
                    console.log("Not found")

                else {
                    let albumlist = ""
                    $.each(albums, function (i, a) {
                        var albumId = a.id;

                        albumlist += `
                                        <div id=${albumId} class="card">
                                        <img class="card-img-top" src=${a.cover} alt="Card image cap">
                                        <h5 class="card-title">${a.name}</h5>
                                        <p class="card-text" style="font-size: 12px;">${a.artist}</p>
                                        </div>
      
                                    `
                    })
                    $(".album-container").append(albumlist);
                }
            },
            error: function () {
                console.log("not able to process request");
            },
        });

    }


    if (sessionStorage.getItem("section") === "artists") {
        selectedArtist = sessionStorage.getItem("value")
        console.log(selectedArtist)
        $.ajax({
            type: "GET",
            url: "http://localhost:3000/albums",
            dataType: "json",
            async: true,
            success: function (albums) {
                if (albums.length === 0)
                    console.log("Not found")

                else {
                    let albumlist = "";
                    $.each(albums, function (i, a) {

                        $.ajax({
                            type: "GET",
                            url: "http://localhost:3000/songs",
                            dataType: "json",
                            async: true,
                            success: function (songs) {
                                if (songs.length === 0)
                                    console.log("Not found")

                                else {
                                    let songlist = ""
                                    $.each(songs, function (i, s) {
                                        if (s.artist.includes(selectedArtist) && a.id === s.album_id) {
                                            console.log(s.id)
                                            songlist += `
                                                    <div class="song">
                                                    <div id=${s.id} class="card">
                                                    <img class="card-img-top" src=${a.cover} alt="Card image cap">
                                                    <div class="card-body" style="text-align: left;">
                                                    <h5 class="card-title" style="margin:2px;">${s.name}</h5>
                                                    <p class="card-text" style="font-size: 12px;margin:2px;">Album : ${a.name}</p>
                                                    <p class="card-text" style="font-size: 12px;margin:2px;">Artist(s) : ${s.artist}</p>
                                                    <p class="card-text" style="font-size: 12px;margin:2px;">Duration : ${s.duration}</p>
                                                    </div>
                                                    <img class="play-img" src="../library-assets/images/play.png" >
                                                    </div>
                                                    </div>
                                                `;
                                        }
                                    })
                                    $(".song-container").append(songlist);
                                }
                            },
                            error: function () {
                                console.log("not able to process request");
                            },
                        });
                        if (a.artist.includes(selectedArtist)) {
                            var albumId = a.id;

                            albumlist += `  
                                            <div id=${albumId} class="card">
                                            <img class="card-img-top" src=${a.cover} alt="Card image cap">
                                            <h5 class="card-title">${a.name}</h5>
                                            <p class="card-text" style="font-size: 12px;">${a.artist}</p>
                                            </div>         
                                            
                                            `
                        }
                    })
                    $(".album-container").append(albumlist);
                }
            },
            error: function () {
                console.log("not able to process request");
            },
        });
    }



    $(".album-container").on("click",".card",function (e) {
    
        let selectedAlbum=e.currentTarget.id;
        sessionStorage.setItem("selectedAlbum",selectedAlbum);
        window.location.href="songlist.html"
  })

  $(".song-container").on("click",".card",function (e) {
    
    let selectedSong=e.currentTarget.id;
    console.log(e.currentTarget.id);
    //sessionStorage.setItem("selectedSong",selectedSong);
    //window.location.href="../ui_audio/audio.html"
    

    $.ajax({
        type: "GET",
        url: "http://localhost:3000/users/"+sessionStorage.getItem("id"),
        dataType: "json",
        async: true,
        success: function (user) {
            let userAddSong;
                            
             user=JSON.parse(JSON.stringify(user).replace("recentlyPlayed[]","recentlyPlayed"));

             if(user.recentlyPlayed.includes(selectedSong)){
                user.recentlyPlayed.splice(user.recentlyPlayed.indexOf(selectedSong),1)
                user.recentlyPlayed.unshift(selectedSong)
            }
           
            else if(user.recentlyPlayed.length<=5){
            user.recentlyPlayed.unshift(selectedSong)
                if(user.recentlyPlayed.includes("none"))
                user.recentlyPlayed.pop()
            
            }
            else{
            user.recentlyPlayed.unshift(selectedSong)
            user.recentlyPlayed.pop()
            }

            // // userAddSong=user
            // // console.log(user.recentlyPlayed)
            // // u=JSON.stringify(userAddSong)
           
            $.ajax({
        
                type: "PUT",
               url: "http://localhost:3000/users/"+sessionStorage.getItem("id"),
                dataType: "json",
                data: user,
                async: true,
                success: function () {
                    window.location.href="../ui_audio/audio.html?id="+selectedSong
               //    console.log(userAddSong)
               //    console.log(user)
                }})
            
        }})

        
})


if(sessionStorage.getItem("section")==="search"){
$("#album-heading").hide()
$.ajax({
    type: "GET",
    url: "http://localhost:3000/songs",
    dataType: "json",
    async: true,
    success: function (data) {
        const URLparams= new URLSearchParams(window.location.search);
        searchedSong=URLparams.get('searchSong')
        $.each(data, function (i, song) {
          if(song.name.toLowerCase()===searchedSong)
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
                $(".song-container").append(songlist);

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
}

})