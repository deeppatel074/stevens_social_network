(function ($) {
    let searchForm = $('#eventSearch')
    let searchTerm = $('#searchTerm')
    let submitButton = $('#searchTermSubmit')
    let alert = $('.errors');

    searchForm.submit((event) => {
        event.preventDefault();
        // $("#eventsAll").hide();
        // $("#search-result-box").empty();
        // $("#search-result-box").removeAttr('hidden');
        submitButton.prop('disabled', true);

        let info = {
            searchTerm: searchTerm.val().trim()
           
        };

        let hasErrors = false;
        if (!info.searchTerm) {
            $(alert).text("Enter Search Term");
            hasErrors = true;
        }
        
        if (info.searchTerm.length < 1) {
            $(alert).text("Search Term should not be empty");
            hasErrors = true;
        }
        if (!hasErrors) {
            searchForm.unbind().submit();
        } else {
            submitButton.prop('disabled', false);
        }
    });
})(jQuery);