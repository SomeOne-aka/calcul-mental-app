//! Get student info and exam info
const currentURL = window.location.href;

const searchParams = new URLSearchParams(new URL(currentURL).search);

let studentId = searchParams.get("student-id");
let examId = searchParams.get("exam-id");
let fromLoginPage = searchParams.get("from-login-page");

if (!fromLoginPage) {
  const absoluteURLPathLoginPage = new URL(
    "../../../Quiz.html",
    window.location.href
  ).href;
  window.location.href = absoluteURLPathLoginPage;
}

let classes = JSON.parse(localStorage.getItem("classes"));

let classe = classes.filter((classe) => {
  return classe.classStudents.some((student) => student.studentId == studentId);
})[0];

let classId = classe.classId;

let student = classe.classStudents.find(
  (student) => student.studentId == studentId
);

let exams = JSON.parse(localStorage.getItem("exams"));

let exam = exams.find((exam) => exam.examId == examId);

//! Populate the DOM
let studentFullNameEl = document.querySelector(".student-fullname");
let classeEl = document.querySelector(".classe");

let studentFullName = student.studentFirstName + " " + student.studentLastName;
let classeName = classe.className;

studentFullNameEl.textContent = studentFullName;
classeEl.textContent = classeName;

//! Exam settings
let fullTime = Date.now();
let step = 0;
let quizScore = 0;
let questionNumber = exam?.settings?.questionNumber;
let durationConstraint =
  exam?.settings?.durationConstraint == "indéterminé" ? false : true;
let questionDuration = +exam.settings?.questionDuration;
let operation = exam?.settings?.operation[0];
let table = exam.settings?.table;
let studentAnswerCorrectness;
let examClassesId = exam?.settings?.classes;
let examStudents = exam?.settings?.students;
let multipleTentative =
  exam.settings?.multipleTentative == "oui" ? true : false;

//! quiz record
let record = {
  examId,
  studentId,
  classId,
  quizRecord: [],
};

//! quiz timer == countDown clock
let countdownClockEl = document.querySelector(".countdown-clock");
document.documentElement.style.setProperty(
  "--question-duration",
  questionDuration + "s"
);
let timer;

let quizMaker;
switch (operation) {
  case "multiplication":
    quizMaker = multiplicationQuizMaker;
    break;
  case "addition":
    quizMaker = additionQuizMaker;
    break;
  case "soustraction":
    quizMaker = soustractionQuizMaker;
    break;

  default:
    break;
}
quizMaker();

//! Instant input validation
instantInputChecking();

//! Submit the answer & input validation
let nextBtnEl = document.querySelector(".next-btn");
let studentAnswerEl = document.querySelector("#student-answer");
nextBtnEl.addEventListener("click", (_) => {
  checkAnwserAndMesageAndQuizMaker();
});

studentAnswerEl.addEventListener("keypress", (e) => {
  if (e.key == "Enter") {
    checkAnwserAndMesageAndQuizMaker();
  }
});

//! Utility functions

function multiplicationQuizMaker() {
  let number1Array = table.map((str) => parseInt(str));
  let number1 = number1Array[Math.floor(Math.random() * number1Array.length)];
  let number2 = Math.floor(Math.random() * 11);

  //! DOM
  quizMakerGenericDOM("x", number1, number2);
}

function additionQuizMaker() {
  let joinedTable = table.join("-").split("-");
  let min = joinedTable[0];
  let max = joinedTable.pop();

  let number1 = Math.floor(Math.random() * (max - min + 1) + min);
  let number2 = Math.floor(Math.random() * (max - min + 1) + min);

  quizMakerGenericDOM("+", number1, number2);
}

function soustractionQuizMaker() {
  let joinedTable = table.join("-").split("-");
  let min = joinedTable[0];
  let max = joinedTable.pop();

  let x = Math.floor(Math.random() * (max - min + 1) + min);
  let y = Math.floor(Math.random() * (max - min + 1) + min);

  let [number1, number2] = x >= y ? [x, y] : [y, x];

  quizMakerGenericDOM("-", number1, number2);
}

function checkAnswer() {
  let number1 = +document.querySelector(".number-1").textContent;
  let number2 = +document.querySelector(".number-2").textContent;
  let studentAnswer =
    document.querySelector("#student-answer").value == ""
      ? undefined
      : +document.querySelector("#student-answer").value;
  let answer;

  // clear timer
  clearTimeout(timer);

  switch (operation) {
    case "multiplication":
      answer = number1 * number2;
      break;
    case "addition":
      answer = number1 + number2;
      break;
    case "soustraction":
      answer = number1 - number2;
      break;
  }

  if (answer === studentAnswer) {
    quizScore++;
    studentAnswerCorrectness = true;
  } else {
    studentAnswerCorrectness = false;
  }

  //?! record of the quiz and student answer
  record.quizRecord.push({
    number1,
    number2,
    answer,
    studentAnswer,
  });

  return answer == studentAnswer;
}

function checkAnwserAndMesageAndQuizMaker() {
  checkAnswer();

  if (step == questionNumber) {
    //! save the quiz record in records LS
    quizRecorderLS();

    //! save the score in exam LS
    scoreLSSaver();

    //! set exam completed to true if completed
    checkExamCompletion();

    //! redirect to score page
    scorePageRedirect();
  } else {
    quizMaker();
  }
}

function quizRecorderLS() {
  let records = JSON.parse(localStorage.getItem("records"));
  if (records) {
    records.push(record);
    localStorage.setItem("records", JSON.stringify(records));
  } else {
    let records = [];
    records.push(record);
    localStorage.setItem("records", JSON.stringify(records));
  }
}

function scoreLSSaver() {
  fullTime = Date.now() - fullTime;

  if (examClassesId.length == 0) {
    let examStudent = examStudents?.find(
      (student) => student.studentId == studentId
    );
    if (!(!multipleTentative && examStudent?.score?.length > 0)) {
      examStudent?.score?.push({
        quizScore,
        fullTime,
      });
    }

    localStorage.setItem("exams", JSON.stringify(exams));
  } else {
    let examStudent = examStudents.find(
      (student) => student.studentId == studentId
    );

    if (examStudent) {
      if (multipleTentative) {
        examStudent?.score?.push({
          quizScore,
          fullTime,
        });
        localStorage.setItem("exams", JSON.stringify(exams));
      }
    } else {
      examStudent = {
        studentId,
        classId,
        score: [
          {
            quizScore,
            fullTime,
          },
        ],
      };

      examStudents.push(examStudent);

      localStorage.setItem("exams", JSON.stringify(exams));
    }
  }
}

function checkExamCompletion() {
  if (examClassesId.length == 0) {
    let examIncomplete = examStudents.some(
      (examStudent) => examStudent.score.length == 0
    );
    if (!examIncomplete) {
      exam.status.completed = true;
      if (multipleTentative == false) {
        exam.status.active = false;
      }
      localStorage.setItem("exams", JSON.stringify(exams));
    }
  } else {
    let totalExamStudents = 0;

    let examClassesInfo = classes.filter((classe) =>
      examClassesId.some((examClasseId) => classe.classId == examClasseId)
    );
    examClassesInfo.forEach((examClasseInfo) => {
      totalExamStudents += examClasseInfo.classStudents.length;
    });

    if (totalExamStudents == examStudents.length) {
      exam.status.completed = true;
      if (multipleTentative == false) {
        exam.status.active = false;
      }
      localStorage.setItem("exams", JSON.stringify(exams));
    }
  }
}

function scorePageRedirect() {
  const params = new URLSearchParams(); // object of methods

  params.append("student-id", studentId);
  params.append("exam-id", examId);
  params.append("student-fullname", studentFullName);
  params.append("class-name", classeName);

  const queryString = params.toString();

  const absoluteURLPath = new URL(
    "./../Score-page/index.html",
    window.location.href
  ).href;

  const url = absoluteURLPath + "?" + queryString;

  window.location.replace(url);
}

function quizMakerGenericDOM(operationSign, number1, number2) {
  let number1El = document.querySelector(".number-1");
  let number2El = document.querySelector(".number-2");
  let operationEl = document.querySelector(".operation");
  let studentAnswerEl = document.querySelector("#student-answer");
  number1El.textContent = number1;
  number2El.textContent = number2;
  operationEl.textContent = operationSign;
  studentAnswerEl.value = "";
  studentAnswerEl.focus();

  step++;

  let stepBarEl = document.querySelector(".step-bar");
  stepBarEl.style.width = (1 / questionNumber) * step * 100 + "%";

  if (durationConstraint) {
    timer = setTimeout(
      checkAnwserAndMesageAndQuizMaker,
      questionDuration * 1000
    );
  }
}

function instantInputChecking() {
  let studentAnswerEl = document.querySelector("#student-answer");
  studentAnswerEl.addEventListener("input", (_) => {
    const inputValue = studentAnswerEl.value;
    const sanitizedValue = inputValue.replace(/[^0-9]/g, ""); // Remove non-numeric characters

    if (inputValue !== sanitizedValue) {
      studentAnswerEl.value = sanitizedValue;
    }
  });
}
