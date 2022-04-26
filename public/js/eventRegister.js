(function ($) {
    let eventRegisterationForm = $('#event-registration-form');
    let title = $('#title')
    let description = $('#description')
    let eventDate = $('#eventDate')
    let participantLimit = $('#participantLimit')
    let bannerUrl = $('#bannerUrl')
    let submitButton = $('#submitButtonEventRegister');
    let alert = $('.errors');
    let hasErrors = false;

    eventRegisterationForm.submit((event) => {
        event.preventDefault();
        submitButton.prop('disabled', true);
        let info = {
            title: title.val().trim(),
            description: description.val().trim(),
            eventDate: eventDate.val().trim(),
            participantLimit : participantLimit.val().trim(),
            bannerUrl: bannerUrl.val().trim()

        };

       

        //Check all fields
        if (!info.title || !info.description || !info.eventDate || !info.participantLimit|| !info.bannerUrl) {
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
        if(Date.parse(info.eventDate) === NaN){
            $(alert).text( `eventDate is not a date.`);
            hasErrors = true;
        }
        info.eventDate = new Date(info.eventDate);
        let  today = new Date();
        if (info.eventDate < today){
            $(alert).text( `Event can't be held before the current date `);
            hasErrors = true;
        }
        info.eventDate = info.eventDate.toDateString().split("-");
        if(info.eventDate[1]<1 || info.eventDate[1]>12){
            $(alert).text ("Month in info.eventDate is invalid");
            hasErrors = true;
        }

        let month31 = ["1","3","5","7","8","10","12"];
        let month30 = ["4","6","9","11"]
        let month31with0 = ["01","03","05","07","08","10","12"];
        let month30with0 = ["04","06","09","11"]

        if (month31.indexOf(info.eventDate[1]) != -1 || month31with0.indexOf(info.eventDate[1]) != -1){
            if(info.eventDate[2] < 1 || info.eventDate[2] > 31){
                $(alert).text (`There are 31 days in this month`);
                hasErrors = true;    
            }
        }
        else if (month30.indexOf(info.eventDate[1]) != -1 || month30with0.indexOf(info.eventDate[1]) != -1){
            if(info.eventDate[2] < 1 || info.eventDate[2] > 31){
                $(alert).text( `There are 30 days in this month`);     
                hasErrors = true; 
            }
        }
        else {
            if(info.eventDate[2] < 1 || info.eventDate[2] > 28 ){
                $(alert).text (`There are 28 days in this month`);
                hasErrors = true;
            }
        }


        

        // Check Participant LImit
         let participantLimitIntValue = Number(info.participantLimit)
         if(participantLimitIntValue < 2){
            $(alert).text( `Limit can't be less than 2`);
            hasErrors = true;
        }
    
        if (!hasErrors) {
            eventRegisterationForm.unbind().submit();
        } else {
            submitButton.prop('disabled', false);
        }
    });
})(jQuery);