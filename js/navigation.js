$(document).ready(function () {

    //Redirection to Profile page
    $('#userutton').click(function () {
      window.location.href = "../ui/profile.html"
    })
  
    //Tooltip activator
    $(document).ready(function () {
      $('[data-toggle="tooltip"]').tooltip();
    });
  
    //function to logout
    $('#logoutbutton').click(function () {
      sessionStorage.clear();
      window.location.replace('../Home.html');
    });
  
   });
  