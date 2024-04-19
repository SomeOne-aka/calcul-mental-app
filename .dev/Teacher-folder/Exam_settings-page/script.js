let teacherProfile = JSON.parse(localStorage.getItem("teacherProfile"));
let classes = JSON.parse(localStorage.getItem("classes"));
if (!(teacherProfile && classes)) {
  pageSuccessionScreenAlert(
    "Avant de procéder à la configuration de vos examens, il est impératif de préalablement saisir les informations relatives à vos classes et élèves."
  );
} else {
  //! increment numberOfVisitsTeacherPages
  let numberOfVisitsTeacherPages = JSON.parse(
    localStorage.getItem("numberOfVisitsTeacherPages")
  );
  if (numberOfVisitsTeacherPages) {
    numberOfVisitsTeacherPages++;
    localStorage.setItem(
      "numberOfVisitsTeacherPages",
      numberOfVisitsTeacherPages
    );
  } else {
    localStorage.setItem("numberOfVisitsTeacherPages", 1);
  }

  // Exam Class
  class Exam {
    constructor(examName, examId) {
      this.examName = examName;
      this.examId = examId;
    }
  }

  let examId_g;

  //! Display exam tabs
  let examNameInputEl = document.querySelector("#add-stg-input");
  let addExamBtnEl = document.querySelector("#add-stg-btn");
  let examTabsContainer = document.querySelector(".tabs-container");

  // HTMLCollection exam tabs
  let examTabsEls = document.querySelectorAll(".stg-tab");

  // Fetch exams array from LS and display tabs
  fetchExamsFromLSAndUpdateTabs();

  // style exam tabs
  styleStgTabs();

  // Display exam form onload
  displayAndFillExamForm();

  examNameInputEl.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      // Verify exam name
      if (!examNameInputEl.value) return;

      let examInstance = new Exam(
        examNameInputEl.value.toUpperCase(),
        uniqueid()
      );

      // Store the exam object in the LS
      // Check if exams array exists in local storage
      if (localStorage.getItem("exams")) {
        // Get classes array from local storage
        const exams = JSON.parse(localStorage.getItem("exams"));
        // Push new data to exams array
        exams.push(examInstance);
        // Store updated exams array in local storage
        localStorage.setItem("exams", JSON.stringify(exams));
      } else {
        // Create exams array
        const exams = [];
        // Push new data to exams array
        exams.push(examInstance);
        // Store exams array in local storage
        localStorage.setItem("exams", JSON.stringify(exams));
      }

      // Fetch exams array from LS and display tabs
      fetchExamsFromLSAndUpdateTabs();

      //! exam added success alert
      successAlert("exam");

      // style exam tabs
      styleStgTabs();

      // display exam form after tabs updated
      displayAndFillExamForm();

      examNameInputEl.value = "";
    }
  });

  // Add exam tabs and add exam to LS
  addExamBtnEl.addEventListener("click", (_) => {
    // Verify exam name
    if (!examNameInputEl.value) return;

    let examInstance = new Exam(
      examNameInputEl.value.toUpperCase(),
      uniqueid()
    );

    // Store the exam object in the LS
    // Check if exams array exists in local storage
    if (localStorage.getItem("exams")) {
      // Get classes array from local storage
      const exams = JSON.parse(localStorage.getItem("exams"));
      // Push new data to exams array
      exams.push(examInstance);
      // Store updated exams array in local storage
      localStorage.setItem("exams", JSON.stringify(exams));
    } else {
      // Create exams array
      const exams = [];
      // Push new data to exams array
      exams.push(examInstance);
      // Store exams array in local storage
      localStorage.setItem("exams", JSON.stringify(exams));
    }

    // Fetch exams array from LS and display tabs
    fetchExamsFromLSAndUpdateTabs();

    //! exam added succesfully
    successAlert("exam");

    // style exam tabs
    styleStgTabs();

    // display exam form after tabs updated
    displayAndFillExamForm();

    examNameInputEl.value = "";
  });

  //! Functions Utiles

  // Fetch exams array from LS and display tabs
  function fetchExamsFromLSAndUpdateTabs() {
    let exams = JSON.parse(localStorage.getItem("exams"));
    examTabsContainer.innerHTML = "";
    exams?.forEach((exam) => {
      examTabsContainer.innerHTML += `
            <li class="stg-tab" data-examId="${
              exam.examId
            }"><span>${exam.examName.toUpperCase()}</span><span class="exam-status"><i class="fa-solid fa-hourglass-start"></i><i class="fa-solid fa-caret-down"></i></i><i class="fa-solid fa-circle-check"></i></span></li>
        `;
    });
    examStatusIcons();
  }

  // Display and fill exam form
  function displayAndFillExamForm() {
    let examTabsEls = document.querySelectorAll(".stg-tab");

    examTabsEls.forEach((examTabEl) => {
      examTabEl.addEventListener("click", (_) => {
        //! ******** check if the exam has settings property in LS *******/

        examId_g = examTabEl.getAttribute("data-examId");

        let exams = JSON.parse(localStorage.getItem("exams"));
        let exam = exams.find((exam) => exam.examId == examId_g);

        if (exam?.hasOwnProperty("settings")) {
          revealExamSettings();
        } else {
          VirginExamFormReveal();
        }
      });
    });
  }

  //! VirginExamFormReveal and related functions
  function VirginExamFormReveal() {
    // Fetch all className and classId and classStudents from LS
    let classes = JSON.parse(localStorage.getItem("classes"));

    // if classes and students are not provided yet
    //if(!classes) return noClasseAlert()

    //! Generate the exam form template
    let examFormContainerEl = document.querySelector(".stg-container");
    examFormContainerEl.innerHTML = `
        <div class="stg-inner-container">
    
        <form class="exam-form" novalidate>
            <!--Row -->
            <div class="row">
                <!--Label-->
                <label class="label-column" for="">La date</label>
                <!--Input Column-->
                <div class="input-column">
                    <!--Input-container-->
                    <div class="input-container">
                        <!-- Unité -->
                        <div class="select-container">
                            <div class="select-head unite">
                                <p class="selected">Unités</p>
                                <span class="arrow"><i class="fa-solid fa-chevron-down"></i></span>
                            </div>
                            <ul class="select-list">
                                <li class="select-list-item">
                                    <span class="leading">
                                        <input type="checkbox" name="unite" value="evaluation diagnostique">
                                    </span>
                                    <span class="trailing">evaluation diagnostique</span>
                                </li>
                                <li class="select-list-item">
                                    <span class="leading">
                                        <input type="checkbox" name="unite" value="unité 1">
                                    </span>
                                    <span class="trailing">unité 1</span>
                                </li>
                                <li class="select-list-item">
                                    <span class="leading">
                                        <input type="checkbox" name="unite" value="unité 2">
                                    </span>
                                    <span class="trailing">unité 2</span>
                                </li>
                                <li class="select-list-item">
                                    <span class="leading">
                                        <input type="checkbox" name="unite" value="unité 3">
                                    </span>
                                    <span class="trailing">unité 3</span>
                                </li>
                                <li class="select-list-item">
                                    <span class="leading">
                                        <input type="checkbox" name="unite" value="unité 4">
                                    </span>
                                    <span class="trailing">unité 4</span>
                                </li>
                                <li class="select-list-item">
                                    <span class="leading">
                                        <input type="checkbox" name="unite" value="unité 5">
                                    </span>
                                    <span class="trailing">unité 5</span>
                                </li>
                                <li class="select-list-item">
                                    <span class="leading">
                                        <input type="checkbox" name="unite" value="unité 6">
                                    </span>
                                    <span class="trailing">unité 6</span>
                                </li>
                            </ul>
                        </div>
                        
                        </div>
                        <!--Description-->
                        <div class="description">
                            <!--Info-->
                            <p class="info">Veuillez spécifier l'unité ou les unités dans lesquelles vous souhaitez passer l'examen.</p>
                        </div>
                </div>
            </div>


            <!--Row -->
            <div class="row">
                <!--Label-->
                <label class="label-column" for="">Les élèves ciblés</label>
                <!--Input Column-->
                <div class="input-column">
                    <!--Input-container-->
                    <div class="input-container after-s-c-l-c">
                        <!--Eleve ciblés select container-->
                        <div class="select-container">
                            <div class="select-head students">
                                <p class="selected">Les élèves</p>
                                <span class="arrow"><i class="fa-solid fa-chevron-down"></i></span>
                            </div>
                            <ul class="select-list classe-list">
                                
                            </ul>
                        </div>
                    </div>

                    <!-- Eleves specifique check List Container -->
                    <!-- /-- Eleves specifique check List Container -->
                    
                    <!--Description-->
                    <div class="description">
                        <!--Submenu-->
                        <div class="student-submenu">

                        </div>
                        <!--Info-->
                        <p class="info">Veuillez choisir les élèves qui bénéficieront de l'examen.</p>
                    </div>
                </div>
            </div>

            <!--Row -->
            <div  class="row">
                <!--Label-->
                <label class="label-column" for="">Type d'opération</label>
                <!--Input Column-->
                <div class="input-column">
                    <!--Input-container-->
                    <div class="input-container">
                        <!-- Type d'operation -->
                        <div class="select-container single-selection">
                            <div class="select-head operation">
                                <p class="selected">Opération</p>
                                <span class="arrow"><i class="fa-solid fa-chevron-down"></i></span>
                            </div>
                            <ul class="select-list">
                                <li class="select-list-item">
                                    <span class="leading">
                                        <input type="checkbox" name="operation" value="multiplication">
                                    </span>
                                    <span class="trailing">multiplication</span>
                                </li>
                                <li class="select-list-item">
                                    <span class="leading">
                                        <input type="checkbox" name="operation" value="addition">
                                    </span>
                                    <span class="trailing">addition</span>
                                </li>
                                <li class="select-list-item">
                                    <span class="leading">
                                        <input type="checkbox" name="operation"  value="soustraction">
                                    </span>
                                    <span class="trailing">soustraction</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <!--Description-->
                    <div class="description">
                        <!--Info-->
                        <p class="info">Uniquement l'opération de multiplication est valide pour cette version.</p>
                    </div>
                </div>
            </div>

            <!--Row -->
            <div class="row">
                <!--Label-->
                <label class="label-column" for="">Les tables</label>
                <!--Input Column-->
                <div class="input-column">
                    <!--Input-container-->
                    <div class="input-container">
                        <div class="select-container">
                            <div class="select-head table">
                                <p class="selected">Tables</p>
                                <span class="arrow"><i class="fa-solid fa-chevron-down"></i></span>
                            </div>
                            <ul class="select-list">
                                <li class="select-list-item">
                                    <span class="leading">
                                        <input type="checkbox" name="table" value="0">
                                    </span>
                                    <span class="trailing">0</span>
                                </li>
                                <li class="select-list-item">
                                    <span class="leading">
                                        <input type="checkbox" name="table" value="1">
                                    </span>
                                    <span class="trailing">1</span>
                                </li>
                                <li class="select-list-item">
                                    <span class="leading">
                                        <input type="checkbox" name="table" value="2">
                                    </span>
                                    <span class="trailing">2</span>
                                </li>
                                <li class="select-list-item">
                                    <span class="leading">
                                        <input type="checkbox" name="table" value="3">
                                    </span>
                                    <span class="trailing">3</span>
                                </li>
                                <li class="select-list-item">
                                    <span class="leading">
                                        <input type="checkbox" name="table" value="4">
                                    </span>
                                    <span class="trailing">4</span>
                                </li>
                                <li class="select-list-item">
                                    <span class="leading">
                                        <input type="checkbox" name="table" value="5">
                                    </span>
                                    <span class="trailing">5</span>
                                </li>
                                <li class="select-list-item">
                                    <span class="leading">
                                        <input type="checkbox" name="table" value="6">
                                    </span>
                                    <span class="trailing">6</span>
                                </li>
                                <li class="select-list-item">
                                    <span class="leading">
                                        <input type="checkbox" name="table" value="7">
                                    </span>
                                    <span class="trailing">7</span>
                                </li>
                                <li class="select-list-item">
                                    <span class="leading">
                                        <input type="checkbox" name="table" value="8">
                                    </span>
                                    <span class="trailing">8</span>
                                </li>
                                <li class="select-list-item">
                                    <span class="leading">
                                        <input type="checkbox" name="table" value="9">
                                    </span>
                                    <span class="trailing">9</span>
                                </li>
                                <li class="select-list-item">
                                    <span class="leading">
                                        <input type="checkbox" name="table" value="10">
                                    </span>
                                    <span class="trailing">10</span>
                                </li>
                                <li class="select-list-item">
                                    <span class="leading">
                                        <input type="checkbox" name="table" value="11">
                                    </span>
                                    <span class="trailing">11</span>
                                </li>
                                <li class="select-list-item">
                                    <span class="leading">
                                        <input type="checkbox" name="table" value="12">
                                    </span>
                                    <span class="trailing">12</span>
                                </li>
                                <li class="select-list-item">
                                    <span class="leading">
                                        <input type="checkbox" name="table" value="0-5">
                                    </span>
                                    <span class="trailing">0-5</span>
                                </li>
                                <li class="select-list-item">
                                    <span class="leading">
                                        <input type="checkbox" name="table" value="0-10">
                                    </span>
                                    <span class="trailing">0-10</span>
                                </li>
                                <li class="select-list-item">
                                    <span class="leading">
                                        <input type="checkbox" name="table" value="11-20">
                                    </span>
                                    <span class="trailing">11-20</span>
                                </li>
                                <li class="select-list-item">
                                    <span class="leading">
                                        <input type="checkbox" name="table" value="21-100">
                                    </span>
                                    <span class="trailing">21-100</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <!--Description-->
                    <div class="description">
                        <!--Info-->
                        <p class="info">Les tables à évaluer (Exemple: 2, 3, 4)</p>
                    </div>
                </div>
            </div>

            <!--multipleTentaive-->
            <!--Row -->
            <div class="row">
                <!--Label-->
                <label class="label-column" for="">Examen à plusieurs tentaives</label>
                <!--Input Column-->
                <div class="input-column">
                    <!--Input-container-->
                    <div class="input-container">
                        <!--Examen à plusieurs tentaives-->
                        <div class="select-container single-selection" >
                            <div class="select-head multiple-tentative">
                                <p class="selected">Oui / Non</p>
                                <span class="arrow"><i class="fa-solid fa-chevron-down"></i></span>
                            </div>
                            <ul class="select-list">
                            
                                <li class="select-list-item">
                                    <span class="leading">
                                        <input type="checkbox" name="multiple-tentative" value="oui">
                                    </span>
                                    <span class="trailing">oui</span>
                                </li>
                                <li class="select-list-item">
                                    <span class="leading">
                                        <input type="checkbox" name="multiple-tentative" value="non">
                                    </span>
                                    <span class="trailing">non</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <!--Description-->
                    <div class="description">
                        <!--Info-->
                        <p class="info">Permettre aux élèves la possibilité de passer l'examen une seule fois ou d'effectuer plusieurs tentatives.</p>
                    </div>
                </div>
            </div>

            <!--Row -->
            <div  class="row">
                <!--Label-->
                <label class="label-column" for="">Nombre de questions</label>
                <!--Input Column-->
                <div class="input-column">
                    <!--Input-container-->
                    <div class="input-container">
                        <input type="text" autocomplete="off" name="question-number" id="question-number-input">
                    </div>
                    <div class="description">
                        <!--Info-->
                        <p class="info">Veuillez indiquer le nombre total de questions dans le Quiz.</p>
                    </div>
                </div>
            </div>

            <!--Row -->
            <div class="row">
                <!--Label-->
                <label class="label-column" for="">La durée de chaque question</label>
                <!--Input Column-->
                <div class="input-column">
                    <!--Input-container-->
                    <div class="input-container">
                        <!--La durée de chaque question-->
                            <div class="select-container single-selection">
                                <div class="select-head duration-constraint">
                                    <p class="selected">Déterminé / Indéterminé</p>
                                    <span class="arrow"><i class="fa-solid fa-chevron-down"></i></span>
                                </div>
                                <ul class="select-list">
                                
                                    <li class="select-list-item">
                                        <span class="leading">
                                            <input type="checkbox" name="duration-constraint" value="déterminé">
                                        </span>
                                        <span class="trailing">déterminé</span>
                                    </li>
                                    <li class="select-list-item">
                                        <span class="leading">
                                            <input type="checkbox" name="duration-constraint" value="indéterminé">
                                        </span>
                                        <span class="trailing">Indéterminé</span>
                                    </li>
                                </ul>
                            </div>
                        <input type="text" autocomplete="off" name="question-duration" id="question-duration-input">
                    </div>
                    <div class="description">
                        <!--Info-->
                        <p class="info">Veuillez paramétrer la durée de chaque question du Quiz en secondes.</p>
                    </div>
                </div>
            </div>

            

            <button class="delete-exam-btn" data-type="exam">Supprimer</button>


            <button class="submit-exam-btn" data-type="exam">Enregistrer</button>
            
        </form>
        
    </div>
    `;

    addInteractivityToForm();

    //! click save exam -> collect the exam settings based on name attribute
    verifyAndSubmitExam();

    //! click delete exam
    deleteExam();
  }
  function addInteractivityToForm() {
    selectWidgetLogic();

    //!!!!!!! validate question-number number input while filling it
    let questionNumberEl = document.querySelector("#question-number-input");
    questionNumberEl.addEventListener("input", (_) => {
      const inputValue = questionNumberEl.value;
      const sanitizedValue = inputValue.replace(/[^0-9]/g, ""); // Remove non-numeric characters

      if (inputValue !== sanitizedValue) {
        questionNumberEl.value = sanitizedValue;
      }
      if (inputValue == 0) {
        questionNumberEl.value = "";
      }
    });
  }

  function revealStudentsCheckList() {
    // Get the classes and their students from the LS
    let classes = JSON.parse(localStorage.getItem("classes"));

    // generate students check list and populate it with classes data
    let studentsCheckListContainerEl = document.createElement("div");
    studentsCheckListContainerEl.classList.add("students-check-list-container");
    studentsCheckListContainerEl.classList.toggle("show-hide");

    classes.forEach((classe) => {
      let classeNameEl = document.createElement("h3");
      classeNameEl.textContent = classe.className;
      studentsCheckListContainerEl.appendChild(classeNameEl);
      let studentsCheckListEl = document.createElement("div");
      studentsCheckListEl.classList.add("students-check-list");

      // Populate students check list
      classe.classStudents.forEach((student) => {
        studentsCheckListEl.innerHTML += `
                <label for="${student.studentId}" class="students-check-list-item">
                    <span>${student.studentFirstName} ${student.studentLastName}</span>
                    <span>${student.studentId}</span>
                </label>
                <input type="checkbox" name="student" id="${student.studentId}" value="${student.studentId}" data-classId="${classe.classId}">
            `;
      });
      studentsCheckListContainerEl.appendChild(studentsCheckListEl);
    });
    // Append the student check list container
    let inputContainerEl = document.querySelector(".after-s-c-l-c");
    inputContainerEl.after(studentsCheckListContainerEl);

    // Check student event
    let studentsCheckListItemsEls = document.querySelectorAll(
      ".students-check-list-item"
    );
    studentsCheckListItemsEls.forEach((studentsCheckListItemEl) => {
      studentsCheckListItemEl.addEventListener("click", (e) => {
        studentsCheckListItemEl.classList.toggle("checked");
      });
    });
  }

  //! Submit exam form and related functions
  function verifyAndSubmitExam() {
    let examFormEl = document.querySelector(".exam-form");
    let submitExamBtn = document.querySelector(".submit-exam-btn");
    submitExamBtn.addEventListener("click", (e) => {
      e.preventDefault();

      //! form inputs validation
      let formErrors = 0;

      // if the inpult is validated => green light :: by default validated
      let SelectHeadEls = document.querySelectorAll(".select-head");
      SelectHeadEls.forEach((selectHeadEl) => {
        selectHeadEl.style.backgroundColor = "#76feb7";
      });
      let questionNumberEl = document.querySelector("#question-number-input");
      questionNumberEl.style.backgroundColor = "#76feb7";
      let questionDurationEl = examFormEl.querySelector(
        'input[name="question-duration"]'
      );
      questionDurationEl.style.backgroundColor = "#ff7f7fe0";

      // unite
      let uniteEls = examFormEl.querySelectorAll('input[name="unite"]:checked');
      let unite = Array.from(uniteEls).map(function (unite) {
        return unite.value;
      });
      if (unite.length == 0) {
        let SelectHeadEl = document.querySelector(".unite");
        SelectHeadEl.style.backgroundColor = "#ff7f7fe0";

        formErrors++;
      }

      // classes students
      let classes = [];

      let classesEls = examFormEl.querySelectorAll(
        'input[name="classe"]:checked'
      );
      let classes_val = Array.from(classesEls).map(function (classe) {
        return classe.value;
      });
      let students = [];
      if (classesEls.length == 0) {
        formErrors++;

        let SelectHeadEl = document.querySelector(".students");
        SelectHeadEl.style.backgroundColor = "#ff7f7fe0";
      } else if (classes_val == "élèves spécifiques") {
        let studentsEls = examFormEl.querySelectorAll(
          'input[name="student"]:checked'
        );
        students = Array.from(studentsEls).map(function (student) {
          return {
            studentId: student.value,
            classId: student.getAttribute("data-classId"),
            score: [],
          };
        });
        if (students.length == 0) {
          let SelectHeadEl = document.querySelector(".students");
          SelectHeadEl.style.backgroundColor = "#ff7f7fe0";

          formErrors++;
        }
      } else {
        classesEls.forEach((classeEl) => {
          let classId = classeEl.getAttribute("data-classId");

          classes.push(classId);
        });
      }

      // operation
      let operationEls = examFormEl.querySelectorAll(
        'input[name="operation"]:checked'
      );
      let operation = Array.from(operationEls).map(function (operation) {
        return operation.value;
      });
      if (operation.length == 0) {
        let SelectHeadEl = document.querySelector(".operation");
        SelectHeadEl.style.backgroundColor = "#ff7f7fe0";

        formErrors++;
      }

      // table
      let tableEls = examFormEl.querySelectorAll('input[name="table"]:checked');
      let table = Array.from(tableEls).map(function (table) {
        return table.value;
      });
      if (table.length == 0) {
        let SelectHeadEl = document.querySelector(".table");
        SelectHeadEl.style.backgroundColor = "#ff7f7fe0";

        formErrors++;
      }

      // multipleTentative
      let multipleTentativeEls = examFormEl.querySelectorAll(
        'input[name="multiple-tentative"]:checked'
      );
      let multipleTentative = Array.from(multipleTentativeEls).map(function (
        tentative
      ) {
        return tentative.value;
      });
      if (multipleTentative.length == 0) {
        let SelectHeadEl = document.querySelector(".multiple-tentative");
        SelectHeadEl.style.backgroundColor = "#ff7f7fe0";

        formErrors++;
      }

      // question-number
      let questionNumber = questionNumberEl.value;
      if (questionNumber.length == 0) {
        questionNumberEl.style.backgroundColor = "#ff7f7fe0";
        formErrors++;
      }

      // durationConstraint
      let durationConstraintEl = examFormEl.querySelectorAll(
        'input[name="duration-constraint"]:checked'
      );
      let durationConstraint = Array.from(durationConstraintEl).map(function (
        table
      ) {
        return table.value;
      });
      let questionDuration = "";
      if (durationConstraint.length == 0) {
        let SelectHeadEl = document.querySelector(".duration-constraint");
        SelectHeadEl.style.backgroundColor = "#ff7f7fe0";

        formErrors++;
      } else if (durationConstraint == "déterminé") {
        // questionDuration
        questionDuration = questionDurationEl.value;
        if (questionDuration.length != 0) {
          questionDurationEl.style.backgroundColor = "#76feb7";
        } else {
          questionDurationEl.style.backgroundColor = "#ff7f7fe0";
          formErrors++;
        }
      }

      // missing inputs -> popup message in the bottom
      if (formErrors > 0) {
        return;
      }

      // if confirm exam submit: set settings then push it to exam then push it to LS
      let settings = {
        unite: unite,
        classes,
        students,
        operation,
        table,
        multipleTentative: multipleTentative.join(""),
        questionNumber: questionNumber,
        durationConstraint: durationConstraint.join(""),
        questionDuration,
      };

      let exams = JSON.parse(localStorage.getItem("exams"));
      let exam = exams.find((exam) => exam.examId == examId_g);

      exam.settings = settings;

      exam.status = {
        active: false,
        completed: false,
      };

      localStorage.setItem("exams", JSON.stringify(exams));

      location.reload();
    });
  }

  //! revealExamSettings and related functions
  function revealExamSettings() {
    let examFormContainerEl = document.querySelector(".stg-container");

    examFormContainerEl.innerHTML = `
    <div class="stg-inner-container">

        <div class="switch-container">
            <span>Activer l'examen</span>

            <label class="switch">
            <input type="checkbox" class="activate-exam-input">
            <span class="slider"></span>
            </label>
        </div>


        <form class="exam-form exam-settings-show" novalidate>

            <!--Row -->
            <div class="row">
                <!--Label-->
                <label class="label-column" for="">La date</label>
                <!--Input Column-->
                <div class="input-column">
                    <p class="unite choosed-parameters"></p>
                </div>
            </div>


            <!--Row -->
            <div class="row">
                <!--Label-->
                <label class="label-column" for="">Les élèves ciblés</label>
                <!--Input Column-->
                <div class="input-column">
                    <p class="classe choosed-parameters"></p>
                </div>
            </div>

            <!--Row -->
            <div  class="row">
                <!--Label-->
                <label class="label-column" for="">Type d'opération</label>
                <!--Input Column-->
                <div class="input-column">
                    <p class="operation choosed-parameters"></p>
                </div>
            </div>

            <!--Row -->
            <div class="row">
                <!--Label-->
                <label class="label-column" for="">Les tables</label>
                <!--Input Column-->
                <div class="input-column">
                    <p class="table choosed-parameters"></p>
                </div>
            </div>

            <!--multipleTentaive-->
            <!--Row -->
            <div class="row">
                <!--Label-->
                <label class="label-column" for="">Examen à plusieurs tentaives</label>
                <!--Input Column-->
                <div class="input-column">
                    <p class="multipleTentative choosed-parameters"></p>
                </div>
            </div>

            <!--Row -->
            <div  class="row">
                <!--Label-->
                <label class="label-column" for="">Nombre de questions</label>
                <!--Input Column-->
                <div class="input-column">
                    <p class="questionNumber choosed-parameters"></p>
                </div>
            </div>

            <!--Row -->
            <div class="row">
                <!--Label-->
                <label class="label-column" for="">La durée de chaque question</label>
                <!--Input Column-->
                <div class="input-column">
                    <p class="durationConstraint choosed-parameters"></p>
                    <p class="questionDuration choosed-parameters"></p>
                </div>
            </div>

            

            <button class="delete-exam-btn" data-type="exam">Supprimer</button>


            <button class="download-exam-btn" data-type="exam">Telecharger</button>
            
        </form>
        
    </div>
    `;

    // Fill the exam settings from LS
    let exams = JSON.parse(localStorage.getItem("exams"));
    let exam = exams.find((exam) => exam.examId == examId_g);

    // classes name
    let classesNameArray = [];
    let classesName = "";
    let classes = JSON.parse(localStorage.getItem("classes"));
    let examClassesIdArray = exam.settings?.classes || [];
    if (examClassesIdArray.length == 0) {
      classesName = "Elèves spécifiques";
    } else {
      classes.forEach((classe) => {
        if (
          examClassesIdArray.some(
            (examClasseId) => examClasseId == classe.classId
          )
        ) {
          classesNameArray.push(classe.className);
        }
      });
      classesName = classesNameArray.join(", ");
    }

    document.querySelector(".unite").textContent =
      exam.settings.unite.join(", ");
    document.querySelector(".classe").textContent = classesName;
    document.querySelector(".operation").textContent =
      exam.settings.operation.join(", ");
    document.querySelector(".table").textContent =
      exam.settings.table.join(", ");
    document.querySelector(".multipleTentative").textContent =
      exam.settings.multipleTentative;
    document.querySelector(".questionNumber").textContent =
      exam.settings.questionNumber;
    document.querySelector(".durationConstraint").textContent =
      exam.settings.durationConstraint;
    document.querySelector(".questionDuration").textContent =
      exam.settings.questionDuration == ""
        ? ""
        : exam.settings.questionDuration + " s";

    //! activate exam
    activateExam();

    //! delete exam
    deleteExam();

    //! Dowload btn enabled / disabled
    downloadExam();
  }

  //! Activate exam
  function activateExam() {
    let switchContainerEl = document.querySelector(".switch-container");

    let exams = JSON.parse(localStorage.getItem("exams")).filter((exam) =>
      exam.hasOwnProperty("status")
    );
    let exam = exams.find((exam) => exam.examId == examId_g);
    let multipleTentative =
      exam.settings.multipleTentative == "oui" ? true : false;

    if (exam.status?.completed && !multipleTentative) {
      switchContainerEl.style.display = "none";
      return;
    }

    let examActivated = exam.status?.active;
    let activateExamInputEl = document.querySelector(".activate-exam-input");

    if (examActivated) {
      activateExamInputEl.checked = true;
    } else {
      activateExamInputEl.checked = false;
    }

    activateExamInputEl.addEventListener("click", (e) => {
      if (activateExamInputEl.checked) {
        exams.forEach((exam) => {
          exam.status.active = false;
        });
        exam.status.active = true;
      } else {
        exams.forEach((exam) => {
          exam.status.active = false;
        });
      }

      localStorage.setItem("exams", JSON.stringify(exams));

      examStatusIcons();
    });
  }

  //! Dowload btn enabled / disabled
  function downloadExam() {
    let downloadExamBtnEl = document.querySelector(".download-exam-btn");

    let exams = JSON.parse(localStorage.getItem("exams"));
    let exam = exams.find((exam) => exam.examId == examId_g);

    if (!exam.status?.completed) {
      downloadExamBtnEl.disabled = true;
      downloadExamBtnEl.style.opacity = ".3";
      downloadExamBtnEl.style.cursor = "not-allowed";
    } else {
      downloadExamBtnEl.disabled = false;
      downloadExamBtnEl.addEventListener("click", (e) => {
        e.preventDefault();
        //! Download the exam results as PDF
        downloadExamAsPDF();
        //! Increment exam downloads number
        let numberOfExamDownloads = JSON.parse(
          localStorage.getItem("numberOfExamDownloads")
        );
        if (numberOfExamDownloads) {
          numberOfExamDownloads++;
          localStorage.setItem("numberOfExamDownloads", numberOfExamDownloads);
        } else {
          localStorage.setItem("numberOfExamDownloads", 1);
        }
      });
    }
  }

  //! delete exam when clicking on delete exam btn
  function deleteExam() {
    let deleteExamBtnEl = document.querySelector(".delete-exam-btn");

    deleteExamBtnEl.addEventListener("click", (e) => {
      e.preventDefault();
      confirmDelete("exam");

      let confirmBtnEl = document.querySelector(".confirm-btn");
      confirmBtnEl.addEventListener("click", (_) => {
        let exams = JSON.parse(localStorage.getItem("exams"));
        let newExams = exams.filter((exam) => exam.examId != examId_g);

        localStorage.setItem("exams", JSON.stringify(newExams));

        location.reload();
      });
    });
  }

  function examStatusIcons() {
    activatedExamGreenDot();
    completedIncompletedIcon();
  }

  //! activated exam green dot
  function activatedExamGreenDot() {
    let exams = JSON.parse(localStorage.getItem("exams"));
    let activeExamId = exams?.find(
      (exam) => exam.status?.active == true
    )?.examId;

    let examTabEls = document.querySelectorAll(".stg-tab");

    examTabEls.forEach((examTabEl) => {
      if (examTabEl.getAttribute("data-examId") == activeExamId) {
        examTabEl.classList.add("activeExam");
      } else {
        examTabEl.classList.remove("activeExam");
      }
    });
  }

  function completedIncompletedIcon() {
    let exams = JSON.parse(localStorage.getItem("exams")) ?? [];

    let examTabEls = document.querySelectorAll(".stg-tab");

    examTabEls.forEach((examTabEl) => {
      let completedExam = exams.find(
        (exam) => exam.examId == examTabEl.getAttribute("data-examId")
      )?.status?.completed;

      if (completedExam == true) {
        examTabEl.classList.add("completedExam");
      } else if (completedExam == false) {
        examTabEl.classList.add("incompletedExam");
      }
    });
  }

  function downloadExamAsPDF() {
    const doc = new jsPDF();

    // Left
    let teacherFullNameLabel = "Enseignant: ";
    let teacherPPRLabel = "N° PPR: ";
    let uniteWeekLabel = "Unité/Semaine: ";
    let scholarYearLabel = "Année scolaire: ";
    // Right
    let regionalAcademyLabel = "Académie régionale: ";
    let provincialDirectoryLabel = "Direction provinciale: ";
    let teachingSchoolLabel = "Etablissement: ";

    // Define the data rows (example data)

    // Get exam data from LS

    //! get students info and exams from LS
    let exams =
      Array.from(JSON.parse(localStorage.getItem("exams"))).filter(
        (exam) => exam.settings
      ) ?? [];
    let classes = JSON.parse(localStorage.getItem("classes")) ?? [];
    let studentsInfoLack = [];
    classes.forEach((classe) => {
      classe?.classStudents?.forEach((student) =>
        studentsInfoLack.push(student)
      );
    });

    let examId = examId_g;
    let exam = exams.find((exam) => exam.examId == examId);
    //! exam data
    let examName = exam.examName
      .replace(/[^a-zA-Z0-9+-]/g, " ")
      .replace(/\+/g, "add")
      .replace(/-/g, "sstr");

    let examOperations = exam.settings.operation.join(", ");
    let examTables = exam.settings.table.join(", ");
    let examQuestionNumber = exam.settings.questionNumber;
    let examLevelsArr = [];
    if (exam.settings.classes.length > 0) {
      exam.settings.classes.forEach((examClasseId) => {
        examLevelsArr.push(
          classes.find((classe) => classe.classId == examClasseId).className
        );
      });
    } else {
      examLevelsArr = ["Elèves spécifiques"];
    }
    let examLevels = examLevelsArr.join(", ").toLocaleUpperCase();

    let rows = [];
    //! get table rows data
    if (exam.settings.classes.length > 0) {
      let examClassesIds = exam.settings.classes;
      let examStudentsInfoLack = studentsInfoLack.filter((studentInfo) =>
        examClassesIds.includes(studentInfo.studentClassId)
      );
      let examStudentsPassed = exam.settings.students;

      examStudentsInfoLack.forEach((examStudentInfo) => {
        let studentFullName =
          examStudentInfo.studentFirstName.charAt(0).toUpperCase() +
          examStudentInfo.studentFirstName.slice(1) +
          " " +
          examStudentInfo.studentLastName;
        let codeMassar = examStudentInfo.studentId;

        let passedStudent = examStudentsPassed.find(
          (studentPassed) =>
            studentPassed.studentId == examStudentInfo.studentId
        );

        let totalScore = passedStudent?.score?.reduce(
          (sum, scoreObj) => sum + scoreObj.quizScore,
          0
        );
        let examScore =
          totalScore !== undefined
            ? totalScore / passedStudent?.score?.length
            : "";
        let totalFullTime = passedStudent?.score?.reduce(
          (sum, scoreObj) => sum + scoreObj.fullTime,
          0
        );
        let examFullTime =
          totalFullTime !== undefined
            ? Math.round(totalFullTime / passedStudent?.score?.length / 1000)
            : "";
        let examFinalNote;
        if (examScore !== "" || examFullTime !== "") {
          examFinalNote = calculateFinalNoteWithDuration(
            examFullTime * 1000,
            examQuestionNumber,
            examScore
          );

          if (examScore % 1 !== 0) {
            examScore = Number(examScore).toFixed(2);
          }
        } else {
          examFinalNote = "";
        }

        rows.push([
          codeMassar,
          studentFullName,
          examScore,
          examFullTime,
          examFinalNote,
        ]);
      });
    } else {
      let examSignedStudents = exam?.settings?.students;
      let examStudentsInfoLack = studentsInfoLack.filter((studentInfo) =>
        examSignedStudents?.some(
          (examStudent) => examStudent.studentId == studentInfo.studentId
        )
      );

      examStudentsInfoLack.forEach((examStudentInfo) => {
        let studentFullName =
          examStudentInfo.studentFirstName.charAt(0).toUpperCase() +
          examStudentInfo.studentFirstName.slice(1) +
          " " +
          examStudentInfo.studentLastName;
        let codeMassar = examStudentInfo.studentId;

        let passedStudent = examSignedStudents.find(
          (studentPassed) =>
            studentPassed.studentId == examStudentInfo.studentId
        );

        let totalScore =
          passedStudent?.score?.length > 0
            ? passedStudent?.score?.reduce(
                (sum, scoreObj) => sum + scoreObj.quizScore,
                0
              )
            : undefined;
        let examScore =
          totalScore !== undefined
            ? totalScore / passedStudent?.score?.length
            : "";
        let totalFullTime =
          passedStudent?.score?.length > 0
            ? passedStudent?.score?.reduce(
                (sum, scoreObj) => sum + scoreObj.fullTime,
                0
              )
            : undefined;
        let examFullTime =
          totalFullTime !== undefined
            ? Math.round(totalFullTime / passedStudent?.score?.length / 1000)
            : "";
        let examFinalNote;
        if (examScore !== "" || examFullTime !== "") {
          examFinalNote = calculateFinalNoteWithDuration(
            examFullTime * 1000,
            examQuestionNumber,
            examScore
          );

          if (examScore % 1 !== 0) {
            examScore = Number(examScore).toFixed(2);
          }
        } else {
          examFinalNote = "";
        }

        rows.push([
          codeMassar.toUpperCase(),
          studentFullName,
          examScore,
          examFullTime,
          examFinalNote,
        ]);
      });
    }

    // Define the column names
    const columns = [
      "Code Massar",
      "Le Nom Complet",
      `Le Score(/${examQuestionNumber})`,
      "La Durée(s)",
      "La Note Finale(/10)",
    ];

    //! Teacher Data
    let teacherProfile = JSON.parse(localStorage.getItem("teacherProfile"));
    // if(!teacherProfile)

    let teacherFirstName = teacherProfile.teacherFirstName.toUpperCase();
    let teacherLastName = teacherProfile.teacherLastName.toUpperCase();
    let teacherFullName = teacherFirstName + " " + teacherLastName;
    let teacherPPR = teacherProfile.teacherPPR;
    let scholarYear = teacherProfile.scholarSaison;
    let regionalAcademy = teacherProfile.regionalAcademy.toUpperCase();
    let provincialDirectory = teacherProfile.provincialDirectory.toUpperCase();
    let teachingSchool = teacherProfile.teachingSchool.toUpperCase();

    let leap = 21;
    let stepsNbre = Math.ceil(rows.length / leap);
    let paginatedRows = [];
    for (let i = 0; i < stepsNbre; i++) {
      let start = i * leap;
      let end = start + leap;
      paginatedRows.push(rows.slice(start, end));
    }

    let totalNumberOfPages = Math.ceil(rows.length / leap);

    // Loop to add blank pages
    for (let pageNumber = 1; pageNumber < totalNumberOfPages; pageNumber++) {
      doc.addPage();
    }

    // Whole page variables
    let pageWidth = doc.internal.pageSize.width;

    // Loop through each page and add header and footer
    for (let i = 1; i <= totalNumberOfPages; i++) {
      doc.setPage(i);

      //! Student Data
      let rows = paginatedRows[i - 1];

      //! header
      let headerHorGap = 6;
      let fontSize = 8;
      let labelFieldGap = 15;
      let teacherFullNameWidth =
        (doc.getStringUnitWidth(teacherFullNameLabel) * (fontSize - 1)) /
        doc.internal.scaleFactor;
      let teacherPPRWidth =
        (doc.getStringUnitWidth(teacherPPR) * (fontSize - 1)) /
        doc.internal.scaleFactor;
      let scholarYearWidth =
        (doc.getStringUnitWidth(scholarYearLabel) * (fontSize - 1)) /
        doc.internal.scaleFactor;
      let regionalAcademyWidth =
        (doc.getStringUnitWidth(regionalAcademyLabel) * (fontSize - 1)) /
        doc.internal.scaleFactor;
      let provincialDirectoryWidth =
        (doc.getStringUnitWidth(provincialDirectoryLabel) * (fontSize - 1)) /
        doc.internal.scaleFactor;
      let teachingSchoolWidth =
        (doc.getStringUnitWidth(teachingSchoolLabel) * (fontSize - 1)) /
        doc.internal.scaleFactor;

      // Set vertical line
      let startX = 3;
      let startY = headerHorGap - 2;
      let length = headerHorGap * 2 + 7;
      doc.setLineWidth(1);
      doc.setDrawColor(144, 39, 245);
      doc.line(startX, startY, startX, startY + length);

      // Set labels
      // Left
      doc.setFont("helvetica", "bold");
      doc.setFontSize(fontSize);
      doc.text(teacherFullNameLabel, 10, headerHorGap);
      doc.text(teacherPPRLabel, 10, headerHorGap * 2);
      doc.text(uniteWeekLabel, 10, headerHorGap * 3);
      doc.text(scholarYearLabel, 10, headerHorGap * 4);
      // Right
      doc.text(regionalAcademyLabel, 140, headerHorGap);
      doc.text(provincialDirectoryLabel, 140, headerHorGap * 2);
      doc.text(teachingSchoolLabel, 140, headerHorGap * 3);

      // Set the image
      let logoWidth = 15 * 4.76;
      let logHeight = 15;
      let logoXPos = (pageWidth - logoWidth) / 2;
      doc.addImage(logoBase64, "JPEG", logoXPos - 6, 4, logoWidth, logHeight);

      // Set field value
      // Left
      doc.setFont("helvetica", "normal");
      doc.setFontSize(fontSize - 1);
      doc.text(
        teacherFullName,
        teacherFullNameWidth + labelFieldGap - 1,
        headerHorGap
      );
      doc.text(
        teacherPPR,
        teacherPPRWidth + labelFieldGap - 2,
        headerHorGap * 2
      );
      doc.text(scholarYear, scholarYearWidth + labelFieldGap, headerHorGap * 4);

      // Right
      doc.text(regionalAcademy, regionalAcademyWidth + 146, headerHorGap);
      doc.text(
        provincialDirectory,
        provincialDirectoryWidth + 146,
        headerHorGap * 2
      );
      doc.text(teachingSchool, teachingSchoolWidth + 145, headerHorGap * 3);

      //! main title
      fontSize = 15;
      let title = "Le calcul mental";
      let examTitleWidth =
        (doc.getStringUnitWidth(title) * fontSize) / doc.internal.scaleFactor;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(fontSize);
      doc.text(
        title,
        (doc.internal.pageSize.width - examTitleWidth) / 2 - 7,
        27
      );
      doc.setLineWidth(0.5);
      doc.setDrawColor(130);
      doc.rect(
        (doc.internal.pageSize.width - examTitleWidth) / 2 - 9,
        22,
        examTitleWidth + 8,
        fontSize * 0.5
      );

      //! Exam title
      fontSize = 13;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(fontSize);
      // let examTitle = "Examen d'addition, les nombres de 0 à 10 - 1 AEP"
      let examTitle = `Examen: ${examOperations.toUpperCase()}, ${examTables}   -${examLevels}-`;
      let getTextWidth = doc.getTextWidth(examTitle);
      examTitleWidth = getTextWidth * doc.internal.scaleFactor;
      startX = (doc.internal.pageSize.width - examTitleWidth) / 2;
      let titleY = 40;
      let titleHeight = fontSize * 1;

      doc.setDrawColor(120);
      doc.setLineWidth(1);
      doc.rect(-10, titleY - titleHeight / 2, 10000, titleHeight - 2, "S");
      doc.text(examTitle, startX + examTitleWidth / 2, titleY, {
        align: "center",
        valign: "middle",
      });

      //! table
      fontSize = 10;
      doc.setFontSize(fontSize);
      doc.setLineWidth(0.1);
      doc.setDrawColor(130);

      const columnWidths = [37, 50, 37, 37, 37];
      const totalTableWidth = columnWidths.reduce(
        (total, width) => total + width,
        0
      );

      // Define the width and height of each cell
      const columnWidth = 37;
      const cellHeight = fontSize * 1;
      // Define the starting position of the table
      startX = (doc.internal.pageSize.width - totalTableWidth) / 2;
      startY = 50;
      // Add column headers with borders
      columns.forEach((column, columnIndex) => {
        const columnWidth = columnWidths[columnIndex];
        const cellX =
          startX +
          columnWidths
            .slice(0, columnIndex)
            .reduce((total, width) => total + width, 0);
        const cellY = startY;
        doc.setFont("helvetica", "bold");
        doc.setFillColor(200, 200, 280);
        doc.rect(cellX, cellY, columnWidth, cellHeight, "F");
        doc.setFillColor(0);
        doc.rect(cellX, cellY, columnWidth, cellHeight, "S");
        doc.text(column, cellX + columnWidth / 2, cellY + cellHeight / 2, {
          align: "center",
          valign: "middle",
        });
      });

      // Add data rows with borders

      rows.forEach((row, rowIndex) => {
        startY += cellHeight;
        row.forEach((cell, columnIndex) => {
          const columnWidth = columnWidths[columnIndex];
          const cellX =
            startX +
            columnWidths
              .slice(0, columnIndex)
              .reduce((total, width) => total + width, 0);
          const cellY = startY;
          doc.setFont("helvetica", "normal");
          doc.rect(cellX, cellY, columnWidth, cellHeight, "S");

          doc.text(cell.toString(), cellX + 3, cellY + cellHeight / 2);
        });
      });

      //! footer
      doc.setFontSize(fontSize - 1);
      doc.text(
        "Signature de l'enseignant",
        20,
        doc.internal.pageSize.height - 18
      );
      doc.text(
        "Signature du directeur",
        doc.internal.pageSize.width / 2 - 15,
        doc.internal.pageSize.height - 18
      );
      doc.text(
        "Signature de l'inspecteur",
        doc.internal.pageSize.width - 52,
        doc.internal.pageSize.height - 18
      );
    }

    doc.save(examName);
  }

  //! Upload diagnostics to server
  recentServerUpload();
}
