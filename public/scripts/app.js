$(() => {
  $.ajax({
    method: "GET",
    url: "/api/users"
  }).done((users) => {
    for(user of users) {
      $("<div>").text(user.name).appendTo($("body"));
    }
  });

// function resetCounter(){
//     let counter = 2;
//     let counterText = $('.optionsGrp').children('.counter');
//     $('.test').each(function(){
//         if (counter > 2){
//             $(counterText).text(`Options ${counter}: `);
//         }
//         counter++;
//     });
// }

var counter = 2;

  $('#addOption').click(function(event) {
    event.preventDefault();
    if (counter <= 4) {
    counter++;
    // $('<div>').attr("class", "optionsGrp"); attr("class", "counterText")
    $('<span>').text(`Option ${counter}: `).appendTo($(".test"));
    $('<input>').attr("type", "text").attr("name", "options").appendTo($(".test")).append('<br>');
    $('<button>Delete</button>').attr("class", "delete").appendTo($(".test")).append('<br>');
    // $(".optionsGrp").appendTo(".test");
    } else {
    // implement later with css
    $('<br><span>').text(`Let's be real you don't have that many things to do. Let's limit it to 5.`).appendTo($("form"));
    }
  });
  // $("form").on('click', '.delete', function(event) {
  //   event.preventDefault();
  //   const $clickTarget = $(event.target);
  //   const $deleteField = $clickTarget.parent();
  //   $deleteField.remove();
  //   resetCounter();
  // });
});
