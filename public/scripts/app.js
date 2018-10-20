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
      url: '/vote',
      type: 'POST',
      data: { option: optionArray, randomURL: randomURL },
      success: function(result) {
        console.log('we are good in the succcess function', result);
        window.location = '/thanks';
      },
      error: function(error) {
        console.log('we are in the error code');
      }
    }); //AJAX Call ends here.
  });
});
