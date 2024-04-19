//! increment numberOfVisitsStudentPages
let numberOfVisitsStudentPages = JSON.parse(
  localStorage.getItem("numberOfVisitsStudentPages")
);
if (numberOfVisitsStudentPages) {
  numberOfVisitsStudentPages++;
  localStorage.setItem(
    "numberOfVisitsStudentPages",
    numberOfVisitsStudentPages
  );
} else {
  localStorage.setItem("numberOfVisitsStudentPages", 1);
}

//! get exam_id & student_id from URL
const currentURL = window.location.href;

const searchParams = new URLSearchParams(new URL(currentURL).search);

let studentId = searchParams.get("student-id");
let examId = searchParams.get("exam-id");
let fromQuizPage = searchParams.get("from-quiz-page");

//! get class
let classes = JSON.parse(localStorage.getItem("classes"));
let classe = classes.find((classe) =>
  classe.classStudents.some((student) => student.studentId == studentId)
);
let student = classe.classStudents.find(
  (student) => student.studentId == studentId
);

//! Display fullname and classname
document.querySelector(".full-name").textContent =
  student.studentFirstName + " " + student.studentLastName;
document.querySelector(".classe").textContent = classe.className.toUpperCase();

//! get records
let records = JSON.parse(localStorage.getItem("records"));

let currentRecords = records.filter(
  (record) => record.studentId == studentId && record.examId == examId
);

let currentRecord = currentRecords.at(-1).quizRecord;

//! Get exam
let exams = JSON.parse(localStorage.getItem("exams"));
let exam = exams.find((exam) => exam.examId == examId);

//! Generate the Exam settings from JS
let questionNumber = +exam.settings.questionNumber;
let scoreObject = exam.settings.students
  .find((student) => student.studentId == studentId)
  .score.at(-1);
let quizScore = +scoreObject.quizScore;
let quizDuration = +scoreObject.fullTime;
let quizDurationSec = Math.round(quizDuration / 1000);
let finalNote;

// final note & quiz duration
calculateFinalNoteWithDuration(quizDuration, questionNumber, quizScore);

// DOM
document.querySelector(".score-total .denominator").textContent =
  "/" + questionNumber;
document.querySelector(".aside .final-note-mode").textContent =
  "La durée est incluse.";
document.querySelector(".score-total .main-number").textContent = quizScore;
document.querySelector(".note-finale .main-number").textContent = finalNote;
document.querySelector(".duration-totale .main-number").textContent =
  quizDurationSec + "s";

//! Generate the exam records from JS
let quizRecordsContainerEl = document.querySelector(".quiz-records");
let examOperation = exam.settings.operation[0];
let operation;
switch (examOperation) {
  case "multiplication":
    operation = "x";
    break;
  case "addition":
    operation = "+";
    break;
  case "soustraction":
    operation = "-";
    break;

  default:
    break;
}

currentRecord.forEach((record) => {
  generateRecords(record);
});

//! Used Functions
function isInteger(number) {
  return number % 1 === 0;
}

function toBase10(number) {
  return (number * 10) / questionNumber;
}

function generateRecords(record) {
  let fragment = document.createDocumentFragment();

  let quizRecordEl = document.createElement("div");
  quizRecordEl.classList.add("quiz-record");

  let number1El = document.createElement("span");
  number1El.classList.add("number1");
  number1El.textContent = record.number1;

  let operationEl = document.createElement("span");
  operationEl.classList.add("operation");
  operationEl.textContent = operation;

  let number2El = document.createElement("span");
  number2El.classList.add("number2");
  number2El.textContent = record.number2;

  let equalEl = document.createElement("span");
  equalEl.classList.add("equal");
  equalEl.textContent = "=";

  let studentAnswerEl = document.createElement("span");
  studentAnswerEl.classList.add("student-answer");
  studentAnswerEl.textContent = record.studentAnswer ?? "*";

  let correctAnswerEl = document.createElement("span");
  correctAnswerEl.classList.add("correct-answer");
  correctAnswerEl.textContent = record.answer;

  if (record.studentAnswer == record.answer) {
    correctAnswerEl.style.display = "none";
    quizRecordEl.style.borderColor = "green";
  } else {
    studentAnswerEl.style.textDecoration = "line-through";
    quizRecordEl.style.borderColor = "red";
  }

  quizRecordEl.appendChild(number1El);
  quizRecordEl.appendChild(operationEl);
  quizRecordEl.appendChild(number2El);
  quizRecordEl.appendChild(equalEl);
  quizRecordEl.appendChild(studentAnswerEl);
  quizRecordEl.appendChild(correctAnswerEl);

  fragment.appendChild(quizRecordEl);

  quizRecordsContainerEl.appendChild(fragment);
}

//! Return to Login page
let returnHomeIconEl = document.querySelector(".return-home-icon");

returnHomeIconEl.addEventListener("click", (_) => {
  window.location.href = "./../../../Quiz.html";
});
