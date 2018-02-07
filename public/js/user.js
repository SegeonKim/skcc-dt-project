var user_list = [];
var user_key_list = {};

var init = function() {
    alert.init('alert_modal');

    $.get('/user/getall', {}, function(data) {
    if (data.result) {
        user_list = data.data;
        $('#user_treeview').click();
        make_user_table(data.data, function() {
            $('.loading_bg').hide();
        });
    } else {
        $('.loading_bg').hide();
            alert.show('데이터를 가져오는데 실패하였습니다.');
        }
    });
};

var today_new_member = 0;

var make_user_table = function(data, callback) {
    var user_table = $('#user_table');
    var table_body = user_table.find('tbody');
    var count = 0;
    table_body.empty();
    user_key_list = {};

    for (var i = 0; i < data.length; i++) {
        var user_id = data[i].user_id;
        var name = data[i].name;
        var phone_number = data[i].phone_number;
        var plan = data[i].plan;
        var phone = data[i].phone;
        var today = new Date();
        if (today.getFullYear() == data[i].date.getFullYear() && today.getMonth() == data[i].date.getMonth() && today.getDate() == data[i].date.getDate()) {
            count++;
        }

        var template = [
            '<tr user-code="' + phone_number + '">',
                '<td>' + '<input class="user_checkbox" type="checkbox" />' + '</td>',
                '<td>' + user_id + '</td>',
                '<td>' + name + '</td>',
                '<td>' + phone_number + '</td>',
                '<td>' + plan + '</td>',
                '<td>' + phone + '</td>',
                '<td>' + '<button class="btn btn-primary">상세보기</button>' + '</td>',
            '</tr>'
        ].join('');

        table_body.append(template);

        user_key_list[phone_number] = data[i];
    }

    today_new_member = count;

    $('.user_info').find('.inner > p').text('총 가입자수 : ' + user_list.length);
    $('.today_info').find('.inner > p').text('오늘 가입자수 : ' + today_new_member);

    callback();
};

$('.user_management').on('click', function() {
  // $('.loading_bg').show();
  // $.post('/stock/get/all', {}, function(data) {
  //   if (data.result) {
  //     item_list = data.data;
  //
  //     make_stock_modal(data.data, function() {
  //       $('.loading_bg').hide();
  //       $('#stock_modal').modal('show');
  //     });
  //   } else {
  //     $('.loading_bg').hide();
  //     alert.show('데이터를 가져오는데 실패하였습니다.');
  //   }
  // });
});

var make_stock_modal = function(data, callback) {
  var stock_table = $('#stock_table');
  var table_body = stock_table.find('tbody');

  for (var i = 0; i < data.length; i++) {
    var item_code = data[i].ITEM_CODE;
    var item_name = data[i].ITEM_NAME;
    var item_expiration_date = data[i].ITEM_EXPIRATION_DATE;
    var item_classification = data[i].ITEM_CLASSIFICATION;
    var warehouse_count = data[i].WAREHOUSE_COUNT;
    var display_count = data[i].DISPLAY_COUNT;
    var parsed_date = item_expiration_date.slice(0, 4) + '.' + item_expiration_date.slice(4, 6) + '.' + item_expiration_date.slice(6, 8);

    if (warehouse_count == 0) {
      continue;
    }

    var template = [
      '<tr data-code="' + item_code + '" data-date="' + item_expiration_date + '">' +
        '<td>' + item_code + '</td>' +
        '<td>' + item_name + '</td>' +
        '<td>' + item_classification + '</td>' +
        '<td>' + parsed_date + '</td>' +
        '<td>' + display_count + '</td>' +
        '<td>' +
          '<div class="input-group">' +
            '<input data-display="' + display_count + '" data-max="' + warehouse_count + '" type="number" class="form-control get_count" placeholder="0">' +
            '<div class="input-group-addon">/ ' + warehouse_count + '</div>' +
          '</div>' +
        '</td>' +
      '</tr>'
    ].join('');

    table_body.append(template);
  }

  callback();
};

$('#checkall').on('click', function(e) {
    var checked = $(this).is(':checked');

    if (checked) {
        $('.user_checkbox').prop('checked', false);
    } else {
        $('.user_checkbox').prop('checked', true);
    }
});

$('#user_table').on('click', '.user_checkbox', function(e) {

});

var confirmation_remove_modal = $('#confirmation_remove_modal');
$('#confirmation_remove_modal').find('#btn_ok').on('click', function(e) {
    $('.loading_bg').show();
    var checked_user = $('.user_checkbox:checked');
    var numbers = [];

    for (var i = 0; i < checked_user.length; i++) {
        var number = checked_user.eq(i).parent().parent().attr('user-code');
        numbers.push(number);
    }

    $.post('/user/remove', {
        users: numbers
    }, function(result) {
        init();
    });
});

$('#remove_user').on('click', function(e) {
    confirmation_remove_modal.modal('show');
});

$('#stock_manage').on('click', function() {
  $('.loading_bg').show();
  var stock_table = $('#stock_table');
  var table_body = stock_table.find('tbody');
  var rows = table_body.find('tr');
  var change_items = [];

  rows.each(function(i, e) {
    var count_box = $(e).find('.get_count');
    var count = parseInt(count_box.val());
    var max = parseInt(count_box.attr('data-max'));
    var code = $(e).attr('data-code');
    var date = $(e).attr('data-date');
    var display_count = parseInt(count_box.attr('data-display'));

    var new_warehouse_count = max - count;
    var new_display_count = display_count + count;

    if (count > 0 && count < max) {
      change_items.push({
        item_code: code,
        item_expiration_date: date,
        warehouse_count: new_warehouse_count,
        display_count: new_display_count
      });
    }
  });

  if (change_items.length > 0) {
    $.post('/stock/change', {
      data: change_items
    }, function(data) {
      if (data.result) {
        window.location.reload();
      } else {
        $('.loading_bg').hide();
        alert.show('창고에서 물건을 가져오는데 실패하였습니다.');
      }
    });
  } else {
    $('.loading_bg').hide();
    alert.show('변경 가능한 정보가 없습니다.');
  }
});
