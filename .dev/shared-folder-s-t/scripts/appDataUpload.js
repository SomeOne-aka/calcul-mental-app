function uploadAppDiagnosticsToServer() {
  let teacherProfile = JSON.parse(localStorage.getItem("teacherProfile"));

  let exams = JSON.parse(localStorage.getItem("exams"));
  let examCompletedNumber = 0;
  let examNotCompletedNumber = 0;

  let teacherId = localStorage.getItem("teacherId");

  let teachingLevels = teacherProfile?.teachingLevels?.map((el) => Number(el));

  exams?.forEach((exam) => {
    exam?.status?.completed == true
      ? examCompletedNumber++
      : examNotCompletedNumber++;
  });

  let teacherRating = localStorage.getItem("teacherComments");

  let teacherComments = JSON.parse(localStorage.getItem("teacherComments"));

  let numberOfExamDownloads = localStorage.getItem("numberOfExamDownloads")
    ? parseInt(localStorage.getItem("numberOfExamDownloads"))
    : 0;

  let numberOfVisitsStudentPages = localStorage.getItem(
    "numberOfVisitsStudentPages"
  )
    ? parseInt(localStorage.getItem("numberOfVisitsStudentPages"))
    : 0;

  let numberOfVisitsTeacherPages = localStorage.getItem(
    "numberOfVisitsTeacherPages"
  )
    ? parseInt(localStorage.getItem("numberOfVisitsTeacherPages"))
    : 0;

  let appData = {
    scholarSaison: teacherProfile?.scholarSaison,
    provincialDirectory: teacherProfile?.provincialDirectory,
    regionalAcademy: teacherProfile?.regionalAcademy,
    teachingLanguages: teacherProfile?.teachingLanguages,
    teachingLevels,
    teachingSchool: teacherProfile?.teachingSchool,
    totalStudents: Number(teacherProfile?.totalStudents) || 0,
    totalExamNumber: exams?.length ?? 0,
    examCompletedNumber,
    examNotCompletedNumber,
    teacherComments: teacherComments ?? [],
    teacherRating: Number(teacherRating) || 50,
    numberOfExamDownloads,
    numberOfVisitsStudentPages,
    numberOfVisitsTeacherPages,
    teacherId,
  };

  const endpointUrl = "https://www.roboy.tech/calcul-mental-app/app-data";

  fetch(endpointUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(appData),
  });
}
