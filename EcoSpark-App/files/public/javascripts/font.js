
$('.change-font').on('click', 'h1', function() {
    $("h1").addClass("font-large");
    $("h2").addClass("font-large");
    $("h3").addClass("font-large");
});

$('.change-font').on('click', 'h2', function() {
    $("body").removeClass();
    $("h1").addClass("font-medium");
    $("h2").addClass("font-medium");
    $("h3").addClass("font-medium");
});

$('.change-font').on('click', 'h3', function() {
    $("body").removeClass();
    $("h1").addClass("font-small");
    $("h2").addClass("font-small");
    $("h3").addClass("font-small");
});

$('.change-font').on('click', 'button', function() {
    $("h1").removeClass();
    $("h2").removeClass();
    $("h3").removeClass();
});