(function ($) {
    $('.clickRow').mouseup((event) => {
        let href = event.currentTarget.getAttribute('data-href');
        window.location = href;
    });
})(jQuery);