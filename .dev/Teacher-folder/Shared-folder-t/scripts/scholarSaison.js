
function getScholarSaison() {
    let currentDate = new Date()
    let currentYear = currentDate.getFullYear()
    let currentMonth = currentDate.getMonth()

    if(currentMonth >= 7) {
        return `${currentYear}/${currentYear+1}`
    } else {
        return `${currentYear-1}/${currentYear}`
    }
}