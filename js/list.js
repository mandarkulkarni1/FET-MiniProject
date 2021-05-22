$(document).ready(function () {

    let selectedLang = {}
    selectedLang = sessionStorage.getItem("lang");         //Get selected language from session variable

    if (selectedLang === "all")
        selectedLang = {}
  
    //If album category selected in library page
    if (sessionStorage.getItem("section") === "category") {   
        var selectedCategory;
        $("#song-heading").hide();
        selectedCategory = sessionStorage.getItem("value")         //Get selected category name

        $.ajax({                                              //Get albums as per selected category and language  
            type: "GET",
            url: "http://localhost:3000/albums",
            dataType: "json",
            data: {
                "category": selectedCategory,
                "language": selectedLang
            },
            async: true,
            success: function (albums) {
                if (albums.length === 0)
                    console.log("Not found")

                else {
                    let albumlist = ""
                    $.each(albums, function (i, a) {            //Display each album as card
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

    //If artist selected in library page
    if (sessionStorage.getItem("section") === "artists") {
        selectedArtist = sessionStorage.getItem("value")     //Get artist name from session variable
        $.ajax({                                               //Get albums as per selected language
            type: "GET",
            url: "http://localhost:3000/albums",
            dataType: "json",
            date:{ "language" : selectedLang},
            async: true,
            success: function (albums) {
                if (albums.length === 0)
                    console.log("Not found")

                else {
                    let albumlist = "";
                    $.each(albums, function (i, a) {        //Get all the songs

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
                                    $.each(songs, function (i, s) {    //Check if the selected artist is associated with the song and the song is assoiciated with album fetched
                                        if (s.artist.includes(selectedArtist) && a.id === s.album_id) {  
                                            songlist += `                           //                
                                                    <div class="song">
                                                    <div id=${s.id} class="card">
                                                    <img class="card-img-top" src=${a.cover} alt="Card image cap">
                                                    <div class="card-body" style="text-align: left;">
                                                    <h5 class="card-title" style="margin:2px;">${s.name}</h5>
                                                    <p class="card-text" style="font-size: 12px;margin:2px;">Album : ${a.name}</p>
                                                    <p class="card-text" style="font-size: 12px;margin:2px;">Artist(s) : ${s.artist}</p>
                                                    <p class="card-text" style="font-size: 12px;margin:2px;">Duration : ${s.duration}</p>
                                                    </div>
                                                    <img class="play-img" src="../assets/images/play.png" >
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



    $(".album-container").on("click", ".card", function (e) {

        let selectedAlbum = e.currentTarget.id;
        sessionStorage.setItem("selectedAlbum", selectedAlbum);
        window.location.href = "songlist.html"
    })

    $(".song-container,.album-song-container").on("click", ".card", function (e) {

        let selectedSong = e.currentTarget.id;
        $.ajax({
            type: "GET",
            url: "http://localhost:3000/users/" + sessionStorage.getItem("id"),
            dataType: "json",
            async: true,
            success: function (user) {
                let userAddSong;

                user = JSON.parse(JSON.stringify(user).replace("recentlyPlayed[]", "recentlyPlayed"));

                if (user.recentlyPlayed.includes(selectedSong)) {
                    user.recentlyPlayed.splice(user.recentlyPlayed.indexOf(selectedSong), 1)
                    user.recentlyPlayed.unshift(selectedSong)
                }

                else if (user.recentlyPlayed.length <= 5) {
                    user.recentlyPlayed.unshift(selectedSong)
                    if (user.recentlyPlayed.includes("none"))
                        user.recentlyPlayed.pop()

                }
                else {
                    user.recentlyPlayed.unshift(selectedSong)
                    user.recentlyPlayed.pop()
                }

                $.ajax({

                    type: "PUT",
                    url: "http://localhost:3000/users/" + sessionStorage.getItem("id"),
                    dataType: "json",
                    data: user,
                    async: true,
                    success: function () {
                        window.location.href = "audio.html?id=" + selectedSong
                    }
                })

            }
        })


    })


    if (sessionStorage.getItem("section") === "search") {
        $("#album-heading").hide()
        $.ajax({
            type: "GET",
            url: "http://localhost:3000/songs",
            dataType: "json",
            async: true,
            success: function (data) {
                const URLparams = new URLSearchParams(window.location.search);
                searchedSong = URLparams.get('searchSong')
                $.each(data, function (i, song) {
                    if (song.name.toLowerCase() === searchedSong)
                        $.ajax({
                            type: "GET",
                            url: "http://localhost:3000/albums",
                            dataType: "json",
                            data: { "id": song.album_id },
                            async: true,
                            success: function (data) {
                                let songlist = "";
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