$(() => {
  $.ajax({
    method: "GET",
    url: "/api/users"
  }).done((users) => {
    for(user of users) {
      $("<div>").text(user.name).appendTo($("body"));
    }
  });
  $('#addOption').click(function(event) {
    event.preventDefault();
    $('Option: <input><br>').attr("type", "text").attr("name", "options").appendTo($(".test"));
  });
});
