$(() => {
  $.ajax({
    method: "GET",
    url: "/api/users"
  }).done((users) => {
    for (user of users) {
      $("<div>").text(user.name).appendTo($("body"));
    }
  });

  let counter = $("label").siblings("label").data();

  $('#addOption').click(function (event) {
    event.preventDefault();
    counter++;
<<<<<<< HEAD
    $('<label> Option</label><br>');
    $('<input><br>').attr("type", "text").attr("name", "options").appendTo($(".test"))
=======
    $(<'label'>Option <br>);
    $('<input><br>').attr("type", "text").attr("name", "options").appendTo($(".test"));
>>>>>>> master
  });
});
