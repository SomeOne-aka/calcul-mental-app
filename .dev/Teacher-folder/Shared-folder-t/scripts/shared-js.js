
//! Side Bar 
// DOM Elements
let toolbarEl = document.querySelector('.toolbar')
let toggleMainNavigationEl = document.querySelector('.toggle-main-navigation')
let mainNavigationEl = document.querySelector('.main-navigation')
let mainNavigationSpanEls = document.querySelectorAll('.main-navigation span')
let workAreaEl = document.querySelector('.work-area')

let mainNavigationIsHided = JSON.parse(localStorage.getItem('mainNavigationIsHided')) ?? true;

///*** DOMContentLoaded 
// Set the margin of the Work Area
document.addEventListener('DOMContentLoaded', _ => {

    //! GIF Loading Animation Page transition
    let loadingScreenEl = document.querySelector(".loading-screen")
    loadingScreenEl.style.opacity  = 0


    workAreaEl.style.marginLeft = `${mainNavigationEl.offsetWidth}px`
    workAreaEl.style.marginTop = `${toolbarEl.offsetHeight}px`
    // Show or Hide Main Nav Element based on the local storage
    if(mainNavigationIsHided) {
        mainNavigationSpanEls.forEach(spanEl => spanEl.classList.add('collapse'))
        toggleMainNavigationEl.classList.add('active')
    }
    // Update the margin left of the work area
    workAreaEl.style.marginLeft = `${mainNavigationEl.offsetWidth}px`

    /// Style stg Tabs When click
    // styleStgTabs()

})

// Collapse Main Navigation + Set The margin left of Work Area
toggleMainNavigationEl.addEventListener('click', _ => {
    mainNavigationSpanEls.forEach(spanEl => spanEl.classList.toggle('collapse'))
    toggleMainNavigationEl.classList.toggle('active')
    // Update the local storage: mainNavigationIsHided
    mainNavigationIsHided = mainNavigationSpanEls[1].classList.contains('collapse') ? true : false
    localStorage.setItem('mainNavigationIsHided', JSON.stringify(mainNavigationIsHided))
    // Update the margin left of the work area
    workAreaEl.style.marginLeft = `${mainNavigationEl.offsetWidth}px`
})



//! Class / Exam
// Add Class/Exam Container
let stgNameInputEl = document.querySelector('#add-stg-input')
let addStgBtnEl = document.querySelector('#add-stg-btn')

// Class/Exam Tabs Container
let stgTabsContainerEl = document.querySelector('.tabs-container')

// Class/Exam Container
let stgContainerEl = document.querySelector('.stg-container')

// Class/Exam inner Container
let stgNameHeadingEl = document.querySelector('.stg-name-heading')


/// Add Class/Exam To Class/Exam Tabs
addStgBtnEl?.addEventListener('click', _ => {
    if(!stgNameInputEl.classList.contains('reveal')) {
        stgNameInputEl.classList.add('reveal')
        return
    }
})



//! Prevent Form Submission
document.querySelector("form")?.addEventListener('submit', e => e.preventDefault())

//! Student Added
let submitStudentBtnEl = document.querySelector('.submit-student-btn')
submitStudentBtnEl?.addEventListener('click', _ => {
    // PopUp: Student added Alert
    successAlert(submitStudentBtnEl.dataset.type)
})
//! Student Deleted
// Student file

//! PopUp Box : Alert / Confirm
/// Success Alert
// success-alert file
/// Confirm delete
// confirm-delete file

//! Style stg Tabs onclick
// function styleStgTabs() {
//     /// Show Class/Exam Container 
//     stgTabsEls = document.querySelectorAll('.stg-tab')

//     stgTabsEls.forEach(stgTab => {
//         stgTab.addEventListener('click', function() {
//             stgTabsEls.forEach(stgTabEl => stgTabEl.classList.remove('active'))
//             stgTab.classList.add('active')
//             // stgContainerEl.style.maxHeight = "2000px"
//         })
//     })
// }