$('#create').click(function(event) {
  event.preventDefault();
  // prevent submitting and reloading page
  let inputLength = $('input').val().length;
  // default hide error message
  $('.error-message').slideUp();
  // if invalid tweet upon submit show errors
  if (tweetLength <= 0) {
    $('.error-message')
      .text('you gotta write something first!')
      .slideDown();
  } else if (tweetLength > 140) {
    $('.error-message')
      .text('still too long...')
      .slideDown();
