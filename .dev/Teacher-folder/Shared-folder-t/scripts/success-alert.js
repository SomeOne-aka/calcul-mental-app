function successAlert(type) {
    let targetType
    switch (type) {
        case "classe":
            targetType = "La classe a été ajoutée avec succès."
            break;
        case "exam":
            targetType = "L'examen a été ajouté avec succès."
            break;
        case "student":
            targetType = "L'élève a été ajouté avec succès."
            break;
        case "students":
            targetType = "Les élèves ont été ajoutés avec succès."
            break;
        case "student-delete":
            targetType = "L'élève a été supprimé avec succès."
            break;
        default:
            break;
    }

    
    let successAlertEl = document.createElement("div")
    successAlertEl.className = "alert-box success-alert"
    successAlertEl.innerHTML = `
        <span><i class="fa-solid fa-check"></i></span>
        <span>${targetType}</span>
    `
    document.body.appendChild(successAlertEl)
}