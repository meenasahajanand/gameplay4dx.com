$(function () {
    var isOverGoogleAdinfo = false;
    $('#div-gpt-ad-1766493462807-0').on('mouseover', function () {
        isOverGoogleAdinfo = true
    });
    $('#div-gpt-ad-1766493462807-0').on('mouseout', function () {
        isOverGoogleAdinfo = false
    });

    $(window).blur(function (e) {
        if (isOverGoogleAdinfo == true) {
            console.log('info_blur');
            dataLayer.push({'event': 'xq-dj01'})
        }

    })
});