// Treehouse Techdegree Project 3: Build an Interactive Form

// I am aiming for an "Exceeds Expectations" grade with this project.

// Make sure the DOM loads first
document.addEventListener('DOMContentLoaded', (event) => {

    const $colorDiv = $('#colors-js-puns');
    const $colorOptions = $('#color').children(); // reference list to the options in the color <select> box
    let confCost = 0;
    let activityCheckboxes = $('.activities label');
    let activityTimes = []; // array to store the day, start time and end time of the event


    // display the total cost after the "activities" fieldset
    function displayTotal(total) {
        if ($('.total_cost')) { $('.total_cost').remove(); }
        if (total > 0) {
            let htmlString = '<p class="total_cost">Total: $' + total + '</p>';
            $('.activities').append(htmlString);
        }
    }

    // array passed in for firstTime and secondTime should consist of day, start time, end time
    function doesTimeOverlap(firstTime, secondTime) {
        if (firstTime[0] === secondTime[0]) { // this means the day is the same, check for overlap

            for (let i = firstTime[1]; i <= firstTime[2]; i++) { // step through every hour in the first range
                // if the second time's start time is within range, there is overlap
                // except if the second time is starting at the last number in the range, because that means
                // the event starts immediately after the other event - this should be allowed
                if (i === secondTime[1] && !(secondTime[1] === firstTime[2])) {
                    return true;
                }
                // as with the previous case, if the event ends at a specific time and the new event begins 
                // immediately, this should be allowed
                if (i === secondTime[2] && (!secondTime[2] === firstTime[1])) {
                    return true;
                }
            }

        }
        return false; // as a default, return false
    }

    // retrieve the amount for an activity by returning the value after the $ sign in the description
    // of the activity 
    // this assumes that the $ amount is always the last part of the string (as is the case in 
    // the supplied index.html)
    function getAmount(checkboxLabel) {
        let str = checkboxLabel.textContent;
        const index = str.indexOf('$') + 1; // start after the $ sign
        str = str.substring(index, str.length);

        // return as a number, so we can do calculations with the result
        return parseInt(str);
    }

    // function to determine if a string contains a reference to a specific day, e.g. "Tuesday"
    function containsDay(str, day) {
        if (str.includes(day)) {
            return true;
        } else return false;
    }

    // ON STARTUP

    // focus on the first text field, "name"
    $('#name').focus();

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

    // this section retrieves the activity days and times from the labels in the html
    // this info is saved in a two-dimensional array, activityTimes. The first dimension
    // of this array is a reference to the checkbox-label in question; the second dimension is an 
    // array structured as [day, start time, end time]
    // if no day is indicated, 0 is stored in the array
    // the code allows changes to be made to the events in the html, without having to change
    // the JavaScript coding - as long as the day [Tuesday / Wednesday] is explicitly named in the
    // label, and the time is given in the format 9am-12pm
    for (let i = 0; i < activityCheckboxes.length; i++) {

        let labelText = activityCheckboxes[i].textContent;

        // assign days to first position of nested array
        if (containsDay(labelText, "Tuesday")) {
            activityTimes[i] = [];
            activityTimes[i][0] = "Tuesday";
        } else if (containsDay(labelText, "Wednesday")) {
            activityTimes[i] = [];
            activityTimes[i][0] = "Wednesday";

        } else { // no day found, so return 0
            activityTimes[i] = [];
            activityTimes[i][0] = 0;
        }

        // assign start and end times to second and third position of nested array
        // the following regular expression checks for any one or two digits followed by am or pm
        let regExpTime = /([0-9]|[1-9][0-9])[ap]m/;
        let indexOfStartTime = labelText.search(regExpTime);
        let startOfStr = labelText.substring(indexOfStartTime);
        let indexOfComma = startOfStr.indexOf(',');
        let timeStr = startOfStr.substring(0, indexOfComma);
        // at this point, we have a string with a specific format, e.g. 9am-12pm
        // we know the first index of the string contains a number, but we need to check
        // if it maybe contains 2 numbers, retrieve the number, then delete either am or pm
        regExpTime = /[ap]m/; // to determine the index of the first am or pm
        let indexAmOrPm = timeStr.search(regExpTime);
        let firstTime = parseInt(timeStr.substring(0, indexAmOrPm));
        if (timeStr[indexAmOrPm] === 'a' || timeStr[indexAmOrPm] === 'A') { // the time must be am
            if (firstTime === 12) {
                firstTime === 0; // for the sake of calculation, 12am will be 0:00 o'clock
            } // any other number than 12 does not need to be converted
        } else { // the time must be pm
            if (firstTime !== 12) {
                firstTime += 12; // convert to military time
            } // 12pm does not need to be converted to military time, for the sake of calculation
        }
        // now, find the number after the -
        let numStart = timeStr.indexOf('-') + 1; // the next time follows a dash
        regExpTime = /[ap]m$/;
        indexAmOrPm = timeStr.search(regExpTime);
        let secondTime = parseInt(timeStr.substring(numStart, indexAmOrPm));

        if (timeStr[indexAmOrPm] === 'a' || timeStr[indexAmOrPm] === 'A') { // the time must be am
            if (secondTime === 12) {
                secondTime === 0; // for the sake of calculation, 12am will be 0:00 o'clock
            } // any other number than 12 does not need to be converted
        } else { // the time must be pm
            if (secondTime !== 12) {
                secondTime += 12; // convert to military time
            } // 12pm does not need to be converted to military time, for the sake of calculation
        }

        if (indexOfStartTime > 0) { // a time was actually returned, otherwise index would be -1

            activityTimes[i][1] = firstTime;
            activityTimes[i][2] = secondTime;

        }
    }

    // EVENT HANDLERS

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

    // add an event handler on the checkboxes in the activities fieldset
    $('.activities').on('change', (event) => {
        checkbox = event.target;
        if (checkbox.checked) {
            confCost += getAmount(checkbox.parentNode);
        } else {
            confCost -= getAmount(checkbox.parentNode);
        }
        displayTotal(confCost);
    });
});