function styleStgTabs() {
    /// Show Class/Exam Container 

    let examTabsEls = document.querySelectorAll('.stg-tab')


    examTabsEls.forEach(tabEl => {
        tabEl.addEventListener('click', function() {
            examTabsEls.forEach(tabElx => tabElx.classList.remove('active'))
            tabEl.classList.add('active')
        })
    })
}