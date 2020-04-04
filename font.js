$('.change-font').on('click', 'h1', function() {
  $("body").removeClass();
  $("body").addClass("font-large");
});

$('.change-font').on('click', 'h2', function() {
  $("body").removeClass();
  $("body").addClass("font-medium");
});

$('.change-font').on('click', 'h3', function() {
  $("body").removeClass();
  $("body").addClass("font-small");
});

$('.change-font').on('click', 'button', function() {
  $("body").removeClass();
})