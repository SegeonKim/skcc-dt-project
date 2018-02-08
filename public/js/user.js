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
        var name = data[i].name;
        var phone_number = data[i].phone_number;
        var plan = data[i].plan;
        var phone = data[i].phone;
        var today = new Date();
        var data_date = new Date(data[i].date);
        if (today.getFullYear() == data_date.getFullYear() && today.getMonth() == data_date.getMonth() && today.getDate() == data_date.getDate()) {
            count++;
        }

        var template = [
            '<tr user-code="' + phone_number + '">',
                '<td class="checkbox_td">' + '<input class="user_checkbox" type="checkbox" />' + '</td>',
                '<td>' + name + '</td>',
                '<td>' + phone_number + '</td>',
                '<td>' + plan + '</td>',
                '<td>' + phone + '</td>',
                '<td>' + '<button class="btn btn-primary show_detail">상세보기</button>' + '</td>',
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

var current_edit_data;

var make_user_detail_modal = function(data, callback) {
    current_edit_data = data;
    $('#user_detail_modal').find('input').attr('disabled', true);
    $('#name').val(data.name);
    $('#age').val(data.age);
    $('#sex').val(data.sex);
    $('#address').val(data.address);
    $('#phone').val(data.phone);
    $('#bank').val(data.bank);
    $('#account').val(data.account);
    $('#phone_number').val(data.phone_number);
    $('#plan').val(data.plan);
    $('#remain').val(data.remain);
    $('#remain_month').val(data.remain_month);
    $('#price_month').val(data.remain/data.remain_month);
    $('#extra_service').empty();
    for (var i = 0; i < data.extra_service.length; i++) {
        $('#extra_service').append('<span class="badge badge-primary">' + data.extra_service[i] + '</span>');
    }
    var join_date = new Date(data.date);
    $('#date').text(join_date.getFullYear() + '/' + (join_date.getMonth() + 1) + '/' + join_date.getDate());

    if (callback && typeof(callback) == 'function') {
        callback(true);
    }
};

$('#user_detail_edit').on('click', function() {
    $('#user_detail_modal').find('input').removeAttr('disabled');
    $('#user_detail_edit_cancel').show();
    $('#user_detail_edit_ok').show();
    $('#user_detail_cancel').hide();
    $('#user_detail_edit').hide();
});

$('#user_detail_edit_cancel').on('click', function() {
    $('#user_detail_edit_cancel').hide();
    $('#user_detail_edit_ok').hide();
    $('#user_detail_cancel').show();
    $('#user_detail_edit').show();
    $('#user_detail_modal').find('input').attr('disabled', true);
    make_user_detail_modal(current_edit_data);
});

$('#user_detail_edit_ok').on('click', function() {
    $('#user_detail_edit_cancel').hide();
    $('#user_detail_edit_ok').hide();
    $('#user_detail_cancel').show();
    $('#user_detail_edit').show();
    $('#user_detail_modal').find('input').attr('disabled', true);
});

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

$('#checkall').on('click', function(e) {
    var checked = $(this).is(':checked');

    if (!checked) {
        $('.user_checkbox').prop('checked', false);
    } else {
        $('.user_checkbox').prop('checked', true);
    }
});

$('#user_table').on('click', '.user_checkbox', function(e) {
    var checked = $(this).is(':checked');
    if (!checked) {
        $('#checkall').prop('checked', false);
    }
});

$('#user_table').on('click', '.show_detail', function(e) {
    $('.loading_bg').show();
    var user_code = $(this).parent().parent().attr('user-code');
    var user_data = user_key_list[user_code];

    $('#user_detail_edit_cancel').hide();
    $('#user_detail_edit_ok').hide();
    $('#user_detail_cancel').show();
    $('#user_detail_edit').show();

    make_user_detail_modal(user_data, function(result) {
        $('.loading_bg').hide();
        if (result) {
            $('#user_detail_modal').modal('show');
        } else {
            alert.show('고객 상세 정보를 가져오는데 실패하였습니다.');
        }
    });
});

$('#user_table').on('click', '.checkbox_td', function(e) {
    $(this).children().click();
});

var confirmation_remove_modal = $('#confirmation_remove_modal');
$('#confirmation_remove_modal').find('.btn_ok').on('click', function(e) {
    $('.loading_bg').show();
    var $checked_user = $('.user_checkbox:checked');
    var numbers = [];

    $checked_user.each(function(i, e) {
        var number = $(e).parent().parent().attr('user-code');
        numbers.push(number);
    });

    $.post('/user/remove', {
        users: numbers
    }, function(result) {
        init();
    });
});

$('#remove_user').on('click', function(e) {
    var $checked_user = $('.user_checkbox:checked');
    if ($checked_user.length == 0) {
        alert.show('삭제할 고객을 체크해주세요.');
    } else {
        confirmation_remove_modal.modal('show');
    }
});
