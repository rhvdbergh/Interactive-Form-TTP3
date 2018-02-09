// Treehouse Techdegree Project 3: Build an Interactive Form

// I am aiming for an "Exceeds Expectations" grade with this project.

// Make sure the DOM loads first
document.addEventListener('DOMContentLoaded', (event) => {

    const $colorDiv = $('#colors-js-puns');
    const $colorOptions = $('#color').children(); // reference list to the options in the color <select> box
    let confCost = 0;

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

    // only display the color option if a selection is made in design drop down menu
    // hide the color selection area on page load
    $colorDiv.hide();

    // change all the options in the color div <select> box to include class attributes
    // and remove the extra text in brackets from the content
    // so we can use the class attributes to show / hide the options
    for (let i = 0; i < $colorOptions.length; i++) {
        let option = $colorOptions[i];
        if ($(option).text().toLowerCase().includes('js puns')) {
            $(option).addClass('color_opt_puns');
            $(option).text($(option).text().replace(' (JS Puns shirt only)', ''));
        }
        // replace does not work here, as the heart character (&#9829) does not register
        // so I'm using .substring() to remove the extra text
        if ($(option).text().toLowerCase().includes('js shirt')) {
            $(option).addClass('color_opt_heart');
            let optionText = $(option).text();
            // find where the bracket starts, the index should be 1 space before that
            // because the space should also be removed
            let indexOfBracket = optionText.indexOf('(') - 1;
            optionText = optionText.substring(0, indexOfBracket);
            $(option).text(optionText);
        }
    }

    // add an event handler on the design menu
    // to show and hide the color selection options
    $('#design').on('change', (event) => {
        const option = event.target;

        // hide the color div, in case "Select Theme" is re-selected from the box
        $colorDiv.hide();

        if (option.value === "js puns") {
            // retrieve the first option with puns
            const firstOptVal = $('.color_opt_puns').first().val();
            $('#color').val(firstOptVal).change();
            $('.color_opt_puns').show();
            $('.color_opt_heart').hide();
            $colorDiv.show();
        }
        if (option.value === "heart js") {
            // retrieve the first option with a heart
            const firstOptVal = $('.color_opt_heart').first().val();
            $('#color').val(firstOptVal).change();
            $('.color_opt_puns').hide();
            $('.color_opt_heart').show();
            $colorDiv.show();
        }
    });

    // display the total cost after the "activities" fieldset
    function displayTotal(total) {
        let htmlString = '<p>Total: $' + total + '</p>';
        $('.activities').append(htmlString);
    }

    // retrieve the amount for an activity by returning the value after the $ sign in the description
    // of the activity 
    // this assumes that the $ amount is always the last part of the string (as is the case in 
    // the supplied index.html)
    function getAmount(checkboxLabel) {
        let str = checkboxLabel.textContent;
        const index = str.indexOf('$') + 1; // start after the $ sign
        str = str.substring(index, str.length - 1);

        // return as a number, so we can do calculations with the result
        return parseInt(str);
    }

    // $checks = $('.activities label');
    // getAmount($checks[3]);

    displayTotal(confCost);


});