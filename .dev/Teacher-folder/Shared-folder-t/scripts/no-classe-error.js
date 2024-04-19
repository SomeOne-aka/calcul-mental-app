/// No classe alert
function noClasseAlert() {

    let message = "Vous n'avez pas encore saisi de classe. Veuillez procéder à l'enregistrement de vos classes avant de poursuivre."

    let noClasseAlertEl = document.createElement("div")
    noClasseAlertEl.className = "confirm-box confirm-delete"
    noClasseAlertEl.innerHTML = `
        <i class="fa-solid fa-triangle-exclamation"></i>
        <p>${message}</p>
        <div class="btn-container">
            <button class="confirm-btn class-redirect">Classes</button>
        </div>
    `
    document.body.appendChild(noClasseAlertEl)
    // Confirm Box Opac Screen
    let noClasseAlertScreenEl = document.createElement('div')
    noClasseAlertScreenEl.className = "confirm-box-screen"
    document.body.insertBefore(noClasseAlertScreenEl,noClasseAlertEl)

    // Logic
    let confirmBtnEl = noClasseAlertEl.querySelector('.confirm-btn')
    confirmBtnEl.addEventListener('click', _ => {
        confirmBtnEl.remove()
        noClasseAlertScreenEl.remove()
        window.location.href = "../Class_student_management-page/index.html"
    })
    noClasseAlertScreenEl.addEventListener('click', _ => {
        confirmBtnEl.remove()
        noClasseAlertScreenEl.remove()
        window.location.href = "../Class_student_management-page/index.html"    
    })
}
