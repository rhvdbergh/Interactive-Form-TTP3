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

    function toggleCheckboxValidity(checkbox) {
        if ($(checkbox).hasClass('invalid')) {
            $(checkbox).removeClass('invalid');
            $(checkbox).find('input').prop('disabled', false);
        } else {
            $(checkbox).addClass('invalid');
            $(checkbox).find('input').prop('disabled', true);
        }
    }

    // function to validate basic email layout using regular expression
    function validEmail(email) {
        let regExp = /.+\@.+\..+/;
        return regExp.test(email);
    }

    // function to check if any checkbox under activities selected
    function checkboxSelected() {
        for (let i = 0; i < activityCheckboxes.length; i++) {
            let checkbox = $(activityCheckboxes[i]).find('input');
            if (checkbox[0].checked) {
                return true;
            }
        }
        return false;
    }

    function creditCardNumberValid() {
        // test for valid 13-16 digit number
        let regExp = /\d{13}|\d{14}|\d{15}|\d{16}/;
        let creditCardNumberValid = regExp.test($('#cc-num').val());
        if ($('#cc-num').val().length > 16) { // there's more than 16 characters in the box!
            creditCardNumberValid = false;
        }
        return creditCardNumberValid;
    }

    function creditCardZipValid() {
        // test for valid 5 digit number
        regExp = /\d{5}/;
        let creditCardZipValid = regExp.test($('#zip').val());
        if ($('#zip').val().length > 5) { // there's more than 5 characters in the box!
            creditCardZipValid = false;
        }
        return creditCardZipValid;
    }

    function creditCardCVVValid() {
        // test for valid 3 digit number
        regExp = /\d{3}/;
        let creditCardCVVValid = regExp.test($('#cvv').val());
        if ($('#cvv').val().length > 3) { // there's more than 16 characters in the box!
            creditCardCVVValid = false;
        }
        return creditCardCVVValid;
    }
    // checks validity of data entered for credit card
    // will return true if credit card is not the method selected for payment
    function creditCardValid() {
        if ($('#payment').val() === 'credit card') {
            return (creditCardNumberValid() && creditCardZipValid() && creditCardCVVValid());

        }
        // function will return true if the payment method selected is not a credit card
        return true;
    }

    // check to see if all entries are valid
    function allEntriesValid() {

        if ($('#name').val() === "") { // name field shouldn't be blank
            return false;
        }

        if (!validEmail($('#mail').val())) { //  email field should contain valid email
            return false;
        }

        if (!checkboxSelected()) { // at least one checkbox should be selected
            return false;
        }

        if (!creditCardValid()) { // if credit card selected as payment, credit card numbers are valid
            return false;
        }
        return true;
    }

    // displays all invalid fields with appropriate messages
    // only EMPTY fields need to create new messages, since any name is acceptable
    // email validation is done realtime
    // if only one activities checkbox is ticked, it is valid
    // credit card validation is real-time
    // the email and credit card fields display different messages when empty and when not valid
    function displayInvalidFields() {
        if ($('#name').val() === "") { // name field shouldn't be blank
            // check to see if the label is already presented. If so, don't add again!
            if (!($('.name_empty_warning').is(':visible'))) {
                let nameWarning = document.createElement('label');
                $(nameWarning).addClass('name_empty_warning warning');
                $(nameWarning).text("Name field empty! Please enter a valid name.");
                $(nameWarning).insertBefore($('#name'));
                $(nameWarning).show();
            }
        } else { $('.name_empty_warning').hide(); } // problem resolved, remove message

        if ($('#mail').val() === "") { //  email field shouldn't be blank
            if (!($('.mail_empty_warning').is(':visible'))) {
                let mailEmptyWarning = document.createElement('label');
                $(mailEmptyWarning).addClass('mail_empty_warning warning');
                $(mailEmptyWarning).text("Email field empty! Please enter a valid email address.");
                $(mailEmptyWarning).insertBefore($('#mail'));
                $(mailEmptyWarning).show();
            }
        } else { $('.mail_empty_warning').hide(); }

        if (!checkboxSelected()) { // at least one checkbox should be selected
            if (!($('.no_activities_selected_warning').is(':visible'))) {
                let noActivitiesSelectedWarning = document.createElement('label');
                $(noActivitiesSelectedWarning).addClass('no_activities_selected_warning warning');
                $(noActivitiesSelectedWarning).text("Please select at least one activity.");
                $(noActivitiesSelectedWarning).insertBefore($('input[name="all"]'));
                $(noActivitiesSelectedWarning).show();
            }
        } else { $('.no_activities_selected_warning').hide(); }

        if ($('#cc-num').val() === "") { // credit card numbers should be added
            if (!($('.cc_num_empty_warning').is(':visible'))) {
                let ccNumWarning = document.createElement('label');
                $(ccNumWarning).addClass('cc_num_empty_warning warning');
                $(ccNumWarning).text("Please enter credit card number.");
                $(ccNumWarning).insertAfter($('#cc-num'));
                $(ccNumWarning).show();
            }
        } else { $('.cc_num_empty_warning').hide(); }

        if ($('#zip').val() === "") { // credit card zip should not be blank
            if (!($('.cc_zip_empty_warning').is(':visible'))) {
                let ccZipEmptyWarning = document.createElement('label');
                $(ccZipEmptyWarning).addClass('cc_zip_empty_warning warning');
                $(ccZipEmptyWarning).text("Please enter card zip code.");
                $(ccZipEmptyWarning).insertAfter($('#zip'));
                $(ccZipEmptyWarning).show();
            }
        } else { $('.cc_zip_empty_warning').hide(); }

        if ($('#cvv').val() === "") { // credit card CVV should not be blank
            if (!($('.cc_cvv_empty_warning').is(':visible'))) {
                let ccCVVEmptyWarning = document.createElement('label');
                $(ccCVVEmptyWarning).addClass('cc_cvv_empty_warning warning');
                $(ccCVVEmptyWarning).text("Please enter card CVV code.");
                $(ccCVVEmptyWarning).insertAfter($('#cvv'));
                $(ccCVVEmptyWarning).show();
            }
        } else { $('.cc_cvv_empty_warning').hide(); }
    }

    // ON STARTUP

    // turn off HTML5 validation (so the validation is done with JavaScript)
    $('form').attr('novalidate', true);

    // focus on the first text field, "name"
    $('#name').focus();

    // set a warning message for invalid email in a new label, but hide message
    let emailWarning = document.createElement('label');
    $(emailWarning).addClass('email_invalid_warning warning');
    $(emailWarning).text("Please enter a valid email address.");
    $(emailWarning).insertBefore($('#mail'));
    $(emailWarning).hide();

    // set a warning message for invalid credit card number in a new label, but hide message
    let ccNumWarning = document.createElement('label');
    $(ccNumWarning).addClass('cc_num_invalid_warning warning');
    $(ccNumWarning).text("Card Number: Please enter 13-16 digits.");
    $(ccNumWarning).insertAfter($('#cc-num'));
    $(ccNumWarning).hide();

    // set a warning message for invalid credit card number in a new label, but hide message
    let ccZipWarning = document.createElement('label');
    $(ccZipWarning).addClass('cc_zip_invalid_warning warning');
    $(ccZipWarning).text("Please enter exactly 5 digits for zip.");
    $(ccZipWarning).insertAfter($('#zip'));
    $(ccZipWarning).hide();

    // set a warning message for invalid credit card number in a new label, but hide message
    let ccCVVWarning = document.createElement('label');
    $(ccCVVWarning).addClass('cc_cvv_invalid_warning warning');
    $(ccCVVWarning).text("Please enter exactly 3 digits for CVV.");
    $(ccCVVWarning).insertAfter($('#cvv'));
    $(ccCVVWarning).hide();

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

    // hide PayPal and Bitcoin options, and set default payment to credit card
    $('.paypal').hide();
    $('.bitcoin').hide();
    $('#payment').val('credit card').change();

    // set submit button to invalid - changes need to be made first!
    // $('button[type="submit"]').prop("disabled", true);
    // wrap a div around the button to listen for mouseover events
    $('button[type="submit"]').wrap('<div class="submit_btn_div"></div>');

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
                let textarea = document.createElement('textarea');
                let textareaLabel = document.createElement('label');
                $(textarea).attr('id', 'other-title').attr('name', 'user_other_title');
                $(textarea).attr('placeholder', 'Your Job Role');
                $(textareaLabel).attr('id', 'other-title-label').attr('for', '#other-title');
                $(textareaLabel).text('Your Job Role:');
                option.after(textareaLabel);
                textareaLabel.after(textarea);
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
        let checkbox = event.target;

        // retrieve the index of the label targeted by the event, to use with 
        // activityTimes and activityCheckboxes
        let checkboxLabelIndex = $('.activities label').index(checkbox.parentNode);

        if (checkbox.checked) {
            confCost += getAmount(checkbox.parentNode);

        } else {
            confCost -= getAmount(checkbox.parentNode);
        }

        // test if any other checkboxes should be set to invalid
        // by stepping through the checkboxes
        for (let i = 1; i < activityTimes.length; i++) {
            if (doesTimeOverlap(activityTimes[i], activityTimes[checkboxLabelIndex])) {
                if (!(i === checkboxLabelIndex)) { // make sure that checkbox isn't evaluated against itself
                    toggleCheckboxValidity(activityCheckboxes[i]);
                }
            }
        }

        displayTotal(confCost);
    });

    // add event handler to payment options select box
    $('#payment').on('change', (event) => {

        let option = event.target;

        if (option.value === 'credit card') {
            $('.credit-card').show();
            $('.bitcoin').hide();
            $('.paypal').hide();
        }

        if (option.value === 'bitcoin') {
            $('.credit-card').hide();
            $('.bitcoin').show();
            $('.paypal').hide();
        }

        if (option.value === 'paypal') {
            $('.credit-card').hide();
            $('.bitcoin').hide();
            $('.paypal').show();
        }
    });

    // add event handler to do real time email validation
    $('#mail').on('input', (event) => {
        if (!validEmail($('#mail').val())) {

            $('.email_invalid_warning').show();

        } else {
            $('.email_invalid_warning').hide();
        }
    });

    // add event handler to do real time credit card number validation
    $('#cc-num').on('input', (event) => {
        if (!creditCardNumberValid()) {

            $('.cc_num_invalid_warning').show();

        } else {
            $('.cc_num_invalid_warning').hide();
        }
    });

    // add event handler to do real time credit card zip number validation
    $('#zip').on('input', (event) => {
        if (!creditCardZipValid()) {

            $('.cc_zip_invalid_warning').show();

        } else {
            $('.cc_zip_invalid_warning').hide();
        }
    });

    // add event handler to do real time credit card cvv number validation
    $('#cvv').on('input', (event) => {
        if (!creditCardCVVValid()) {
            $('.cc_cvv_invalid_warning').show();
        } else {
            $('.cc_cvv_invalid_warning').hide();
        }
    });

    // add event handler on submission button to validate
    // will not submit unless all necessary fields have been filled in correctly
    $('form').on('submit', (event) => {
        if (!allEntriesValid()) {
            event.preventDefault();
            displayInvalidFields();
            // only add the invalid warning if it isn't visible already
            if (!($('.invalid_warning').is(':visible'))) {
                let invalidWarning = document.createElement('label');
                $(invalidWarning).addClass('invalid_warning warning');
                $(invalidWarning).text("Please correct the errors above (indicated in red).");
                $(invalidWarning).insertAfter($('button[type="submit"]'));
                $(invalidWarning).show();
            }
        }
    });

    // add an event handler to check, when there is a change in the document, whether error messages
    // should be removed
    $('html').on('input click', (event) => {

        // if the submit button has been clicked once and validation failed,
        // remove the validation warnings as they are corrected
        // by updating the display of the invalid fields
        if ($('.invalid_warning').is(':visible')) {
            displayInvalidFields();
        }

        // warning message below submit button disappears if all required fields 
        // are valid
        if (allEntriesValid()) {
            $('.invalid_warning').hide();
        }
    });
});