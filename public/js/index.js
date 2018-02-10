
var init = function() {
  $.get('/user/getall', {}, function(data) {
    if (data.result) {
        if (data.session) {
            is_session();
        }
        parse_sale_data(data.data, function(result) {
            init_sale_chart(result);
        });
        parse_customer_data(data.data, function(result) {
            init_customer_chart(result, function() {
                $('.loading_bg').hide();
            });
        });
    } else {
        console.log('Fail!');
    }
  });
};

$('#sign_out_btn').on('click', function() {
    $.post('/signout', {}, function() {
        window.location.href = '/';
    });
});

var is_session = function() {
    $('.user_name').text('관리자');
    $('#sign_in_btn').hide();
    $('#sign_out_btn').show();
};

var parse_customer_data = function(data, callback) {
  var age_spread = {};
  var sex_spread = {
    'F': 0,
    'M': 0
  };
  var phone_spread = {};
  var plan_spread = {};

  for (var i = 0; i < data.length; i++) {
    var age = parseInt(data[i].age/10);
    var sex = data[i].sex;
    var phone = data[i].phone;
    var plan = data[i].plan;

    if (age_spread[age]) {
      age_spread[age]++;
    } else {
      age_spread[age] = 1;
    }
    if (sex == '남') {
        sex_spread['M']++;
    } else {
        sex_spread['F']++;
    }
    if (phone_spread[phone]) {
      phone_spread[phone]++;
    } else {
      phone_spread[phone] = 1;
    }
    if (plan_spread[plan]) {
      plan_spread[plan]++;
    } else {
      plan_spread[plan] = 1;
    }
  }

  callback({
    age_data: age_spread,
    sex_data: sex_spread,
    phone_data: phone_spread,
    plan_data: plan_spread
  });
};

var init_customer_chart = function(data, callback) {
  var age_data = data.age_data;
  var sex_data = data.sex_data;
  var phone_data = data.phone_data;
  var plan_data = data.plan_data;

  var customer_chart_canvas = $("#customer_chart").get(0).getContext("2d");
  var customer_chart = new Chart(customer_chart_canvas);
  var customer_data = [];

  var color_list = {
    '1': "#3c8dbc",
    '2': "#00c0ef",
    '3': "#f39c12",
    '4': "#00a65a",
    '5': "#3d9970",
    '6': "#d2d6de",
    '7': "#f012be",
    '8': "#605ca8",
    '9': "#d81b60"

  };
  var color_class = {
    '1': "text-light-blue",
    '2': "text-aqua",
    '3': "text-yellow",
    '4': "text-green",
    '5': "text-olive",
    '6': "text-gray",
    '7': "text-fuchsia",
    '8': "text-purple",
    '9': "text-maroon"
  }

  var template = ['<ul class="chart-legend clearfix">'];

  for (var i in age_data) {
    var label = i*10 + '대';
    if (i*10 == 50) label += ' 이상';
    template.push('<li><i style="margin-right:2px;" class="fa fa-circle ' + color_class[i] + '"></i> ' + label + '</li>');
    customer_data.push({
      value: age_data[i],
      color: color_list[i],
      highlight: color_list[i],
      label: label
    });
  }
  template.push('</ul>');

  template.join('');

  var pie_options = {
    //Boolean - Whether we should show a stroke on each segment
    segmentShowStroke: true,
    //String - The colour of each segment stroke
    segmentStrokeColor: "#fff",
    //Number - The width of each segment stroke
    segmentStrokeWidth: 2,
    //Number - The percentage of the chart that we cut out of the middle
    percentageInnerCutout: 50, // This is 0 for Pie charts
    //Number - Amount of animation steps
    animationSteps: 100,
    //String - Animation easing effect
    animationEasing: "easeOutBounce",
    //Boolean - Whether we animate the rotation of the Doughnut
    animateRotate: true,
    //Boolean - Whether we animate scaling the Doughnut from the centre
    animateScale: false,
    //Boolean - whether to make the chart responsive to window resizing
    responsive: true,
    // Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
    maintainAspectRatio: true,
    //String - A legend template
    legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>"
  };
  //Create pie or douhnut chart
  // You can switch between pie and douhnut using the method below.
  customer_chart.Doughnut(customer_data, pie_options);

  var sex_info = [{
    value: sex_data['M'],
    color: "#00c0ef",
    highlight: "#00c0ef",
    label: '남성'
  }, {
    value: sex_data['F'],
    color: "#f56954",
    highlight: "#f56954",
    label: '여성'
  }];

  var customer_sex_chart_canvas = $("#customer_sex_chart").get(0).getContext("2d");
  var customer_sex_chart = new Chart(customer_sex_chart_canvas);
  customer_sex_chart.Doughnut(sex_info, pie_options);

  $('#customer_info').append(template);
  var _template = [
    '<ul class="chart-legend clearfix">',
    '<li><i style="margin-right:2px;" class="fa fa-circle text-aqua"></i> ' + '남성' + '</li>',
    '<li><i style="margin-right:2px;" class="fa fa-circle text-red"></i> ' + '여성' + '</li>',
    '</ul>'
  ].join('');
  $('#customer_sex_info').append(_template);

  var phone_chart_canvas = $("#phone_chart").get(0).getContext("2d");
  var phone_chart = new Chart(phone_chart_canvas);
  var phone_chart_data = [];

  var template = ['<ul class="chart-legend clearfix">'];
  var cnt = 1;

  for (var i in phone_data) {
    var label = i;
    template.push('<li><i style="margin-right:2px;" class="fa fa-circle ' + color_class[cnt] + '"></i> ' + label + '</li>');
    phone_chart_data.push({
      value: phone_data[i],
      color: color_list[cnt],
      highlight: color_list[cnt],
      label: label
    });
    cnt++;
  }
  template.push('</ul>');

  template.join('');

  phone_chart.Doughnut(phone_chart_data, pie_options);
  $('#phone_info').append(template);

  var plan_chart_canvas = $("#plan_chart").get(0).getContext("2d");
  var plan_chart = new Chart(plan_chart_canvas);
  var plan_chart_data = [];

  var template = ['<ul class="chart-legend clearfix">'];

  cnt = 1;
  for (var i in plan_data) {
    var label = i;
    template.push('<li><i style="margin-right:2px;" class="fa fa-circle ' + color_class[cnt] + '"></i> ' + label + '</li>');
    plan_chart_data.push({
      value: plan_data[i],
      color: color_list[cnt],
      highlight: color_list[cnt],
      label: label
    });
    cnt++;
  }
  template.push('</ul>');

  template.join('');

  plan_chart.Doughnut(plan_chart_data, pie_options);
  $('#plan_info').append(template);

  if (callback && typeof(callback) == 'function') {
      callback();
  }
};

var parse_sale_data = function(data, callback) {
  var joiner_data = {};
  var date = new Date();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var labels = [];
  for (var i = 0; i < 7; i++) {
      date.setDate(date.getDate() - i);
      labels.unshift((date.getMonth()+1) + ' / ' + date.getDate());
  }

  for(var i = 0; i < data.length; i++) {
    var today_data = new Date(data[i].date);
    var month = today_data.getMonth() + 1;
    var today = today_data.getDate();

    if (labels.indexOf(month + ' / ' + today) > -1) {
        if (joiner_data[month + ' / ' + today]) {
          joiner_data[month + ' / ' + today]++;
        } else {
          joiner_data[month + ' / ' + today] = 1;
        }
    }
  }

  callback(joiner_data);
};

var init_sale_chart = function(data) {
  var label = [];
  var chart_data = [];

  var date = new Date();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var labels = [];

  labels.unshift((date.getMonth()+1) + ' / ' + date.getDate());
  chart_data.unshift(data[(date.getMonth()+1) + ' / ' + date.getDate()] || 0);
  for (var i = 0; i < 6; i++) {
      date.setDate(date.getDate() - 1);
      labels.unshift((date.getMonth()+1) + ' / ' + date.getDate());
      chart_data.unshift(data[(date.getMonth()+1) + ' / ' + date.getDate()] || 0);
  }

  var areaChartData = {
    labels: labels,
    datasets: [
      {
        label: "가입자수 현황",
        fillColor: "rgba(60,141,188,0.9)",
        strokeColor: "rgba(60,141,188,0.8)",
        pointColor: "#3b8bba",
        pointStrokeColor: "rgba(60,141,188,1)",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(60,141,188,1)",
        data: chart_data
      }
    ]
  };

  var areaChartOptions = {
    //Boolean - If we should show the scale at all
    showScale: true,
    //Boolean - Whether grid lines are shown across the chart
    scaleShowGridLines: true,
    //String - Colour of the grid lines
    scaleGridLineColor: "rgba(0,0,0,.05)",
    //Number - Width of the grid lines
    scaleGridLineWidth: 1,
    //Boolean - Whether to show horizontal lines (except X axis)
    scaleShowHorizontalLines: true,
    //Boolean - Whether to show vertical lines (except Y axis)
    scaleShowVerticalLines: true,
    //Boolean - Whether the line is curved between points
    bezierCurve: false,
    //Number - Tension of the bezier curve between points
    bezierCurveTension: 0.3,
    //Boolean - Whether to show a dot for each point
    pointDot: true,
    //Number - Radius of each point dot in pixels
    pointDotRadius: 4,
    //Number - Pixel width of point dot stroke
    pointDotStrokeWidth: 1,
    //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
    pointHitDetectionRadius: 20,
    //Boolean - Whether to show a stroke for datasets
    datasetStroke: true,
    //Number - Pixel width of dataset stroke
    datasetStrokeWidth: 2,
    //Boolean - Whether to fill the dataset with a color
    datasetFill: true,
    //String - A legend template
    legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].lineColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>",
    //Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
    maintainAspectRatio: true,
    //Boolean - whether to make the chart responsive to window resizing
    responsive: true
  };

  var lineChartCanvas = $("#lineChart").get(0).getContext("2d");
  var lineChart = new Chart(lineChartCanvas);
  var lineChartOptions = areaChartOptions;
  lineChartOptions.datasetFill = false;
  lineChart.Line(areaChartData, lineChartOptions);
};

var init_chart = function() {
    var date = new Date();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var labels = [];
    for (var i = 0; i < 7; i++) {
        date.setDate(date.getDate() - i);
        labels.unshift((date.getMonth()+1) + ' / ' + date.getDate());
    }
  var areaChartData = {
    labels: labels,
    datasets: [
      {
        label: "Electronics",
        fillColor: "rgba(210, 214, 222, 1)",
        strokeColor: "rgba(210, 214, 222, 1)",
        pointColor: "rgba(210, 214, 222, 1)",
        pointStrokeColor: "#c1c7d1",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(220,220,220,1)",
        data: [65, 59, 80, 81, 56, 55, 40]
      },
      {
        label: "Digital Goods",
        fillColor: "rgba(60,141,188,0.9)",
        strokeColor: "rgba(60,141,188,0.8)",
        pointColor: "#3b8bba",
        pointStrokeColor: "rgba(60,141,188,1)",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(60,141,188,1)",
        data: [28, 48, 40, 19, 86, 27, 90]
      }
    ]
  };

  var areaChartOptions = {
    //Boolean - If we should show the scale at all
    showScale: true,
    //Boolean - Whether grid lines are shown across the chart
    scaleShowGridLines: true,
    //String - Colour of the grid lines
    scaleGridLineColor: "rgba(0,0,0,.05)",
    //Number - Width of the grid lines
    scaleGridLineWidth: 1,
    //Boolean - Whether to show horizontal lines (except X axis)
    scaleShowHorizontalLines: true,
    //Boolean - Whether to show vertical lines (except Y axis)
    scaleShowVerticalLines: true,
    //Boolean - Whether the line is curved between points
    bezierCurve: false,
    //Number - Tension of the bezier curve between points
    bezierCurveTension: 0.3,
    //Boolean - Whether to show a dot for each point
    pointDot: true,
    //Number - Radius of each point dot in pixels
    pointDotRadius: 4,
    //Number - Pixel width of point dot stroke
    pointDotStrokeWidth: 1,
    //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
    pointHitDetectionRadius: 20,
    //Boolean - Whether to show a stroke for datasets
    datasetStroke: true,
    //Number - Pixel width of dataset stroke
    datasetStrokeWidth: 2,
    //Boolean - Whether to fill the dataset with a color
    datasetFill: true,
    //String - A legend template
    legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].lineColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>",
    //Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
    maintainAspectRatio: true,
    //Boolean - whether to make the chart responsive to window resizing
    responsive: true
  };

  var lineChartCanvas = $("#lineChart").get(0).getContext("2d");
  var lineChart = new Chart(lineChartCanvas);
  var lineChartOptions = areaChartOptions;
  lineChartOptions.datasetFill = false;
  lineChart.Line(areaChartData, lineChartOptions);
};
