(function ($) {

    let postForm = $('#comment-form')
    let commentInput = $('#message-text');
    let submitButton = $('#submit-comment');
    let alert = $('.errors');

    function addAlert(message, type) {
        alert.html('<div class="alert alert-' + type + ' alert-dismissible" role="alert">' + message + '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>');
    }
    postForm.submit((event) => {
        event.preventDefault();
        // submitButton.prop('disabled', true);

        let info = {
            comment: commentInput.val().trim()
        };

        let hasErrors = false;
        if (!info.comment) {
            addAlert("Message should not be empty", "danger")
            hasErrors = true;
        }
        if (!hasErrors) {
            var url = window.location.pathname;
            var id = url.substring(url.lastIndexOf('/') + 1);
            var requestConfig = {
                method: 'POST',
                url: `/informative/post/${id}`,
                data: JSON.stringify({ "comment": info.comment }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                error: function (e) {
                    var newElement = $(e);
                    if (newElement[0].responseJSON.isError) {
                        addAlert(newElement[0].responseJSON.errors, 'danger');
                        submitButton.prop('disabled', false);
                    };
                },
                success: function (s) {
                    var newElement = $(s);
                    // console.log(newElement)
                    if (newElement[0].isSuccess) {
                        submitButton.prop('disabled', false);
                        window.location.href = `/informative/post/${id}`;
                    };
                }
            };
            $.ajax(requestConfig);
        } else {
            submitButton.prop('disabled', false);
        }
    });
})(jQuery);
var exampleModal = document.getElementById('exampleModal')
exampleModal.addEventListener('show.bs.modal', function (event) {
})