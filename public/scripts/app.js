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
    if (counter < 4) {
      counter++;
      $('<label>')
        .attr('for', 'options')
        .attr('class', 'counterText')
        .text(`Option ${counter}: `)
        .appendTo($('.test'));
      $('<input>')
        .attr('type', 'text')
        .attr('name', 'options')
        .addClass('charlim')
        .appendTo($('.test'))
        .focus();
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
        }
      } else if (counter === 4) {
        counter++;
        $('<label>')
          .attr('for', 'options')
          .attr('class', 'counterText')
          .text(`Option ${counter}: `)
          .appendTo($('.test'));
        $('<input>')
          .attr('type', 'text')
          .attr('name', 'options')
          .appendTo($('.test'))
          .focus();
        $('<button><i class="far fa-trash-alt"></i></button>')
          .attr('class', 'delete')
          .appendTo($('.test'));
        $('<br>')
          .appendTo($('.test'));
        $('.test')
          .removeClass('option4')
          .addClass('option5');
        $('#addOption')
          .addClass("hidedelete");
      }
  });

  $('form').on('click', '.delete', function(event) {
    event.preventDefault();
    const $clickTarget = $(event.target).parent('button');
    $clickTarget
      .next()
      .remove();
    $clickTarget
      .prev()
      .remove();
    $clickTarget
      .prev()
      .remove();
    $clickTarget
      .remove();

    if ($('.test').hasClass('option5')) {
        $('.test')
          .removeClass('option5')
          .addClass('option4');
        $('#addOption')
          .removeClass("hidedelete");
    } else if ($('.test').hasClass('option4')) {
      $('.test')
        .removeClass('option4')
        .addClass('option3');
      $('#addOption')
        .removeClass("hidedelete");
    } else if ($('.test').hasClass('option3')) {
      $('.test')
        .removeClass('option3');
      $('#addOption')
        .removeClass("hidedelete");
    }
    resetCounter();
    counter--;
  });

  $(function() {
    $('#sortable-1').sortable();
  });

  $('.vote').on('click', function(event) {
    event.preventDefault();
    let $headerString = $(event.target).parent().siblings('#pollid');
    let randomURL = $headerString.text().trim();
    let optionArray = [];
    $('li').each(function(idx, li) {
      optionArray.push($(li).context.innerText);
    });

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

  $('.required').on('submit', e => {
    let email = $(e.target)
      .children('div')
      .children('#email')
      .val();
    let title = $(e.target)
      .children('div')
      .children('#title')
      .val();

      let opArr = [];
      let opLen = [];

  function tooMany(element){
    return element > 100;
  }

  $(e.target).children('div').children('.charlim').each((idx, li) => { opArr.push(($(li).val()))});
    opArr.forEach((element) => {
      opLen.push(element.length);
    })

    if (email === '' && title === '') {
      e.preventDefault();
      $('.error')
        .text('Please complete the form first!')
        .hide();
      $('.error')
        .slideDown('slow');
    } else if (email === '') {
      e.preventDefault();
      $('.error')
        .text('Please enter a valid email before submitting!')
        .hide();
      $('.error')
        .slideDown('slow');
    } else if (title === '') {
      e.preventDefault();
      $('.error')
        .text('Please enter a valid title before submitting!')
        .hide();
      $('.error')
        .slideDown('slow');
    } else if (opArr.every(element => element === '') || opArr.filter(word => word).length === 1){
      e.preventDefault();
      $('.error')
        .text('You must have at least 2 options!')
        .hide();
      $('.error')
        .slideDown('slow');
    } else if (opLen.some(tooMany)) {
      e.preventDefault();
      $('.error')
        .text('Character length on option is 100!')
        .hide();
      $('.error')
        .slideDown('slow');
    } else {
      $.ajax('/api/users/create', { method: 'POST'});
    }
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

  $('.results').on('click', '.clipboardbutton', function(event) {
    event.preventDefault();
    $(event.target)
      .parent()
      .next()
      .slideUp();
    $textarea = $(event.target).parent().prev();
    $textarea
      .select();
    document.execCommand('copy');
    $textarea
      .blur();
    $(event.target)
      .parent()
      .next()
      .slideDown(800)
      .delay(2000);
    $(event.target)
      .parent()
      .next()
      .slideUp(800);
  });
});
