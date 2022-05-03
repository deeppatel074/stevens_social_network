(function ($) {
    let isMy = "false";
    function onPageLoad() {
        $('.table-body').html(` `);
        var requestConfig = {
            method: 'GET',
            url: `/informative/post`
        };
        $.ajax(requestConfig).then(function (responseMessage) {
            var newElement = $(responseMessage);
            bindPostToTable(newElement);

        });
    }

    $('#searchDiscussion').keyup(function (event) {
        event.preventDefault();
        $('.table-body').html(` `);
        let searchTerm = $('#searchDiscussion').val().trim();
        var requestConfig = {
            method: 'GET',
            url: `/informative/post?search=${searchTerm}&my=${isMy}`
        };
        $.ajax(requestConfig).then(function (responseMessage) {
            var newElement = $(responseMessage);
            bindPostToTable(newElement)

        });
    });
    $('input[name=flexRadioDefault]').change(function () {
        $('.table-body').html(` `);
        let searchTerm = $('#searchDiscussion').val().trim();
        isMy = this.value;
        var requestConfig = {
            method: 'GET',
            url: `/informative/post?search=${searchTerm}&my=${isMy}`
        };
        $.ajax(requestConfig).then(function (responseMessage) {
            var newElement = $(responseMessage);
            bindPostToTable(newElement)

        });
    });
    function bindPostToTable(posts) {
        $.each(posts, (key, element) => {
            $('.table-body').append(`
                <tr class="clickRow" id="${element._id}" data-href="/informative/post/${element._id}">
                    <td>
                        <h2 class="h6 mb-0">${element.title}</h2>
                        <p class="mb-0">${element.description}</p>
                    </td>
                    <td>${element.totalComments}</td>
                    <td>
                        <div> By ${element.createdBy[0].firstName} ${element.createdBy[0].lastName}</div>
                        <div> ${element.createdAt}</div>
                    </td>
                </tr>
            `);
        });
        $('.clickRow').mouseup((event) => {
            let href = event.currentTarget.getAttribute('data-href');
            window.location = href;
        });
    }
    onPageLoad();
})(jQuery);