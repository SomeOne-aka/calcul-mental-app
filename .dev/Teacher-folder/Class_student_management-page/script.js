//! Check if the teacher profile is already set if not return

let teacherProfile = JSON.parse(localStorage.getItem('teacherProfile'))

if(!teacherProfile) {
    pageSuccessionScreenAlert("Tout d'abord, il est requis de remplir le formulaire présent sur la page de l'enseignant.")
} else {



//! increment numberOfVisitsTeacherPages
let numberOfVisitsTeacherPages = JSON.parse(localStorage.getItem('numberOfVisitsTeacherPages'))
if(numberOfVisitsTeacherPages) {
    numberOfVisitsTeacherPages++
    localStorage.setItem('numberOfVisitsTeacherPages', numberOfVisitsTeacherPages)
} else {
    localStorage.setItem('numberOfVisitsTeacherPages', 1)
}

/// class Class & Student 

class Class {
    constructor(className, classId) {
        this.className = className
        this.classId = classId
        this.classStudents = []
    }
}

class Student {
    constructor(studentLastName, studentFirstName, studentId, studentClassId) {
        this.studentLastName = studentLastName
        this.studentFirstName = studentFirstName
        this.studentId = studentId
        this.studentClassId = studentClassId
    }
}

let classId


// DomContentLoaded
// Populate class tabs from LS
let classTabsContainerEl = document.querySelector('.tabs-container')
let classes = JSON.parse(localStorage.getItem('classes'))

// Genearte classes tabs from LS
classes?.forEach(classe => {
    // Apply Style on class tabs when retrieving from LS
    addClassTab(classe.className, classe)
});




// Aplly style on tabs on DOM Content loaded
styleStgTabs(document.querySelectorAll('.stg-tab'))

revealAndFillClassTabContent()

// Ajouter une classe Click
let classNameInputEl = document.querySelector('#add-stg-input')
let addClassBtnEl = document.querySelector('#add-stg-btn')

addClassBtnEl.addEventListener('click', _ => {
    addClassLogic()
})
classNameInputEl?.addEventListener('keypress', event => {
    if (event.key === "Enter") {
    addClassLogic()
    }
})


//! Functions

// Add Class logic
function addClassLogic() {
    if(classNameInputEl.value) {
        createAndStoreClassAndAddAndStyleClassTab(classNameInputEl.value)
        successAlert(addClassBtnEl.dataset.type)
        revealAndFillClassTabContent()
        classNameInputEl.value = ""
    }
    return;
}

// Create Class instance + Store Class in LS
function createAndStoreClassAndAddAndStyleClassTab(className) {
    // Instantiate the class object
    let classInstance = new Class(className.toUpperCase(), uniqueid(12))

    addClassTab(className, classInstance)

    // Updated Apply Style on class tabs when adding a new class to tab
    styleStgTabs(document.querySelectorAll('.stg-tab'))


    // Store the class object in the LS
    // Check if classes array exists in local storage
    if (localStorage.getItem('classes')) {
        // Get classes array from local storage
        const classes = JSON.parse(localStorage.getItem('classes'));
        // Push new data to classes array
        classes.push(classInstance);
        // Store updated classes array in local storage
        localStorage.setItem('classes', JSON.stringify(classes));
    } else {
        // Create classes array
        const classes = [];
        // Push new data to classes array
        classes.push(classInstance);
        // Store classes array in local storage
        localStorage.setItem('classes', JSON.stringify(classes));
    }

}

// Reveal & fill class(form+table) when classe tab clicked
function revealAndFillClassTabContent() {
    let classTabsEls = document.querySelectorAll(".stg-tab")
    let classContainer = document.querySelector('.stg-container')


    // Clicked classTab
    classTabsEls?.forEach(classTabEl => {
        classTabEl.addEventListener('click', _ => {
            // ClassId of clicked class tab
            classId = classTabEl.getAttribute('data-classid')

            // Empty the class container
            classContainer.innerHTML = ""
            // Add the class-inner-container
            let classInnerContainer = document.createElement('div')
            classInnerContainer.classList.add('stg-inner-container')
            classContainer.appendChild(classInnerContainer)
            //! show/hide eye icon
            let eyeEl = document.createElement("i")
            eyeEl.classList.add('fa-solid','fa-eye', 'show-hide-eye-icon')
            eyeEl.addEventListener('click', _ => {
                if(eyeEl.classList.contains('fa-eye')) {
                    eyeEl.classList.remove('fa-eye')
                    eyeEl.classList.add('fa-eye-slash')
                    classInnerContainer.classList.add('hide-classe-inputs')
                } else {
                    eyeEl.classList.add('fa-eye')
                    eyeEl.classList.remove('fa-eye-slash')
                    classInnerContainer.classList.remove('hide-classe-inputs')
                }
            })
            classInnerContainer.appendChild(eyeEl)
            //! Reveal Form
            let formEl = document.createElement('form')
            formEl.classList.add('class-form')
            formEl.setAttribute('autocomplete', 'false')
            formEl.innerHTML = `
                <!-- <input autocomplete="false" name="hidden" type="text" style="display:none;"> -->
                <div class="student-input-container">
                    <label for="first-name-input">Prénom:</label>
                    <input required type="text" name="first-name-input" id="first-name-input" placeholder="Prénom de l'élève">
                </div>
                <div class="student-input-container">
                    <label for="last-name-input">Nom:</label>
                    <input required type="text" name="last-name-input" id="last-name-input" placeholder="Le nom de l'élève">
                </div>
                <div class="student-input-container">
                    <label for="student-id-input">Numéro d'inscription:</label>
                    <input required type="text" name="student-id-input" id="student-id-input" placeholder="Code Massar de l'élève ">
                </div>
                <div class="submit-student-btn-container">
                    <button class="submit-student-btn" data-type="student">Enregistrer</button>
                </div>
            `
            formEl.addEventListener('submit', e => {
                e.preventDefault(),
                formEl.reset()
            })
            classInnerContainer.appendChild(formEl)

            //! Reveal and Fill Table from LS
            let tableEl = document.createElement('table')
            tableEl.classList.add('class-table')
            tableEl.innerHTML = `
            <table class="class-table">
                <thead>
                    <tr>
                        <th>Prénom</th>
                        <th>Nom</th>
                        <th>Numéro d'inscription</th>
                        <th></th>
                    </tr>
                </thead>

            </table>
            `
            //! Populate the table from LS(students array)
            fillTable(tableEl)

            classInnerContainer.appendChild(tableEl)

            //! Display action Btns: upload students from excel, remove all students
            let actionBtnsEl = document.createElement('div')
            actionBtnsEl.classList.add('action-btns')
            actionBtnsEl.innerHTML = `
            <button class="delete-classe">Supprimer la classe</button>
            <label class="upload-classe" for="studentsFromExcel">Importer des élèves via Excel</label>
            <input type="file" name="studentsFromExcel" id="studentsFromExcel">            `
            classInnerContainer.appendChild(actionBtnsEl)

            //! Logic delete current classe
            deleteClasse(classId)

            //! Logic upload students from excel file
            uploadStudentsFromExcelAndSaveInLS()

            //! Delete student action
            deleteStudent(tableEl)

            //! Save new student
            let saveNewStudentBtnEl = document.querySelector('.submit-student-btn')
            saveNewStudentBtnEl.addEventListener('click', e => {
                let firstNameEl = document.getElementById('first-name-input')
                let lastNameEl = document.getElementById('last-name-input')
                let studentIdEl = document.getElementById('student-id-input')

                let firstName = toFirstLetterCapitalyze(firstNameEl.value)
                let lastName = toFirstLetterCapitalyze(lastNameEl.value)
                let studentId = studentIdEl.value.toUpperCase()

                //! Check the inputs and sanityze them
                if(firstName=="" || lastName=="" || studentId=="") return;

                //! GET the selected class from the LS
                // get the classId of clicked tab
                classId = classTabEl.getAttribute('data-classid')
                // Fetch the classes object from LS
                let classes = JSON.parse(localStorage.getItem('classes'))
                // retrieve a specific classe from the classes array based on the classId
                let classe = classes.find(classItem => classItem.classId == classId)
                // get the class students
                let { classStudents } = classe

                //! Save the new student in the LS
                let newStudent = new Student(lastName, firstName, studentId, classId)
                classStudents.push(newStudent) // the student array inside the classe object of the classes array is modified (update by reference)
                localStorage.setItem('classes', JSON.stringify(classes))
                
                //! Update the table
                fillTable(tableEl)

                //! student added success alert
                successAlert("student")
            })


    })
})
}


// Adding class tab after creating a new classe && for displaying classes got from LS
function addClassTab(className, classInstance) {
    if(!className) return
    else classTabsContainerEl.innerHTML += `
        <li class="stg-tab" data-classid="${classInstance.classId}">${className.toUpperCase()}</li>
    `
}

// 
function fillTable(tableEl) {
    if (document.getElementsByTagName('tbody')[0]) {
        tableEl.removeChild(document.getElementsByTagName('tbody')[0])
    }

    //! GET the selected class from the LS
    // get the classId of clicked tab
    let classId = document.querySelector('.stg-tab.active').getAttribute('data-classid')
    // Fetch the classes object from LS
    let classes = JSON.parse(localStorage.getItem('classes'))
    // retrieve a specific classe from the classes array based on the classId
    let classe = classes.find(classItem => classItem.classId == classId)
    // get the class students
    let { classStudents } = classe

    let tbodyEl = document.createElement('tbody')
    classStudents?.forEach(student => {
        let trEl = document.createElement('tr')
        trEl.innerHTML = `
        <td>${student.studentFirstName}</td>
        <td>${student.studentLastName}</td>
        <td>${student.studentId}</td>
        <td><i class="fa-solid fa-trash delete-student-btn" data-type="student" data-studentId="${student.studentId}"></i></td>
        `
        tbodyEl.appendChild(trEl)
    })
    tableEl.appendChild(tbodyEl)

    //! Delete student action
    deleteStudent(tableEl)
}

// delete student (update)
function deleteStudent(tableEl) {    
    let deleteStudentBtnEls = document.querySelectorAll('.delete-student-btn')
    deleteStudentBtnEls?.forEach(deleteEl => {
        deleteEl.addEventListener('click', _ => {
            confirmDelete("student")

            // Confirm delete action btn
            let confirmBtnEl = document.querySelector('.confirm-btn')
            confirmBtnEl.addEventListener('click',  _ => {

                // let studentId = deleteEl.parentElement.previousElementSibling.textContent.trim()
                let studentId = deleteEl.dataset.studentid
                // Update the LS
                let activeClassTab = document.querySelector('.stg-tab.active')
                let classId = activeClassTab.dataset.classid
                // Fetch the classes object from LS
                let classes = JSON.parse(localStorage.getItem('classes'))
                // retrieve a specific classe from the classes array based on the classId
                let classe = classes.find(classItem => classItem.classId == classId)
                // get the class students
                let { classStudents } = classe
                // find the student index and splice the classStudents array
                let studentToRemoveIndex  = classStudents.findIndex(student => student.studentId == studentId)
                classStudents.splice(studentToRemoveIndex, 1)
                // update the local storage
                localStorage.setItem('classes', JSON.stringify(classes))
                
                // Remove alert box + opac screen
                document.querySelector('.confirm-delete').remove()
                document.querySelector('.confirm-box-screen').remove()
                
                // Display the updated table
                fillTable(tableEl)

                //! delete student success alert
                successAlert("student-delete")

                //! delete students data in: students Array(in exam) + records 
                let exams = JSON.parse(localStorage.getItem("exams"))
                let updatedExams = exams.map(exam => {
                    if (Array.isArray(exam?.settings?.students)) {
                        exam.settings.students = exam.settings?.students?.filter(examStudents => examStudents.studentId !== studentId)
                    }
                    return exam
                })
                localStorage.setItem("exams", JSON.stringify(updatedExams))
                

                let records = JSON.parse(localStorage.getItem('records'))
                let updatedRecords = records.filter(record => record.studentId !== studentId)
                localStorage.setItem('records', JSON.stringify(updatedRecords))

            })  
        })
    })
}

function deleteClasse(classId) {
    let deleteClassetnEl = document.querySelector('.delete-classe')
    deleteClassetnEl.addEventListener('click', _ => {

        confirmDelete("classe")

        let confirmBtnEl = document.querySelector('.confirm-btn')
        confirmBtnEl.addEventListener('click',  _ => {

            let classes = JSON.parse(localStorage.getItem('classes')) ?? []
            classes = classes.filter(classe => classe.classId !== classId)
            if(classes.length == 0) {
                localStorage.removeItem("classes")
                localStorage.removeItem("exams")

            } else {
                localStorage.setItem('classes', JSON.stringify(classes))
            }

            //! delete all  related exams (perclasse & perstudent)
            let exams = JSON.parse(localStorage.getItem('exams')) ?? []
            exams = exams.filter(exam => {
                if(exam.settings?.classes?.length > 0) {
                    return !exam.settings?.classes?.some(classe => classe == classId)
                } else {
                    return !exam.settings?.students?.some(student => student.classId == classId)
                }
            })
            let onlyEmptyExamsLeft = exams.some(exam => exam.hasOwnProperty("settings"))
            if(exams.length == 0 || !onlyEmptyExamsLeft) {
                localStorage.removeItem("exams")
            } else {
                localStorage.setItem("exams", JSON.stringify(exams))
            }

            let records = JSON.parse(localStorage.getItem('records'))
            let updatedRecords = records.filter(record => record.classId !== classId)
            localStorage.setItem('records', JSON.stringify(updatedRecords))


            window.location.reload()
        })
        
    })
    
} 


function uploadStudentsFromExcelAndSaveInLS() {
    let studentFileUploadInputEl = document.querySelector('#studentsFromExcel')

    studentFileUploadInputEl.addEventListener('change', ev => {
        
        let fileInput = ev.target.files

        if(fileInput && fileInput.length > 0) {
            const uploadedExcelFile = fileInput[0]

            //! check file type
            const allowedTypes = [
                'application/vnd.ms-excel',                                      // Excel 97-2003 Worksheet (.xls)
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',  // Excel Open XML Workbook (.xlsx)
                'application/vnd.ms-excel.sheet.binary.macroenabled.12',       // Excel 2007-2013 Binary Worksheet (.xlsb)
                'application/vnd.ms-excel.addin.macroenabled.12',              // Excel 2007-2013 Add-In (.xlam)
                'application/vnd.ms-excel.sheet.binary.macroenabled.12',       // Excel 2007-2013 Binary Worksheet (.xlsb)
                'application/vnd.ms-excel.template.macroenabled.12',           // Excel 2007-2013 Macro-Enabled Template (.xltm)
                // Add more Excel-related MIME types here if needed...
              ];            
              
            if (!allowedTypes.includes(uploadedExcelFile.type)) {
                //! Warning alert message
                return;
            } 
            

            const reader = new FileReader()

            reader.readAsArrayBuffer(uploadedExcelFile)

            reader.onload = function (e) {

                let excelData = new Uint8Array(e.target.result)

                let work_book = XLSX.read(excelData, {type: 'array'})
                let sheet_name = work_book.SheetNames
                let sheet_array = XLSX.utils.sheet_to_json(work_book.Sheets[sheet_name[0]], {header: 1})

                sheet_array = sheet_array.filter(arrEl => arrEl.length > 0)

                if(sheet_array.length > 0) {

                    let newClassStudents = []

                    let headerRow = sheet_array[0]

                    let studentLastNameIndex
                    let studentFirstNameIndex
                    let studentIdIndex

                    headerRow.forEach((columnName, columnIndex) => {
                        columnName = columnName.toLowerCase()
                        columnName = columnName.replace(/[éè]/g, 'e');

                        if(columnName == "nom" || columnName == "nom de l'eleve" || columnName == "le nom") {
                            studentLastNameIndex = columnIndex
                        }

                        if(columnName == "prenom" || columnName == "prenom de l'eleve" || columnName == "le prenom") {
                            studentFirstNameIndex = columnIndex
                        } 

                        if(columnName == "massar" || columnName == "code massar" || columnName == "numero massar" || columnName == "le numero massar") {
                            studentIdIndex = columnIndex
                        }
                    })

                    // bodyRow
                    for (let row = 1; row < sheet_array.length; row++) {

                        let rowArray = sheet_array[row]

                        let studentLastName = toFirstLetterCapitalyze(rowArray[studentLastNameIndex])
                        let studentFirstName = toFirstLetterCapitalyze(rowArray[studentFirstNameIndex])
                        let studentId = rowArray[studentIdIndex].toUpperCase()

                        let studentClassId = classId // global var
                        
                        let newStudent = new Student(studentLastName, studentFirstName, studentId, studentClassId)

                        newClassStudents.push(newStudent)
                    }

                    // Fetch the classes object from LS
                    let classes = JSON.parse(localStorage.getItem('classes'))
                    // retrieve a specific classe from the classes array based on the classId
                    let classe = classes.find(classItem => classItem.classId == classId)

                    // get the class students
                    classe.classStudents = newClassStudents
                    localStorage.setItem('classes', JSON.stringify(classes))
                
                    //! Genearte the table
                    fillTable(document.querySelector('.class-table'))

                    //! Succes message
                    successAlert("students")
                }
            }
        }

    })
}

}

function toFirstLetterCapitalyze(str) {
    return  str.charAt(0).toUpperCase() + str.slice(1);
}