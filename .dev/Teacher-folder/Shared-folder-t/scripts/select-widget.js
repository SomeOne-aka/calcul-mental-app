function selectWidgetLogic() {

    // Fetch all className and classId and classStudents from LS
    let classes = JSON.parse(localStorage.getItem('classes'))
    //! Populate the classe-list container
    let classeListEl = document.querySelector('.classe-list') ?? []
    // else the classe is set in LS
    classes?.forEach(classe => {
        classeListEl.innerHTML += `
            <li class="select-list-item">
                <span class="leading">
                    <input type="checkbox" name="classe" value="${classe.className}" data-classId="${classe.classId}">
                </span>
                <span class="trailing">${classe.className}</span>
            </li>   
        `
    })
    classeListEl.innerHTML += `
        <li class="select-list-item">
            <span class="leading">
                <input type="checkbox" name="classe" value="élèves spécifiques">
            </span>
            <span class="trailing">Elèves spécifiques</span>
        </li> 
    `

    //! Select Widget

    // Apply The Dom Traversal and events Handlers on every select container
    let selectContainerEl_s = document.querySelectorAll('.select-container')
    selectContainerEl_s.forEach(selectContainerEl => {
        // DOM Elements relative to Each Select Container
        let selectHeadEl = selectContainerEl.querySelector('.select-container .select-head')
        let arrowEl = selectContainerEl.querySelector('.select-container .arrow i')
        let selectListEl = selectContainerEl.querySelector('.select-container .select-list')
        let selectListItemEls = selectContainerEl.querySelectorAll('.select-container .select-list-item')
        let selectedEl = selectContainerEl.querySelector('.select-container .selected')
        

        // Reveal the select list when we click on the head
        selectHeadEl.addEventListener('click', function() {

            //! Block eleves ciblés select container from revealing 
            if(selectContainerEl.classList.contains('blocked')) {
                // Show/Hide Student check list
                let studentsCheckListContainerEl = document.querySelector('.students-check-list-container')
                studentsCheckListContainerEl.classList.toggle('show-hide')
                // Toggle arrow
                arrowEl.classList.toggle('spin')
                return ;
            }

            //! operation ----> table
            if(selectHeadEl.classList.contains("table")) {
                let operationEls = document.querySelectorAll('input[name="operation"]:checked')
                let operation = Array.from(operationEls).map(function(operation) {
                    return operation.value
                });
                if(operation.length == 0) return
            }

            //! Hide All Select Lists other than current + Flip their arrows
            let currentSelectListEl = this.nextElementSibling // currentSelect

            let currentSelectListSiblingsEls = Array.from(document.querySelectorAll('.select-container .select-list'))
            .filter(selectListEl => selectListEl != currentSelectListEl) // Siblings to hide

            currentSelectListSiblingsEls.forEach(currentSelectListSiblingsEl => {
                currentSelectListSiblingsEl.classList.remove('reveal') // Hide Select list siblings
                currentSelectListSiblingsEl.previousElementSibling.querySelector(".arrow i").classList.remove('spin') // Turn The arrow down
            })
            // Toggle The current Select List + Toggle the arrow state
            currentSelectListEl.classList.toggle('reveal')
            arrowEl.classList.toggle('spin')
        })
        

        // When we click on the list item
        selectListItemEls.forEach(selectListItemEl => {            
            selectListItemEl.addEventListener('click', _ => {

                //! Unavailable features
                if(selectListItemEl.classList.contains('unavailable')) {
                    // Show Warning Modal

                    return;
                }

                //! classe -- students
                // if we select specifiques eleves select-list-item
                if(selectListItemEl.querySelector('input[name="classe"][value="élèves spécifiques"]')) {
                    // spec elev select-list-item siblings
                    let classeListItemEls = Array.from(selectListItemEls).filter(selectListItemElX => {
                        return selectListItemElX != selectListItemEl
                    })
                    // Uncheck all siblings (classe list item)
                    classeListItemEls.forEach(classeListItemEl => {
                        classeListItemEl.querySelector('input[name="classe"]').checked = false
                    })
                    // Hide select container list
                    selectListItemEl.parentElement.classList.remove('reveal')
                    // arrowEl.classList.remove('spin')
                    // Block eleves select container from opening again
                    selectContainerEl.classList.add('blocked')
                    // Reveal class Students container
                    revealStudentsCheckList()
                }


                // Check The input:checkbox when we click on the select list item
                // Single selection Select list
                if(selectContainerEl.classList.contains("single-selection")) {
                    selectListItemEls.forEach(selectListItemEl => selectListItemEl.querySelector('input').checked = false) // Turn all checkboxes to false
                    selectListItemEl.querySelector('input').checked = true // Turn the current Clicked checkbox to true
                }
                // Multiple selection Select list
                else {
                    selectListItemEl.querySelector('input').checked = selectListItemEl.querySelector('input').checked == true ? false : true
                }

                //------ Get the checked List Element(s) value ------
                let checkboxEls = selectListEl.querySelectorAll('input')
                let checkedCheckboxEls = Array.from(checkboxEls).filter(checkboxEl => checkboxEl.checked == true)

                // Display selected list items in the head
                let selectedItemsText = ""
                checkedCheckboxEls.forEach(checkedCheckboxEl => {
                    selectedItemsText += checkedCheckboxEl.getAttribute("value") + ", "
                })
                selectedItemsText =  selectedItemsText.trim().slice(0, -1)
                selectedEl.innerText = selectedItemsText    

                //! table lists
                // operation multiplication -> table 0,1,2,...,12
                if(selectListItemEl.querySelector('input[name="operation"][value="multiplication"]')) {

                    let listItem0_10El = document.querySelector('li.select-list-item input[name="table"][value="0-10"]')?.parentNode?.parentNode;
                    listItem0_10El.style.display = "none"
                    let listItem0_5El = document.querySelector('li.select-list-item input[name="table"][value="0-5"]')?.parentNode?.parentNode;
                    listItem0_5El.style.display = "none"
                    let listItem11_20El = document.querySelector('li.select-list-item input[name="table"][value="11-20"]')?.parentNode?.parentNode;
                    listItem11_20El.style.display = "none"
                    let listItem21_100El = document.querySelector('li.select-list-item input[name="table"][value="21-100"]')?.parentNode?.parentNode;
                    listItem21_100El.style.display = "none"

                    // Show 0->12 for multiplication
                    for (let i = 0; i < 13; i++) {
                        let listItem0123456789101112El = document.querySelector(`li.select-list-item input[name="table"][value="${i}"]`)?.parentNode?.parentNode;
                        listItem0123456789101112El.style.display = "flex"
                    }
                    } else if(selectListItemEl.querySelector('input[name="operation"][value="addition"]') || selectListItemEl.querySelector('input[name="operation"][value="soustraction"]')){
                        let listItem0_10El = document.querySelector('li.select-list-item input[name="table"][value="0-10"]')?.parentNode?.parentNode;
                        listItem0_10El.style.display = "flex"
                        let listItem0_5El = document.querySelector('li.select-list-item input[name="table"][value="0-5"]')?.parentNode?.parentNode;
                        listItem0_5El.style.display = "flex"
                        let listItem11_20El = document.querySelector('li.select-list-item input[name="table"][value="11-20"]')?.parentNode?.parentNode;
                        listItem11_20El.style.display = "flex"
                        let listItem21_100El = document.querySelector('li.select-list-item input[name="table"][value="21-100"]')?.parentNode?.parentNode;
                        listItem21_100El.style.display = "flex"

                        // Hide 0->12 for addition & soustraction
                        for (let i = 0; i < 13; i++) {
                            let listItem0123456789101112El = document.querySelector(`li.select-list-item input[name="table"][value="${i}"]`)?.parentNode?.parentNode;
                            listItem0123456789101112El.style.display = "none"
                        }
                    }

                //! duration-constraint -- question-duration

                if(selectListItemEl.querySelector('input[name="duration-constraint"][value="déterminé"]')){
                        let questionDurationInputEl = document.querySelector('#question-duration-input');
                        questionDurationInputEl.style.display = "inline-block"
                        //! Validate question-duration on the fly
                        questionDurationInputEl.addEventListener('input', _ => {
                            const inputValue = questionDurationInputEl.value;
                            const sanitizedValue = inputValue.replace(/[^0-9]/g, ''); // Remove non-numeric characters
                    
                            if (inputValue !== sanitizedValue) {
                                questionDurationInputEl.value = sanitizedValue;
                            }
                        })

                    } else if(selectListItemEl.querySelector('input[name="duration-constraint"][value="indéterminé"]')){
                        let questionDurationInputEl = document.querySelector('#question-duration-input');
                        questionDurationInputEl.style.display = "none"
                        questionDurationInputEl.value = ""
                    } 

            })
        })
    })
}

