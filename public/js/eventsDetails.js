(function ($) {
    var url = window.location.pathname;
    var id = url.substring(url.lastIndexOf('/') + 1);
    function onPageLoad() {
        $('.chat-body').html(` `);
        var requestConfig = {
            method: 'GET',
            url: `/events/chats/${id}`
        };
        $.ajax(requestConfig).then(function (responseMessage) {
            var newElement = $(responseMessage);
            bindChatToCard(newElement);

        });
    }
    let postForm = $('#comments-form')
    let commentInput = $('#message-text');
    let submitButton = $('#submit-comment');
    postForm.submit((event) => {
        event.preventDefault();
        submitButton.prop('disabled', true);

        let info = {
            comment: commentInput.val().trim()
        };

        let hasErrors = false;
        if (!info.comment) {
            $('#error').prop('hidden', false);
            $('#error').html(`Message Should not be empty
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>`);

            hasErrors = true;
        }
        if (!hasErrors) {
            var requestConfig = {
                method: 'POST',
                url: `/events/chats/${id}`,
                data: JSON.stringify({ "comment": info.comment }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                error: function (e) {
                    var newElement = $(e);
                    let errorMsg = newElement[0].responseJSON.error;
                    $('#error').prop('hidden', false);
                    $('#error').html(`${errorMsg}
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>`);

                },
                success: function (s) {
                    var newElement = $(s);
                    onPageLoad();
                    commentInput.val('');
                    submitButton.prop('disabled', false);
                }
            };
            $.ajax(requestConfig);
        } else {
            submitButton.prop('disabled', false);
        }
    });

    $(".deleteEve").on("click", function () {
        var requestConfig = {
            method: 'DELETE',
            url: `/events/${id}`,
            error: function (e) {
                var newElement = $(e);
                let errorMsg = newElement[0].responseJSON.error
                $('#deleteModel').modal('hide');
                $('#error').prop('hidden', false);
                $('#error').html(`${errorMsg}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>`)
            },
            success: function (s) {
                var newElement = $(s);
                if (newElement[0].deleted) {
                    window.location = '/events/myevents';
                }
            }
        };
        $.ajax(requestConfig);
    });

    function bindChatToCard(chats) {
        $.each(chats, (key, element) => {
            $('.chat-body').append(`
                            <div class="row">
                                <div class="col">
                                    <div class="chatContainer">
                                        <img src="/public/images/profiles/${element.commentBy[0].profileUrl}" alt="Avatar"
                                            style="width:100%;">
                                        <h1 class="h6 bold">${element.commentBy[0].firstName} ${element.commentBy[0].lastName}</h1>
                                        <p style="text-align: left; padding-top:0px">${element.comment}</p>
                                        <span class="time-right">${element.commentDate}</span>
                                    </div>
                                </div>
                            </div>
            `);
        });
    }
    $('.edit').on("click", function () {
        window.location = `/events/edit/${id}`
    });
    $('.updateRSVP').on("click", function () {
        var requestConfig = {
            method: 'DELETE',
            url: `/events/rsvp/${id}`,
            error: function (e) {
                var newElement = $(e);
                let errorMsg = newElement[0].responseJSON.error
                $('#deleteModel').modal('hide');
                $('#error').prop('hidden', false);
                $('#error').html(`${errorMsg}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>`)
            },
            success: function (s) {
                var newElement = $(s);
                if (newElement[0].deleted) {
                    window.location.reload();
                }
            }
        };
        $.ajax(requestConfig);
    });
})(jQuery);