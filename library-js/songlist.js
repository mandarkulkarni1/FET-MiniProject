
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
            
            console.log("http://localhost:3000/users/"+sessionStorage.getItem("id"))

            
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


})