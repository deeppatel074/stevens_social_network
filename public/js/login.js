(function ($) {
    let loginForm = $('#login-form')
    let emailInput = $('#email');
    let passwordInput = $('#password');
    let submitButton = $('#submitButton');
    let alert = $('.errors');

    loginForm.submit((event) => {
        event.preventDefault();
        submitButton.prop('disabled', true);

        let info = {
            email: emailInput.val().trim(),
            password: passwordInput.val().trim()
        };

        let hasErrors = false;
        if (!info.email || !info.password) {
            $(alert).text("Enter email and password to login");
            hasErrors = true;
        }
        if (info.email.includes("@") == false) {
            hasErrors = true;
            $(alert).text("Not a valid Email ID");

        }
        let emailDomain = info.email.split("@");
        let extensionstr = emailDomain[1].toLowerCase();
        if (extensionstr !== "stevens.edu") {
            hasErrors = true;
            $(alert).text("Not a valid Stevens Email id");

        }
        if (!hasErrors) {
            loginForm.unbind().submit();
        } else {
            submitButton.prop('disabled', false);
        }
    });
})(jQuery);