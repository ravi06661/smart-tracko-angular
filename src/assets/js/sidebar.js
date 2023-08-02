var mini = true;

function toggleSidebar() {
  if (mini) {
    console.log("opening sidebar");
    document.getElementById("mySidebar").style.width = "300px";
    document.getElementById("mySidebar").style.position = "fixed";
    this.mini = false;
  } else {
    console.log("closing sidebar");
    document.getElementById("mySidebar").style.width = "70px";
    // document.getElementById("main").style.marginLeft = "70px";
    document.getElementById("mySidebar").style.position = "fixed";
    this.mini = true;
  }
}
