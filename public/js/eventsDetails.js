(function ($) {
    function onPageLoad() {
        var url = window.location.pathname;
        var id = url.substring(url.lastIndexOf('/') + 1);
        $('.chat-body').html(` `);
        var requestConfig = {
            method: 'GET',
            url: `/events/chats/${id}`
        };
        $.ajax(requestConfig).then(function (responseMessage) {
            var newElement = $(responseMessage);
            bindChatToCard(newElement);

        });
        // $(".card-body").scrollTop = $(".card-body").scrollHeight;
    }
    let postForm = $('#comments-form')
    let commentInput = $('#message-text');
    let submitButton = $('#submit-comment');
    postForm.submit((event) => {
        // console.log("submit on");
        event.preventDefault();
        submitButton.prop('disabled', true);

        let info = {
            comment: commentInput.val().trim()
        };

        let hasErrors = false;
        // if (!info.comment) {
        //     addAlert("Message should not be empty", "danger")
        //     hasErrors = true;
        // }
        if (!hasErrors) {
            var url = window.location.pathname;
            var id = url.substring(url.lastIndexOf('/') + 1);
            // console.log("url", id)
            var requestConfig = {
                method: 'POST',
                url: `/events/chats/${id}`,
                data: JSON.stringify({ "comment": info.comment }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                error: function (e) {
                    var newElement = $(e);

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
    // function onPageLoad() {
    //     var url = window.location.pathname;
    //     var id = url.substring(url.lastIndexOf('/') + 1);
    //     $('.chat-body').html(` `);
    //     var requestConfig = {
    //         method: 'GET',
    //         url: `/events/chats/${id}`
    //     };
    //     $.ajax(requestConfig).then(function (responseMessage) {
    //         var newElement = $(responseMessage);
    //         bindChatToCard(newElement);

    //     });
    // }

    function bindChatToCard(chats) {
        $.each(chats, (key, element) => {
            $('.chat-body').append(`
                            <div class="row">
                                <div class="col">
                                    <div class="chatContainer">
                                        <img src="/public/images/profiles/${element.commentBy[0].profileUrl}" alt="Avatar"
                                            style="width:100%;">
                                        <h6>${element.commentBy[0].firstName} ${element.commentBy[0].lastName}</h6>
                                        <p style="text-align: left; padding-top:0px">${element.comment}</p>
                                        <span class="time-right">${element.commentDate}</span>
                                    </div>
                                </div>
                            </div>
            `);
        });
        $('#scrl').scrollTop($('#scrl')[0].scrollHeight);
    }
    // $('#chatRow').scrollTop($('#chatRow')[0].scrollHeight);
    // $('#chatRow').scrollTop($('#chatRow').attr("scrollHeight"));
    // $("#chatRow").animate({ scrollTop: $("#chatRow")[0].scrollHeight }, 1000);
})(jQuery);

var objDiv = document.getElementsByClassName("chat-body");
objDiv.scrollTop = objDiv.scrollHeight;