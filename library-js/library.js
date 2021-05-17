
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
 //   data: { "trending":"yes",
 //           "language":selectedLang},
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


          /*        var arr=[];
                  $.each(v.artist,function (j, str){
                      arr.push(str.toLowerCase())
                      
                  })
                  console.log(arr)
  
              if(arr.includes("artist1")){
                 path=v.path;
                 console.log(v);}
                });
                
               $("#player").attr("src",v.path);
                */                       //Case insensitive search by artist


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
  

  
});


