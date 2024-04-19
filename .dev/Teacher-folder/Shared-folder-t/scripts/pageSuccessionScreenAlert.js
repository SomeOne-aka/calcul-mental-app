function pageSuccessionScreenAlert(message) {
    const workArea = document.querySelector('.work-area')

    let screenAlertEl = document.createElement('div')
    screenAlertEl.classList.add("page-succession-screen-alert")
    screenAlertEl.innerHTML = `
        <i class="fa-solid fa-circle-exclamation"></i>
        <h2 class="page-succession-alert-message">${message}</h2>
    `
    workArea.appendChild(screenAlertEl)
}