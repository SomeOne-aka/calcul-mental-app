let teacherProfile = JSON.parse(localStorage.getItem('teacherProfile'))
let classes = JSON.parse(localStorage.getItem('classes'))
let exams = JSON.parse(localStorage.getItem('exams'))

if(!(teacherProfile && classes && exams)) {
    pageSuccessionScreenAlert("Pour accéder aux statistiques de vos examens, il est préalablement nécessaire d'enregistrer des examens.")
} else {

//! increment numberOfVisitsTeacherPages
let numberOfVisitsTeacherPages = JSON.parse(localStorage.getItem('numberOfVisitsTeacherPages'))
if(numberOfVisitsTeacherPages) {
    numberOfVisitsTeacherPages++
    localStorage.setItem('numberOfVisitsTeacherPages', numberOfVisitsTeacherPages)
} else {
    localStorage.setItem('numberOfVisitsTeacherPages', 1)
}

//! get students info and exams from LS
let exams = Array.from(JSON.parse(localStorage.getItem('exams')) || [])?.filter(exam => exam.settings) ?? []
let classes = JSON.parse(localStorage.getItem('classes')) ?? []
let studentsInfoLack = []
classes.forEach(classe => {
    classe?.classStudents?.forEach(student => studentsInfoLack.push(student))
});

let examsContainerEl = document.querySelector('.stg-container')
exams.forEach(exam => {
    //! exam data
    let examName = exam.examName
    let examOperations = exam.settings.operation.join(", ")
    let examTables = exam.settings.table.join(', ')
    let examQuestionNumber = exam.settings.questionNumber
    let examLevelsArr = []
    if(exam.settings.classes.length > 0) {
        exam.settings.classes.forEach(examClasseId => {
            examLevelsArr.push(classes.find(classe => classe.classId == examClasseId).className)
        })
    } else {
        examLevelsArr = ["Elèves spécifiques"]
    }
    let examLevels = examLevelsArr.join(', ')
    let examCompleted= exam.status.completed

    let rows = []
    //! get table rows data 
    if(exam.settings.classes.length > 0) {
        let examClassesIds = exam.settings.classes
        let examStudentsInfoLack = studentsInfoLack.filter(studentInfo => examClassesIds.includes(studentInfo.studentClassId) )
        let examStudentsPassed = exam.settings.students

        examStudentsInfoLack.forEach(examStudentInfo => {
            let studentFullName = examStudentInfo.studentFirstName + " " + examStudentInfo.studentLastName
            let codeMassar = examStudentInfo.studentId

            let passedStudent = examStudentsPassed.find(studentPassed => studentPassed.studentId == examStudentInfo.studentId) 

            let totalScore = passedStudent?.score?.reduce((sum, scoreObj) => sum + scoreObj.quizScore , 0) 
            let examScore = totalScore !== undefined ? totalScore / passedStudent?.score?.length: ""
            let totalFullTime = passedStudent?.score?.reduce((sum, scoreObj) => sum + scoreObj.fullTime , 0) 
            let examFullTime = totalFullTime !== undefined ? Math.round(totalFullTime / passedStudent?.score?.length / 1000) : ""
            let examFinalNote 
            if(examScore !== "" || examFullTime !== "") {
                examFinalNote = calculateFinalNoteWithDuration(examFullTime * 1000, examQuestionNumber, examScore) 

                if(examScore % 1 !== 0) {
                    examScore = Number(examScore).toFixed(2)
                }

                if(examFinalNote < 0) examFinalNote = 0

            } else {
                examFinalNote = ""
            }

            rows.push([codeMassar, studentFullName, examScore, examFullTime, examFinalNote])

        })

    } else {
        let examSignedStudents = exam?.settings?.students
        let examStudentsInfoLack = studentsInfoLack.filter(studentInfo => examSignedStudents?.some(examStudent => examStudent.studentId == studentInfo.studentId))
        
        examStudentsInfoLack.forEach(examStudentInfo => {
            let studentFullName = examStudentInfo.studentFirstName + " " + examStudentInfo.studentLastName
            let codeMassar = examStudentInfo.studentId
            
            let passedStudent = examSignedStudents.find(studentPassed => studentPassed.studentId == examStudentInfo.studentId) 

            let totalScore = passedStudent?.score?.length > 0 ? passedStudent?.score?.reduce((sum, scoreObj) => sum + scoreObj.quizScore , 0) : undefined
            let examScore = totalScore !== undefined ? totalScore / passedStudent?.score?.length : ""
            let totalFullTime = passedStudent?.score?.length > 0 ? passedStudent?.score?.reduce((sum, scoreObj) => sum + scoreObj.fullTime , 0) : undefined
            let examFullTime = totalFullTime !== undefined ? Math.round(totalFullTime / passedStudent?.score?.length / 1000) : ""
            let examFinalNote 
            if(examScore !== "" || examFullTime !== "") {
                examFinalNote = calculateFinalNoteWithDuration(examFullTime * 1000, examQuestionNumber, examScore) 

                if(examScore % 1 !== 0) {
                    examScore = Number(examScore).toFixed(2)
                }

            } else {
                examFinalNote = ""
            }

            rows.push([codeMassar, studentFullName, examScore, examFullTime, examFinalNote])

        })
    }

    //! UI
    // exam analytics container parts
    let examAnalyticsContainerEl = document.createElement('div')
    examAnalyticsContainerEl.classList.add('exam-analytics-container')

    let examAnalyticsTitleEl = document.createElement('div')
    examAnalyticsTitleEl.classList.add('exam-analytics-title')

    let examAnalyticsTableEl = document.createElement('table')
    examAnalyticsTableEl.classList.add('exam-analytics-table')


    //! populate exam analytics parts
    examAnalyticsTitleEl.innerHTML = `
        <span>Examen: </span> 
        <span>${examOperations}. </span>
        <span>${examTables}</span>
        <span>-${examLevels}-  </span>
        <span>"${examName}"  </span>
        <span><i class="fa-solid ${ examCompleted ? "fa-circle-check" : "fa-hourglass-start"}"></i></span>
    `
    examAnalyticsTableEl.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Code Massar</th>
                    <th>Le nom complet</th>
                    <th>Le score (/${examQuestionNumber})</th>
                    <th>La durée (s)</th>
                    <th>La note finale</th>
                </tr>
            </thead>

        </table>
    `
    let tbodyEl = document.createElement('tbody')
    rows.forEach(row => {
        let rowEl = document.createElement('tr')
        row.forEach(cell => {
            let cellEl = document.createElement('td')
            cellEl.innerHTML = `
                <td>${cell}</td>
            `
            rowEl.appendChild(cellEl)
        })
        tbodyEl.appendChild(rowEl)
    })
    examAnalyticsTableEl.appendChild(tbodyEl)

    //! Append elements to the page container
    let analyticsContainerEl = document.querySelector('.stg-container')
    examAnalyticsContainerEl.appendChild(examAnalyticsTitleEl)
    examAnalyticsContainerEl.appendChild(examAnalyticsTableEl)
    analyticsContainerEl.appendChild(examAnalyticsContainerEl)

})

}