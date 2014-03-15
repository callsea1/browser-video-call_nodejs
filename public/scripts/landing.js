// grab the room from the URL
var host = location.origin.replace(/^http/, 'ws')



$( document ).ready(function() {
    var flash = $.cookie('flash');
    if (flash) {
        $('#flash-text>h1').text(flash);
        $('#flash-text').removeClass('hidden');
        console.log("set flash!" );
        $("#prices").removeClass('delay3');
        $("#prices").removeClass('fadeIn');
    }
    $.removeCookie('flash')
    $.removeCookie('auth')
    $.removeCookie('name')
    console.log("ready function run." );
});
