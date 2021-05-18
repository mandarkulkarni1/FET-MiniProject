let songName;
let songImage;
let song_ID;
let songPath;

//...Autoplay 
document.addEventListener('DOMContentLoaded', () => {

  //...get the button
  let btn = document.querySelector('#btn');

  //...bind the click event
  btn.addEventListener('click', () => {}, false);

  //...trigger the click event on page enter
  btn.click();

}, false)

// add to fav songs

//wait for DOM ready...
document.addEventListener('DOMContentLoaded', () => {

  //...get the button
  let btn = document.querySelector('#btn');

  //...bind the click event
  btn.addEventListener('click', () => {}, false);

  //...trigger the click event on page enter
  btn.click();

}, false);
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
    appendToStorage("favsong", `<a href='${window.location.href}'><h4>${songName}</h4></a>`);
 }
 
 
 // get the song from db
$(document).ready(function () {

    
  $("body").on("load", function () {
    //songId=sessionStorage.getItem("selectedSong");
    const URLparams= new URLSearchParams(window.location.search);
    songId=URLparams.get('id');
    console.log(songId)
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
            songPath=song.path;
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
                    $('audio').append(`<source src="${song.path}" type="audio/ogg" />`);
                    $(".info h1").text(songName);
                    $(".info h2").text(song.artist);
                    songImage=album.cover;
                    console.log(songName)
                    // $(".audio1").append(s);
                    // for download option
                    $('#download').attr('href',`${song.path}`)
                    console.log(song.path)
                    let pathShare=song.path.substr(2);
                    $('#facebook').attr('href',`https://www.facebook.com/sharer.php?u=${window.location.href}`)
                    $('#whatsapp').attr('href',`https://api.whatsapp.com/send?phone=&text=${window.location.href}`)
                   
                  })

                },

                error: function () {
                  console.log("not able to process request");
                },


            })
    
            ;
        
        
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
      url: 'http://localhost:3000/playlists',
      data: JSON.stringify({ "id": songId, "name": songName, "path": songPath, "image":songImage,"userEmail": userEmail }),
      success: alert('Added to playlist'),
      contentType: "application/json",
      dataType: 'json'
    });
  });
   });

  
// changing the volume
   $("#volume-control").on("change",function(e){
    console.log(e.currentTarget.value)
    $("audio").prop("volume",e.currentTarget.value/100)
  })

//

$('#favsong').on('click',function(){

  document.getElementById('favmenu').innerHTML = "";
  let favSongList=localStorage.getItem('favsong');
  console.log(favSongList);
  $('#favmenu').append(favSongList);
})
 
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


//seekbar in control panel
///////////////////////////////////////////////////////////////////////////////////////

var audio = document.querySelectorAll('audio');
var playBtn = document.querySelectorAll('.play pause');
var seekBar = document.querySelectorAll('.seek-bar');
var fillBar = document.querySelectorAll('.fill');
var pointerdown = false;
var playing = undefined;

function handleSeekbar(e, i) {
  pointerdown = true;
  var vidDur = audio[i].duration;
  var seekCoords = Math.round(
    (e.clientX - seekBar[i].offsetLeft) *
      (vidDur / seekBar[i].clientWidth)
  );
  handleAudioPlayback(i, seekCoords);
  var p = getP(e, i);
  updateFillBar(i, p * 100);
}

function handleAudioPlayback(i, time) {
  if (playing !== i) {
    audio[playing].pause();
    playing = i;
  }
  var a = audio[i];
  if (pointerdown) {
    a.currentTime = time;
    a.play();
    pointerdown = false;
  } else if (a.paused) {
    a.play();
  } else {
    a.pause();
  }
}

function updateFillBar(i, val) {
  fillBar[i].style.width = val + '%';
}