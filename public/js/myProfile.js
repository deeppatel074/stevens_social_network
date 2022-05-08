(function ($) {
    let myProfileForm = $('#my-profile-form');
    let firstName = $('#firstName');
    let lastName = $('#lastName');
    let email = $('#email');
    let phoneNumber = $('#phoneNumber');
    let editButton = $('#editBtn');
    let saveButton = $('#saveBtn');
    let alert = $('.errors');

    document.getElementById("firstName").disabled = true;
    document.getElementById("lastName").disabled = true;
    document.getElementById("email").disabled = true;
    document.getElementById("phoneNumber").disabled = true;
    saveButton.hide();

    editButton.click(function () {
        document.getElementById("firstName").disabled = false;
        document.getElementById("lastName").disabled = false;
        document.getElementById("email").disabled = false;
        document.getElementById("phoneNumber").disabled = false;
        editButton.hide();
        saveButton.show();
    });

    saveButton.submit((event) => {
        let hasErrors = false;
        event.preventDefault();
        // saveButton.prop('disabled', true);
        let info = {
            firstName: firstName.val().trim(),
            lastName: lastName.val().trim(),
            email: email.val().trim(),
            phoneNumber: phoneNumber.val().trim()
        };

        //Check all fields
        if (!info.firstName || !info.lastName || !info.email || !info.phoneNumber) {
            $(alert).text("*All fields are required");
            hasErrors = true;
        }

        //check firstName
        if (info.firstName.length === 1) {
            $(alert).text("first name should not be empty");
            hasErrors = true;
        }
        //check lastName
        if (info.lastName.length < 1) {
            $(alert).text("last name should not be empty");
            hasErrors = true;
        }

        //check Email
        if (info.email.includes("@") == false) {
            hasErrors = true;
            $(alert).text("Not a valid Email ID");
        }

        let emailDomain = info.email.split("@");
        let extensionstr = emailDomain[1];
        if (extensionstr !== "stevens.edu") {
            hasErrors = true;
            $(alert).text("Not a valid Stevens Email id");

        }

        //check phoneNumber
        var regex = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
        if (!regex.test(info.phoneNumber)) {
            hasErrors = true;
            $(alert).text("Phone Number is not valid");
        }

        if (!hasErrors) {
            saveButton.unbind().submit();
        }
        else {
            saveButton.prop('disabled', false);
        }
    });
})(jQuery);