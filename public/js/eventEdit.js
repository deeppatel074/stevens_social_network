(function ($) {
    let eventRegistrationForm = $('#event-registration-form');
    let title = $('#title');
    let description = $('#description');
    let eventDate = $('#eventDate');
    let location = $("#location");
    let participantLimit = $('#participantLimit');
    let perks = $('#perks');
    let submitButton = $('#submitButtonEventRegister');
    let alert = $('.errors');

    eventRegistrationForm.submit((event) => {
        let hasErrors = false;

        event.preventDefault();
        // submitButton.prop('disabled', true);
        let info = {
            title: title.val().trim(),
            description: description.val().trim(),
            eventDate: eventDate.val().trim(),
            location: location.val().trim(),
            perks: perks.val().trim(),
            participantLimit: participantLimit.val().trim()

        };



        //Check all fields
        if (!info.title || !info.description || !info.eventDate || !info.participantLimit || !info.perks || !info.location) {
            $(alert).text("*All fields are required");
            hasErrors = true;
        }

        //check title
        if (info.title.length < 1) {
            $(alert).text("Title should not be empty");
            hasErrors = true;
        }
        //check description 
        if (info.description.length < 1) {
            $(alert).text("Description should not be empty");
            hasErrors = true;
        }


        //Check eventDate
        if (Date.parse(info.eventDate) === NaN) {
            $(alert).text(`eventDate is not a date.`);
            hasErrors = true;
        }
        info.eventDate = new Date(info.eventDate).toISOString();
        let today = new Date().toISOString();
        if (info.eventDate < today) {
            $(alert).text(`Event can't be held before the current date `);
            hasErrors = true;
        }


        //check street
        if (info.location.length < 1) {
            $(alert).text("Street should not be empty");
            hasErrors = true;
        }
        //check perks
        if (info.perks.length < 1) {
            $(alert).text("City should not be empty");
            hasErrors = true;
        }
        // Check Participant LImit

        if (!info.participantLimit) {
            $(alert).text(`Enter Participant Limit`);
        }
        if (isNaN(info.participantLimit)) {
            $(alert).text(`Participant Limit should be a number`);
        }
        let participantLimitIntValue = Number(info.participantLimit)
        if (participantLimitIntValue < 2) {
            $(alert).text(`Limit can't be less than 2`);
            hasErrors = true;
        }
        if (!hasErrors) {
            eventRegistrationForm.unbind().submit();
        } else {
            submitButton.prop('disabled', false);
        }
    });
})(jQuery);