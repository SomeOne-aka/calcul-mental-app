/// Confirm delete
function confirmDelete(type) {
    let targetType
    switch (type) {
        case "classe":
            targetType = "Êtes-vous sûr(e) de vouloir supprimer cette classe ?"
            break;
        case "exam":
            targetType = "Êtes-vous sûr(e) de vouloir supprimer cet examen ?"
            break;
        case "student":
            targetType = "Êtes-vous sûr(e) de vouloir supprimer cet élève ?"
            break;
    
        default:
            break;
    }
    let confirmDeleteEl = document.createElement("div")
    confirmDeleteEl.className = "confirm-box confirm-delete"
    confirmDeleteEl.innerHTML = `
        <i class="fa-solid fa-trash-can"></i>
        <p>${targetType}</p>
        <div class="btn-container">
            <button class="cancel-btn">Annuler</button>
            <button class="confirm-btn">Supprimer</button>
        </div>
    `
    document.body.appendChild(confirmDeleteEl)
    // Confirm Box Opac Screen
    let confirmBoxScreenEl = document.createElement('div')
    confirmBoxScreenEl.className = "confirm-box-screen"
    document.body.insertBefore(confirmBoxScreenEl,confirmDeleteEl)

    // get the confirm/cancel btn from delete 
    let cancelBtnEl = document.querySelector('.cancel-btn')
    let confirmboxScreen = document.querySelector('.confirm-box-screen')
    
    // Cancel delete action btn
    cancelBtnEl.addEventListener('click',  _ => {
        document.querySelector('.confirm-delete').remove()
        document.querySelector('.confirm-box-screen').remove()
    })
    confirmboxScreen.addEventListener('click', _ => {
        document.querySelector('.confirm-delete').remove()
        document.querySelector('.confirm-box-screen').remove()
    })  
}
