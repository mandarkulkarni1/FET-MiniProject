$(document).ready(function () {

    //Get selected album id from session storage
    selectedAlbum = sessionStorage.getItem("selectedAlbum")
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

                $.each(albums, function (i, a) {   //Get and display album info

                    var albumHead = `
                            <img src=${a.cover}>
                            <h8>Album</h8>
                            <h3><b>${a.name}</b></h3>
                            <h5>${a.artist}</h5>
                        `
                    $(".album-header").append(albumHead);

                    var albumId = a.id;
                    $.ajax({                                              //Get and display all the songs of the album and their info
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
                                    songlist += `
                                                    <div id=${s.id} class="song">
                                                    <img class="play" src="../assets/images/play.png" >
                                                    <h5>${(i + 1) + ". " + s.name}</h5>
                                                    <h5 class="artists">${s.artist}</h5>
                                                    <h5 class="duration">${s.duration}</h5>
                                                    
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

    //On selecting a song
    $(".album-song-container").on("click", ".song", function (e) {

        let selectedSong = e.currentTarget.id;

        $.ajax({
            type: "GET",
            url: "http://localhost:3000/users/" + sessionStorage.getItem("id"),
            dataType: "json",
            async: true,
            success: function (user) {       //Store the song in recently played

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
                        window.location.href = "audio.html?id=" + selectedSong //Navigate to audio player

                    }
                })

            }
        })
    })
})