function toggleDashboard() {
  const CL = "collapsed";
  const dashboard = document.getElementById("dashboard");
  if (dashboard.classList.contains(CL)) {
    dashboard.classList.remove(CL);
  } else {
    dashboard.classList.add(CL);
  }
}