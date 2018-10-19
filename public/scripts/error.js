$(() => {
  $('#create').click(function(event) {
    event.preventDefault();
    let inputLength = $('input').val().length;
    // default hide error message
    $('.error-message').slideUp();
    // if invalid tweet upon submit show errors
    if (inputLength <= 0) {
      $('.error-message')
        .text('fill in all forms u idiot')
        .slideDown();
    }
  });
});
