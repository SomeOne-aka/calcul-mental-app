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

//! teacherId
let teacherId = localStorage.getItem("teacherId");
if (!teacherId) {
  localStorage.setItem("teacherId", uniqueid(14));
}

//! Select widget logic
selectWidgetLogic();

//! if teacher profile already saved display it
displayTeacherProfile();

//! Fill The scholar saison
let scholarSaisonEl = document.querySelector(".scholar-saison");
scholarSaisonEl.textContent = getScholarSaison();

//! Immediate input checking
let totalStudentsEl = document.querySelector("#totalStudents");
totalStudentsEl.addEventListener("input", (ev) => {
  let inputValue = ev.target.value;
  let sanitizedValue = inputValue.replace(/[^0-9]/g, "");
  totalStudentsEl.value = sanitizedValue;
});
let teacherFLNameEls = document.querySelectorAll(
  "#teacherLastName, #teacherFirstName"
);
teacherFLNameEls.forEach((teacherEl) => {
  teacherEl.addEventListener("input", (ev) => {
    let inputValue = ev.target.value;
    let sanitizedValue = inputValue.replace(/[0-9]/g, "");
    teacherEl.value = sanitizedValue;
  });
});

//! save profile data
let saveProfileBtnEl = document.querySelector(".save-profile");
saveProfileBtnEl.addEventListener("click", (_) => {
  let formData = { formErrors: 0 };

  // teacherFName, teacherLName, numberOfStudents, ...
  let textInputEls = document.querySelectorAll(".form-controller > input");
  textInputEls.forEach((textInputEl) => {
    textInputEl.classList.remove("error");
    textInputEl.classList.remove("success");

    if (
      textInputEl.id == "teacherLastName" ||
      textInputEl.id == "teacherFirstName" ||
      textInputEl.id == "teacherPPR"
    ) {
      return;
    }

    if (textInputEl.value == "") {
      textInputEl.classList.add("error");
      formData.formErrors++;
      return;
    } else {
      textInputEl.classList.add("success");
    }
  });

  // classes and languages
  let SelectHeadEls = document.querySelectorAll(".select-head");
  SelectHeadEls.forEach((selectHeadEl) => {
    selectHeadEl.classList.remove("succes");
    selectHeadEl.classList.remove("error");
  });
  checkSelectedInputs("teachingLevels", formData);
  checkSelectedInputs("teachingLanguages", formData);

  if (formData.formErrors > 0) {
    return;
  }

  let teacherProfile = {
    teacherLastName: document.querySelector('input[name="teacherLastName"]')
      .value,
    teacherFirstName: document.querySelector('input[name="teacherFirstName"]')
      .value,
    teacherPPR: document.querySelector('input[name="teacherPPR"]').value,
    teachingSchool: document.querySelector('input[name="teachingSchool"]')
      .value,
    totalStudents: document.querySelector('input[name="totalStudents"]').value,
    regionalAcademy: document.querySelector('input[name="regionalAcademy"]')
      .value,
    provincialDirectory: document.querySelector(
      'input[name="provincialDirectory"]'
    ).value,
    scholarSaison: getScholarSaison(),

    teachingLevels: Array.from(
      document.querySelectorAll(`input[name="teachingLevels"]:checked`)
    ).map((el) => el.value),
    teachingLanguages: Array.from(
      document.querySelectorAll(`input[name="teachingLanguages"]:checked`)
    ).map((el) => el.value),
  };

  localStorage.setItem("teacherProfile", JSON.stringify(teacherProfile));

  location.reload();
});

//! Utility functions

function displayTeacherProfile() {
  let teacherProfile = JSON.parse(localStorage.getItem("teacherProfile"));

  if (!teacherProfile) return;

  let teachingLevels = teacherProfile.teachingLevels;
  teachingLevels.forEach((teachingLevel) => {
    document.querySelector(
      `input[name="teachingLevels"][value="${teachingLevel}"]`
    ).checked = true;
  });
  document.querySelector(".teachingLevels .selected").textContent =
    teachingLevels.join(",  ");

  let teachingLanguages = teacherProfile.teachingLanguages;
  teachingLanguages.forEach((teachingLanguage) => {
    document.querySelector(
      `input[name="teachingLanguages"][value="${teachingLanguage}"]`
    ).checked = true;
  });
  document.querySelector(".teachingLanguages .selected").textContent =
    teachingLanguages.join(",  ");

  document.querySelector('input[name="teacherLastName"]').value =
    teacherProfile.teacherLastName.toUpperCase();
  document.querySelector('input[name="teacherFirstName"]').value =
    teacherProfile.teacherFirstName.toUpperCase();
  document.querySelector('input[name="teacherPPR"]').value =
    teacherProfile.teacherPPR.toUpperCase();
  document.querySelector('input[name="teachingSchool"]').value =
    teacherProfile.teachingSchool.toUpperCase();
  document.querySelector('input[name="totalStudents"]').value =
    teacherProfile.totalStudents.toUpperCase();
  document.querySelector('input[name="regionalAcademy"]').value =
    teacherProfile.regionalAcademy.toUpperCase();
  document.querySelector('input[name="provincialDirectory"]').value =
    teacherProfile.provincialDirectory.toUpperCase();
}

function checkSelectedInputs(selectClass, formData) {
  let InputEl = document.querySelectorAll(`input[name=${selectClass}]:checked`);
  let inputsArr = Array.from(InputEl).map((el) => el.value);
  if (inputsArr.length == 0) {
    document.querySelector(`.${selectClass}`).classList.add("error");
    formData.formErrors++;
    return;
  } else {
    document.querySelector(`.${selectClass}`).classList.add("success");
  }
}

//! Upload diagnostics to server
recentServerUpload();
