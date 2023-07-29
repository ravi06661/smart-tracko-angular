$(document).ready(function(){
  $(".right_menu_toggle").click(function(){
    $(".main").toggleClass("shrink");
    $(".sidepanel").toggleClass("show");
    $(".right_menu_toggle").toggleClass("close");
    $(".porfile_sec").toggleClass("hide");
  });
});