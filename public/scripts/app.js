$(() => {
  $.ajax({
    method: 'GET',
    url: '/api/users'
  }).done(users => {
    for (user of users) {
      $('<div>')
        .text(user.name)
        .appendTo($('body'));
    }
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
        $('.test').addClass('option3').addClass('options');
      } else if (counter === 4) {
        $('.test').removeClass('option3').addClass('option4');
      } else if (counter === 5) {
        $('.test').removeClass('option4').addClass('option5');
      }
    } else {
      // implement later with css
      $('<br><span>')
        .attr('class', 'removeError')
        .text(`Let's be real you don't have that many things to do. Let's limit it to 5.`)
        .appendTo($('form'));
    }
  });

  $("form").on('click', '.delete', function(event) {
    event.preventDefault();
    const $clickTarget = $(event.target).parent();
    $clickTarget.next().remove();
    $clickTarget.prev().remove();
    $clickTarget.prev().remove();
    $clickTarget.remove();
    $('.removeError').remove();
    if ($('.test').hasClass('option5')) {
      $('.test').removeClass('option5').addClass('option4');
    } else if ($('.test').hasClass('option4')) {
      $('.test').removeClass('option4').addClass('option3');
    } else if ($('.test').hasClass('option3')) {
      $('.test').removeClass('option3');
    }
    resetCounter();
    counter--;
  });

  $(function() {
    $('#sortable-1').sortable();
  });

   $(".vote").on('click', function(event) {
    event.preventDefault();
    let $headerString = $(event.target).siblings('#pollid');
    let randomURL = $headerString.text();
    let optionArray = [];
   $('li').each(function(idx, li) {
     optionArray.push($(li).context.innerText);
    });
    $.post("/vote", {option: optionArray, randomURL: randomURL});
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
});
