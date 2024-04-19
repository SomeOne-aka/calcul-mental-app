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

//! Teacher rating LS
let teacherRating = JSON.parse(localStorage.getItem("teacherRating"));
if (!teacherRating) {
  teacherRating = 50;
  localStorage.setItem("teacherRating", teacherRating);
}
//! Teacher comments LS
let teacherComments = JSON.parse(localStorage.getItem("teacherComments"));
if (!teacherComments) {
  teacherComments = [];
  localStorage.setItem("teacherComments", JSON.stringify(teacherComments));
}

//! Mood slider: ratings
let emojiSliderEl = document.querySelector(".emoji-slider");
let rangeSliderEl = document.querySelector("#emoji-range");
let progressBarEl = document.querySelector(".progress-bar");
let thumbEl = document.querySelector(".thumb");

let translationFactor = getComputedStyle(
  document.documentElement
).getPropertyValue("--dimensions-emoji-container");
let rangeSliderValue = teacherRating;

setRangeSlider(rangeSliderValue);

//! Display comments from LS
displayTeacherComments(teacherComments);
// Range Slide event
rangeSliderEl.addEventListener("input", function () {
  rangeSliderValue = this.value;

  setRangeSlider(rangeSliderValue);

  // Update teacherRating LS
  teacherRating = rangeSliderValue;
  localStorage.setItem("teacherRating", teacherRating);
});
// Debouncing
//?

//! teacher comments
let teacherCommentTextareaEl = document.querySelector(
  ".teacher-comment-textarea"
);

let saveCommentEl = document.querySelector(".save-comment");

saveCommentEl.addEventListener("click", (_) => {
  let teacherComment = teacherCommentTextareaEl.value
    .trim()
    .replace(/\n/g, " ")
    .trim();

  let teacherComments = JSON.parse(localStorage.getItem("teacherComments"));

  if (teacherComment.length > 0) {
    //? validate teacher comment
    teacherComments.push(
      teacherComment.charAt(0).toUpperCase() + teacherComment.slice(1)
    );
  }

  localStorage.setItem("teacherComments", JSON.stringify(teacherComments));

  teacherCommentTextareaEl.value = "";
  displayTeacherComments(teacherComments);
});

//! Utils function
function displayTeacherComments(teacherComments) {
  let teacherCommentsUlEl = document.querySelector(".teacher-comments");
  teacherCommentsUlEl.innerHTML = "";
  teacherComments.forEach((teacherComment, commentIndex) => {
    let teacherCommentLiEl = document.createElement("li");

    let teacherCommentContentEl = document.createElement("span");
    teacherCommentContentEl.classList.add("teacher-comment-content");
    teacherCommentContentEl.textContent = teacherComment;

    let deleteCommentEl = document.createElement("i");
    deleteCommentEl.classList.add("fa-solid", "fa-trash");
    deleteCommentEl.addEventListener("click", (_) => {
      teacherComments.splice(commentIndex, 1);
      localStorage.setItem("teacherComments", JSON.stringify(teacherComments));
      displayTeacherComments(teacherComments);
    });

    teacherCommentLiEl.appendChild(teacherCommentContentEl);
    teacherCommentLiEl.appendChild(deleteCommentEl);
    teacherCommentsUlEl.appendChild(teacherCommentLiEl);
  });
}

function setRangeSlider(rangeSliderValue) {
  switch (true) {
    case rangeSliderValue >= 0 && rangeSliderValue < 20:
      emojiSliderEl.style.transform = `translateY(calc(-0*${translationFactor}))`;
      break;

    case rangeSliderValue >= 20 && rangeSliderValue < 40:
      emojiSliderEl.style.transform = `translateY(calc(-1*${translationFactor}))`;
      break;

    case rangeSliderValue >= 40 && rangeSliderValue < 60:
      emojiSliderEl.style.transform = `translateY(calc(-2*${translationFactor}))`;
      break;

    case rangeSliderValue >= 60 && rangeSliderValue < 80:
      emojiSliderEl.style.transform = `translateY(calc(-3*${translationFactor}))`;
      break;

    case rangeSliderValue >= 80 && rangeSliderValue <= 100:
      emojiSliderEl.style.transform = `translateY(calc(-4*${translationFactor}))`;
      break;
  }
  // Custom Slider
  progressBarEl.style.right = rangeSliderValue + "%";
  progressBarEl.style.width = rangeSliderValue + "%";
  thumbEl.style.left = rangeSliderValue + "%";
}

// Copyright footer current year
let currentYear = new Date().getFullYear();
document.querySelector(".current_year").textContent = currentYear;
