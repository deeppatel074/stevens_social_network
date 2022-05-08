(function ($) {
    let signupForm = $('#signup-form');
    let firstName = $('#firstName');
    let lastName = $('#lastName');
    let email = $('#email');
    let password = $('#password');
    let confirmPassword = $('#confirmPassword');
    let phoneNumber = $('#phoneNumber');
    let profileUrl = $('#profileUrl');
    let submitButton = $('#submitButton');
    let alert = $('.errors');

    signupForm.submit((event) => {
        let hasErrors = false;
        event.preventDefault();
        // submitButton.prop('disabled', true);
        let info = {
            firstName: firstName.val().trim(),
            lastName: lastName.val().trim(),
            email: email.val().trim(),
            password: password.val().trim(),
            confirmPassword: confirmPassword.val().trim(),
            phoneNumber: phoneNumber.val().trim(),
            profileUrl: profileUrl.val().trim()

        };


        //Check all fields
        if (!info.firstName || !info.lastName || !info.email || !info.password || !info.confirmPassword || !info.phoneNumber || !info.profileUrl) {
            $(alert).text("*All fields are required");
            hasErrors = true;
        } else {
            //check firstName
            if (info.firstName.length === 1) {
                $(alert).text("first name should not be empty");
                hasErrors = true;
            } else {
                //check lastName
                if (info.lastName.length < 1) {
                    $(alert).text("last name should not be empty");
                    hasErrors = true;
                } else {
                    //check Email
                    if (info.email.includes("@") == false) {
                        hasErrors = true;
                        $(alert).text("Not a valid Email ID");

                    } else {
                        let emailDomain = info.email.split("@");
                        let extensionstr = emailDomain[1];
                        if (extensionstr !== "stevens.edu") {
                            hasErrors = true;
                            $(alert).text("Not a valid Stevens Email id");

                        } else {
                            // check password
                            if (info.password.length === 0) {
                                hasErrors = true;
                                $(alert).text("Password is EMPTY");
                            } else if (info.password.length < 6) {
                                hasErrors = true;
                                $(alert).text("Password should be ATLEAST 6 characters long.");
                            } else {
                                //check confirm password
                                if (info.password !== info.confirmPassword) {
                                    hasErrors = true;
                                    $(alert).text("Password and confirm password dose not match");
                                } else {

                                    //check phoneNumber
                                    var regex = /[0-9]{3}-[0-9]{3}-[0-9]{4}/gm;
                                    if (!regex.test(info.phoneNumber)) {
                                        hasErrors = true;
                                        $(alert).text("Phone Number is not valid");
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }



        if (!hasErrors) {
            signupForm.unbind().submit();
        } else {
            submitButton.prop('disabled', false);
        }
    });
})(jQuery);