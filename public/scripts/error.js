$(() => {
  $('#create').click(function(event) {
    event.preventDefault();
    let inputLength = $('input').val().length;
    $('.error-message').slideUp();
    if (inputLength <= 0) {
      $('.error-message')
        .text('fill in all forms u idiot')
        .slideDown();
    }
  });
});
