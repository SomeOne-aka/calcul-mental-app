function calculateFinalNoteWithDuration(quizDuration, questionNumber, quizScore) {
    let bestTimePerQuestion = 1;
    let quizDurationSec = (quizDuration / 1000)
    let perfectTime = questionNumber * bestTimePerQuestion

    if(quizDurationSec < perfectTime) {
        finalNote = isInteger(toBase10(quizScore, questionNumber)) ? toBase10(quizScore, questionNumber) : toBase10(quizScore, questionNumber).toFixed(2)
    } else {
        finalNote = isInteger((toBase10(quizScore, questionNumber) - Math.log(quizDurationSec / perfectTime))) ? (toBase10(quizScore, questionNumber) - Math.log(quizDurationSec / perfectTime)) : (toBase10(quizScore, questionNumber) - Math.log(quizDurationSec / perfectTime)).toFixed(2)
        if(finalNote < 0 ) finalNote = 0
    }

    return finalNote
}

//! Used Functions
function isInteger(number) {
    return number % 1 === 0;
}

function toBase10 (number, questionNumber) {
    return number * 10 / questionNumber
}