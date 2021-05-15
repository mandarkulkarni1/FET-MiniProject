$(document).ready(function () {

    var selectedCategory;
    if (sessionStorage.getItem("section") === "category") {
        $("#song-heading").hide();
        selectedCategory = sessionStorage.getItem("value")
        console.log(selectedCategory)

        $.ajax({
            type: "GET",
            url: "http://localhost:3000/albums",
            dataType: "json",
            data: { "category": selectedCategory },
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
                                                    <p class="card-text" style="font-size: 12px;margin:2px;">Artist : ${s.artist}</p>
                                                    </div>
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
    sessionStorage.setItem("selectedSong",selectedSong);
    window.location.href="../ui_audio/audio.html"
})


})