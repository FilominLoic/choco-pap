$(document).ready(function(){
    $('.text-style3').append('<span>&#9660</span>');
    $('.text-style3').hover(function(){
    $('div',this).stop(true, true).slideToggle();

    })
});