$(document).ready(function () {
        
        selectedAlbum = sessionStorage.getItem("selectedAlbum")
        console.log(selectedAlbum)
        $.ajax({
            type: "GET",
            url: "http://localhost:3000/albums",
            dataType: "json",
            data: { "id": selectedAlbum },
            async: true,
            success: function (albums) {
                if (albums.length === 0)
                    console.log("Not found")

                else {
                    
                    $.each(albums, function (i, a) {
                        var albumId = a.id;
                        $.ajax({
                            type: "GET",
                            url: "http://localhost:3000/songs",
                            dataType: "json",
                            data: { "album_id": albumId },
                            async: true,
                            success: function (songs) {
                                if (songs.length === 0)
                                    console.log("Not found")

                                else {
                                    let songlist = ""
                                    $.each(songs, function (i, s) {
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
                                    })
                                    $(".song-container").append(songlist);
                                }
                            },
                            error: function () {
                                console.log("not able to process request");
                            },
                        });
                    })
                }
            },
            error: function () {
                console.log("not able to process request");
            },
        });

})