
$(document).ready(function () {
        
    selectedAlbum=sessionStorage.getItem("selectedAlbum")

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

                        var albumHead=`
                            <img src=${a.cover}>
                            <h8>Album</h8>
                            <h3>${a.name}</h3>
                            <h5>${a.artist}</h5>
                        `
                        $(".album-header").append(albumHead);

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
                                                    <div id=${s.id} class="song">
                                                    <img src="../library-assets/images/play.png" >
                                                    <h5>${(i+1)+". "+s.name}</h5>
                                                    <h5 style="position:absolute ; left: 635px">${s.artist}</h5>
                                                    <h5 style="position:absolute ; right:30px">${s.duration}</h5>
                                                    
                                                    </div>
                                                    <hr>
                                                `;
                                    })
                                    $(".album-song-container").append(songlist);
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

        $(".album-song-container").on("click",".song",function (e) {
    
            let selectedSong=e.currentTarget.id;
            console.log(e.currentTarget.id);
            //sessionStorage.setItem("selectedSong",selectedSong);
            //window.location.href="../ui_audio/audio.html"
            window.location.href="../ui_audio/audio.html?id="+selectedSong
        })


})