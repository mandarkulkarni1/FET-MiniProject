let songName;
let songImage;
let song_ID;
// add to fav songs
function mySong() {

  localStorage.setItem("favsong", "");
  }
  function appendToStorage(name, data){
    var old = localStorage.getItem(name);
    if(old === null) old = "";
    localStorage.setItem(name, old + data);
    alert('Added to FavSong ')
  }
  function mySongOne() {
    appendToStorage("favsong", `<a href='${songName}'><h1>${songName}</h1></a>`);
 }
 
 
 // get the song from db
$(document).ready(function () {

    
  $("body").on("load", function () {
    let songId=sessionStorage.getItem("selectedSong");
    $.ajax({
      type: "GET",
      url: "http://localhost:3000/songs",
      dataType: "json",
      data: {"id":songId},
      async: true,
      success: function (data) {
          console.log(data)
          $.each(data, function (i, song) {
            console.log(song);
            songName=song.name;
            song_ID=song.id;
            albumId=song.album_id;
            let image = "";

            $.ajax({
               type: "GET",
                url: "http://localhost:3000/albums",
                dataType: "json",
                data: {"id":albumId},
                async: true,
                success: function (data) {
                  console.log(albumId)
                  $.each(data, function (i, album) {
                    image += `<div><img src=${album.cover} alt="3rdburglar by Wordburglar" /></div> `
                    $(".cover").append(image);
                    $('audio').append(`<source src=${song.path} type="audio/ogg" />`);
                    $(".info h1").text(songName);
                    $(".info h2").text(song.artist);
                    songImage-image;
                    console.log(songName)
                    // $(".audio1").append(s);
                    // for download option
                    $('#download').attr('href',`${song.path}`)
                    $('#facebook').attr('href')
                  })

                },

                error: function () {
                  console.log("not able to process request");
                },


            })
       //     album=data.image;
       //     let s="";
            ;
        // });
        
      })
       
      },
      error: function () {
        console.log("not able to process request");
      },
    });
  });


  $("body").trigger("load");
  
  // modal for share
  $('#myModal').on('shown.bs.modal', function () {
    $('#myInput').trigger('focus')
  })

  // AJAX Request to post song for add to playlist
   $('#playlist').on('click',function(){
    let userEmail=sessionStorage.getItem("id");
    $.ajax({
      type: 'POST',
      url: 'http://localhost:3000/playlist',
      data: JSON.stringify({ "id": songId, "title": songName, "image": songImage, "userEmail": userEmail }),
      success: alert('Added to playlist'),
      contentType: "application/json",
      dataType: 'json'
    });
  });
   });
  var player = $('.player'),
  audio = player.find('audio'),
  duration = $('.duration'),
  currentTime = $('.current-time'),
  progressBar = $('.progress span'),
  mouseDown = false,
  rewind, showCurrentTime;

function secsToMins(time) {
var int = Math.floor(time),
    mins = Math.floor(int / 60),
    secs = int % 60,
    newTime = mins + ':' + ('0' + secs).slice(-2);

return newTime;
}

function getCurrentTime() {
var currentTimeFormatted = secsToMins(audio[0].currentTime),
    currentTimePercentage = audio[0].currentTime / audio[0].duration * 100;

currentTime.text(currentTimeFormatted);
progressBar.css('width', currentTimePercentage + '%');

if (player.hasClass('playing')) {
  showCurrentTime = requestAnimationFrame(getCurrentTime);
} else {
  cancelAnimationFrame(showCurrentTime);
}
}

audio.on('loadedmetadata', function() {
var durationFormatted = secsToMins(audio[0].duration);
duration.text(durationFormatted);
}).on('ended', function() {
if ($('.repeat').hasClass('active')) {
  audio[0].currentTime = 0;
  audio[0].play();
} else {
  player.removeClass('playing').addClass('paused');
  audio[0].currentTime = 0;
}
});

$('button').on('click', function() {
var self = $(this);

if (self.hasClass('play-pause') && player.hasClass('paused')) {
  player.removeClass('paused').addClass('playing');
  audio[0].play();
  getCurrentTime();
} else if (self.hasClass('play-pause') && player.hasClass('playing')) {
  player.removeClass('playing').addClass('paused');
  audio[0].pause();
}

if (self.hasClass('shuffle') || self.hasClass('repeat')) {
  self.toggleClass('active');
}
}).on('mousedown', function() {
var self = $(this);

if (self.hasClass('ff')) {
  player.addClass('ffing');
  audio[0].playbackRate = 2;
}

if (self.hasClass('rw')) {
  player.addClass('rwing');
  rewind = setInterval(function() { audio[0].currentTime -= .3; }, 100);
}
}).on('mouseup', function() {
var self = $(this);

if (self.hasClass('ff')) {
  player.removeClass('ffing');
  audio[0].playbackRate = 1;
}

if (self.hasClass('rw')) {
  player.removeClass('rwing');
  clearInterval(rewind);
}
});

player.on('mousedown mouseup', function() {
mouseDown = !mouseDown;
});

progressBar.parent().on('click mousemove', function(e) {
var self = $(this),
    totalWidth = self.width(),
    offsetX = e.offsetX,
    offsetPercentage = offsetX / totalWidth;

if (mouseDown || e.type === 'click') {
  audio[0].currentTime = audio[0].duration * offsetPercentage;
  if (player.hasClass('paused')) {
    progressBar.css('width', offsetPercentage * 100 + '%');
  }
}
});



/* Set the width of the side navigation to 250px */
function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
}

/* Set the width of the side navigation to 0 */
function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}