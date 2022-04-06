function toggleDashboard() {
  const CL = "collapsed";
  const CP = "pushed";
  const dashboard = document.getElementById("dashboard");
  const thePlay = document.getElementById("the-play");
  if (dashboard.classList.contains(CL)) {
    dashboard.classList.remove(CL);
    thePlay.classList.add(CP);
  } else {
    dashboard.classList.add(CL);
    thePlay.classList.remove(CP);
  }
}