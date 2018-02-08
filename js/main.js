// Treehouse Techdegree Project 3: Build an Interactive Form

// I am aiming for an "Exceeds Expectations" grade with this project.

// Make sure the DOM loads first
document.addEventListener('DOMContentLoaded', (event) => {

    // focus on the first text field, "name"
    $('#name').focus();

    // if "other is clicked in 'Job Role' field, a text entry box opens
    // an event handler for selecting "other"
    $('#title').on('change', (event) => {

        const option = event.target;

        // check to see if the "other" option was clicked,
        if (option.value === "other") {
            // if the textarea box already exists, do nothing
            if (!(document.getElementById('other-title'))) {
                let textarea = document.createElement('textarea')
                $(textarea).attr('id', 'other-title').attr('name', 'user_other_title');
                option.after(textarea);
            }
        } else { // a different option was selected, so remove the 
            //textarea box if it exists
            if (document.getElementById('other-title')) {
                let textarea = document.getElementById('other-title')
                textarea.parentNode.removeChild(textarea);
            }
        }
    });

});