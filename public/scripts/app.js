(function(d, s, id) {
  var js,
    fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s);
  js.id = id;
  js.src = '//connect.facebook.net/en_US/all.js';
  fjs.parentNode.insertBefore(js, fjs);
})(document, 'script', 'facebook-jssdk');

window.fbAsyncInit = function() {
  FB.init({
    appId: '274590506518760',
    status: true,
    xfbml: true,
    cookie: true
  });
};

$(() => {
  // navbar slide function

  $(function() {
    $('.header').hover(function() {
      $(this).toggleClass('active');
      $('#navbar').toggle('slide', { direction: 'right' }, 2000);
    });
  });

  function resetCounter() {
    $('label.counterText').each(function(indivCounterText, val) {
      let increment = indivCounterText;
      increment++;
      $(val).text(`Option ${increment}: `);
    });
  }
  var counter = 2;

  $('#addOption').click(function(event) {
    event.preventDefault();
    if (counter <= 4) {
      counter++;
      $('<label>')
        .attr('for', 'options')
        .attr('class', 'counterText')
        .text(`Option ${counter}: `)
        .appendTo($('.test'));
      $('<input>')
        .attr('type', 'text')
        .attr('name', 'options')
        .appendTo($('.test'));
      $('<button><i class="far fa-trash-alt"></i></button>')
        .attr('class', 'delete')
        .appendTo($('.test'));
      $('<br>').appendTo($('.test'));
      if (counter === 3) {
        $('.test')
          .addClass('option3')
          .addClass('options');
      } else if (counter === 4) {
        $('.test')
          .removeClass('option3')
          .addClass('option4');
      } else if (counter === 5) {
        $('.test')
          .removeClass('option4')
          .addClass('option5');
      }
    } else {
      // implement later with css
      $('<br><span>')
        .attr('class', 'removeError')
        .text(`Let's be real you don't have that many things to do. Let's limit it to 5.`)
        .appendTo($('form'));
    }
  });

  $('form').on('click', '.delete', function(event) {
    event.preventDefault();
    const $clickTarget = $(event.target).parent();
    $clickTarget.next().remove();
    $clickTarget.prev().remove();
    $clickTarget.prev().remove();
    $clickTarget.remove();
    $('.removeError').remove();
    if ($('.test').hasClass('option5')) {
      $('.test')
        .removeClass('option5')
        .addClass('option4');
    } else if ($('.test').hasClass('option4')) {
      $('.test')
        .removeClass('option4')
        .addClass('option3');
    } else if ($('.test').hasClass('option3')) {
      $('.test').removeClass('option3');
    }
    resetCounter();
    counter--;
  });

  $(function() {
    $('#sortable-1').sortable();
  });

  $('.vote').on('click', function(event) {
    event.preventDefault();
    let $headerString = $(event.target).siblings('#pollid');
    let randomURL = $headerString.text();
    let optionArray = [];
    $('li').each(function(idx, li) {
      optionArray.push($(li).context.innerText);
    });
    // $.post("/vote", {option: optionArray, randomURL: randomURL});
    $.ajax({
      url: '/api/users/vote',
      type: 'POST',
      data: { option: optionArray, randomURL: randomURL },
      success: function(result) {
        console.log('we are good in the succcess function', result);
        window.location = '/api/users/thanks';
      },
      error: function(error) {
        console.log('we are in the error code');
      }
    }); //AJAX Call ends here.
  });

  $('.fb-share').click(function() {
    FB.ui({
      method: 'feed',
      name: '',
      link: 'http://reddit.com',
      picture: '',
      description: ''
    });
  });

  // $("form").on('click', '#create', (function(event) {
  //   event.preventDefault();
  //   $('input').each(function(field) => {
  //     if (!field) {
  //       $('.error-message')
  //         .text('fill in all forms u idiot')
  //         .slideDown();
  //     } else {
  //       $('.error-message').slideUp();
  //     }
  //   });
  // });
  master;
});
