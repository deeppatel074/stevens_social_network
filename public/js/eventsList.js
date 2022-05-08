(function ($) {
    $('.clickRow').mouseup((event) => {
        let href = event.currentTarget.getAttribute('data-href');
        window.location = href;
    });

    $('#searchDiscussion').keyup(function (event) {
        event.preventDefault();
        $('.eventsData').html(` `);
        let searchTerm = $('#searchDiscussion').val().trim();
        var requestConfig = {
            method: 'GET',
            url: `/events/search?searchTerm=${searchTerm}`
        };
        $.ajax(requestConfig).then(function (responseMessage) {
            var newElement = $(responseMessage);
            bindEventsToTable(newElement)

        });
    });
    function bindEventsToTable(events) {
        $.each(events, (key, element) => {
            $('.eventsData').append(`
            <div class="card clickRow" data-href="/events/${element._id}">
            <div class="card-body">
                <div class="row">
                    <div class="col-4">
                        <img src="/public/images/banners/${element.bannerUrl}" class="card-img-top" alt="${element.title}"
                            style="width: 65%;">
                    </div>
                    <div class="col-6">
                        <h1 class="card-title h5 bold">${element.title}</h1>
                        <p class="card-text" style="text-align: justify;">${element.description}</p>
                        <div class="row">
                            <div class="col">
                                <p class="card-text"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                        fill="currentColor" class="bi bi-geo-alt-fill" viewBox="0 0 16 16">
                                        <path
                                            d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
                                    </svg> ${element.eventLocation}
                                </p>
                            </div>
                            <div class="col">
                                <p class="card-text">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                        class="bi bi-basket3-fill" viewBox="0 0 16 16">
                                        <path
                                            d="M5.757 1.071a.5.5 0 0 1 .172.686L3.383 6h9.234L10.07 1.757a.5.5 0 1 1 .858-.514L13.783 6H15.5a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H.5a.5.5 0 0 1-.5-.5v-1A.5.5 0 0 1 .5 6h1.717L5.07 1.243a.5.5 0 0 1 .686-.172zM2.468 15.426.943 9h14.114l-1.525 6.426a.75.75 0 0 1-.729.574H3.197a.75.75 0 0 1-.73-.574z" />
                                    </svg>
                                    ${element.perks}
                                </p>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col">
                                <p class="card-text">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                        class="bi bi-calendar-event-fill" viewBox="0 0 16 16">
                                        <path
                                            d="M4 .5a.5.5 0 0 0-1 0V1H2a2 2 0 0 0-2 2v1h16V3a2 2 0 0 0-2-2h-1V.5a.5.5 0 0 0-1 0V1H4V.5zM16 14V5H0v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2zm-3.5-7h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5z" />
                                    </svg>
                                    ${element.eventDate}
                                </p>
                            </div>
                            <div class="col">
                                <p class="card-text">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                        class="bi bi-clock-fill" viewBox="0 0 16 16">
                                        <path
                                            d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z" />
                                    </svg>
                                    ${element.eventTime}
                                </p>
                            </div>
                            <div class="col">
                                <p class="card-text">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                        class="bi bi-person-circle" viewBox="0 0 16 16">
                                        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                                        <path fill-rule="evenodd"
                                            d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z" />
                                    </svg>
                                    ${element.totalParticipant}/${element.participantLimit}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
            `);
        });
        $('.clickRow').mouseup((event) => {
            let href = event.currentTarget.getAttribute('data-href');
            window.location = href;
        });
    }
})(jQuery);