let loginFormEl = document.querySelector('.login-form')
let classTabsContainerEl = document.querySelector('.class-tabs-container')
let studentTabsContainerEl = document.querySelector('.student-tabs-container')
let submitBtnEl = document.querySelector('#submit-btn')


let exams = JSON.parse(localStorage.getItem('exams'))

let activeExam = exams?.find(exam => exam?.status?.active == true)

//! Hide login form if no active exams

if(!activeExam) {
    loginFormEl.outerHTML = `
        <div class="no-active-exam-screen">
            <h2 class="no-active-exam">Aucun examen n'est actuellement active</h2>
        </div>
    `
}

//!!!! Get the classes from active Exam and dispaly them and add interactivity

let multipleTentative = activeExam?.settings?.multipleTentative == "oui" ? true : false

let classesIds = activeExam?.settings?.classes;

let classes = []

classesIds?.forEach(classId => {
    let classe = JSON.parse(localStorage.getItem('classes')).find(classe => classe.classId == classId)
    classes.push(classe)
});

let studentsPool = [] // from classes/students object

JSON.parse(localStorage.getItem('classes'))?.forEach(classe =>{
    studentsPool = studentsPool.concat(classe.classStudents)
})


//! Display specific students
if(classes.length == 0) {
    studentTabsContainerEl.innerHTML = ""

    let studentsPre = activeExam?.settings?.students

    let students = []

    

    if (multipleTentative) {
        studentsPre.forEach(studentPre => {

            let studentId = studentPre.studentId
    
            let student = Object.assign({}, studentsPool.find(studentInfo => studentInfo.studentId == studentId));
    
            student.tentatives = studentPre.score.length
    
            students.push(student)
    
        })

        

    } else {
        studentsPre?.forEach(studentPre => {
            if(studentPre?.score?.length == 0) {

            let studentId = studentPre.studentId

            let student = Object.assign({}, studentsPool.find(studentInfo => studentInfo.studentId === studentId));

            students.push(student)
            }
        })
    }

    displayStudentsAndLogic(students)
    
}


else {
    //! display students by class
    classes?.forEach(classe => {
        classTabsContainerEl.style.padding = ".6rem .3rem"
        classTabsContainerEl.innerHTML += `
            <div class="class-tab" data-className="${classe.className}" data-classId="${classe.classId}">${classe.className}</div>
        `
    });

    let classTabEls = document.querySelectorAll('.class-tab')

    classTabEls?.forEach(classTabEl => {
        classTabEl.addEventListener('click', _ => {
            
            studentTabsContainerEl.innerHTML = ""

            classTabEls.forEach(classTabEl => classTabEl.classList.remove('selected-class'))
            classTabEl.classList.add('selected-class')

            let classId = classTabEl.getAttribute('data-classid')
            let classe = classes?.find(classe => classId == classe.classId)

            let studentsPre = activeExam?.settings?.students

            let classeStudents = classe?.classStudents

            let students = []

            if (multipleTentative) {
                
                students = classeStudents.map(classeStudent => {
                    const studentScores = studentsPre.find(studentPre => studentPre.studentId == classeStudent.studentId)?.score || [];
                    classeStudent.tentatives = studentScores.length || 0;
                    return classeStudent
                  });
                  

                
            } else {

                
                students = classeStudents.filter(classeStudent =>
                    !studentsPre.some(studentPre => studentPre.studentId == classeStudent.studentId)
                  )

            }

            displayStudentsAndLogic(students)
            
        })
    })
}




function displayStudentsAndLogic(students) {
    students.forEach(student => {
        studentFullName = `${student.studentFirstName} ${student.studentLastName}`
        
        studentTabsContainerEl.innerHTML += `
            <div class="student-tab" data-studentId="${student.studentId}" >
                <span ${student.tentatives !== undefined ? 'class="tentatives-element"' : "" }  data-tentatives="${student.tentatives}">${studentFullName}</span>
                <span>${student.studentId}</span>
            </div>
        `
        })
    
        //!!!! When selecting student 
        let studentTabEls = document.querySelectorAll('.student-tab')
    
        studentTabEls.forEach(studentTabEl => {
            studentTabEl.addEventListener('click', _ => {
                studentTabEls.forEach(studentTabEl => studentTabEl.classList.remove('selected-student'))
                studentTabEl.classList.add('selected-student')
    
                submitBtnEl.style.display = "block"
    
                let studentId = studentTabEl.getAttribute('data-studentId')
    
                submitBtnEl.addEventListener('click', e => {
                    const params = new URLSearchParams()
                    params.append('student-id', studentId)
                    params.append('exam-id', activeExam.examId)
                    params.append('from-login-page', true)

                    const queryString = params.toString()
    
                    const URLPath = new URL("./.dev/Student-folder/Quiz-page/index.html", window.location.href).href
                    const url = URLPath + "?" + queryString
                    window.location.href = url
                })
            })
        })
    
}


