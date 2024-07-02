$(document).ready(function(){
    $('.menutoggle').click(function(){
        $('#header-right').stop(true, true).slideToggle();
    })
});

$(document).ready(function(){
    $('.text-style3').append('<span>&#9660</span>');
    $('.text-style3' ).click(function(){
        $('.zone-filtre').stop(true, true).slideToggle();
    })

});