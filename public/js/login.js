
alert.init('alert_modal');

var signin = function() {
  var id = $('input[type="id"]').val();
  var password = $('input[type="password"]').val();

  var post_data = {
    id: id,
    password: password
  };

  if (!id) {
    alert.show('ID를 입력해주세요.', function() {
      $('input[type="id"]').focus();
    });
    return;
  }
  if (!password) {
    alert.show('비밀번호를 입력해주세요.', function() {
      $('input[type="password"]').focus();
    });
    return;
  }

  $.post('/signin', post_data, function(result) {
    if (result.result) {
        var encoded = window.location.search.slice(3, window.location.search.length);
        var return_url = window.atob(encoded);
        window.location.href = return_url || '/';
    } else {
      alert.show('로그인에 실패하였습니다. ID 또는 비밀번호를 확인해주세요.', function() {
        $('input[type="password"]').select().focus();
      });
    }
  });
};

$('#sign_in_btn').on('click', signin);

$('.input_box').on('keydown', function(e) {
  if (e.keyCode == 13) {
    signin();
  }
});
