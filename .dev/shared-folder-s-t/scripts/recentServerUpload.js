//! Upload diagnostics to server
function recentServerUpload() {
  let recentDate = JSON.parse(localStorage.getItem("recentDate"));
  let currentDate = Date.now();

  if (recentDate) {
    let delayInDays = 15;

    let delay = 1000 * 60 * 60 * 24 * delayInDays;

    if (currentDate > recentDate + delay) {
      console.log("currentDate > recentDate + delay");
      uploadAppDiagnosticsToServer();
      localStorage.setItem("recentDate", JSON.stringify(currentDate));
    }
  } else {
    uploadAppDiagnosticsToServer();
    localStorage.setItem("recentDate", JSON.stringify(currentDate));
  }
}
