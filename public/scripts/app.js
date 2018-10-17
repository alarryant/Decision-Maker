
$(function () {
  $(() => {
    $.ajax({
      method: "GET",
      url: "/api/users"
    }).done((users) => {
      for (user of users) {
        $("<div>").text(user.name).appendTo($("body"));
      }
    });;
  });

  $('#addOption').click(function () {
    let input = `<input type="text" name="options"><br>`;
    $(input).prependTo($('#addOption'));
  });
});
