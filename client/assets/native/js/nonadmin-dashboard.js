var userState = JSON.parse(localStorage.getItem("userState"));
if (!userState) {
  location.href = "login.html";
}

$(document).ready(function() {


  var socket = io(); //Initialize Socket

  //Socket variables
  var DEBUG = 1;
  var VALIDATE_COMPANY_ID = "validate_company_id";
  var VISITOR_LIST_UPDATE = "visitor_list_update";
  var REMOVE_VISITOR = "remove_visitor";
  var RECENT_VISITORS_LIST = "recent_visitors_list";
  var NOTIFY_RECENT_VISITORS_LIST = "notify_recent_visitors_list";
  var RECENT_APPOINTMENTS_LIST = "recent_appointments_list";
  var NOTIFY_RECENT_APPOINTMENTS_LIST = "notify_recent_appointments_list";
  var GET_LATE_APPOINTMENTS = "get_late_appointments";
  var NOTIFY_LATE_APPOINTMENTS = "notify_late_appointments";
  var GET_PERCENT_LATE_VISITORS = "get_percent_late_visitors";
  var NOTIFY_GET_PERCENT_LATE_VISITORS = "notify_get_percent_late_visitors";
  var GET_EXPECTED_APPOINTMENTS = "get_expected_appointments";
  var NOTIFY_GET_EXPECTED_APPOINTMENTS = "notify_get_expected_appointments";

  var checkedin_visitors;
  var chart;
  var tmpCurrDate = new Date();
  var todayStr = (tmpCurrDate.getMonth() + 1) + "/" + tmpCurrDate.getDate() + "/" + tmpCurrDate.getFullYear();
  var companyData = JSON.parse(localStorage.getItem("currentCompany"));
  companyData.company_id = companyData._id;

  /* chart! */
  chart = Highcharts.chart('container', {
    title: {
      text: 'Check-ins Today',
      type: 'column'
    },
    subtitle: {
      text: todayStr
    },
    xAxis: {
      type: 'category'
      /*
       categories:  [
       '4:00AM - 7:59AM',
       '8:00AM - 11:59AM',
       '12:00PM - 3:59PM',
       '4:00PM - 7:59PM',
       '8:00PM - 11:59PM',
       ]
       */
    },

    yAxis: {
      title: {
        text: 'Number of Check-ins'
      }

    },
    tooltip: {
      headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
      pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b><br/>'
    },
    series: [{
      name: 'Check-ins Overview',
      type: 'column',
      data: [{
        name: '12:00AM - 3:59AM',
        y: 0,
        drilldown: '12AM'
      }, {
        name: '4:00AM - 7:59AM',
        y: 0,
        drilldown: '4AM'
      }, {
        name: '8:00AM - 11:59AM',
        y: 0,
        drilldown: '8AM'
      }, {
        name: '12:00PM - 3:59PM',
        y: 0,
        drilldown: '12PM'
      }, {
        name: '4:00PM - 7:59AM',
        y: 0,
        drilldown: '4PM'
      }, {
        name: '8:00PM - 11:59PM',
        y: 0,
        drilldown: '8PM'
      }]
    }],
    drilldown: {
      series: [{
        name: '12:00AM - 3:59AM',
        id: '12AM',
        data: [['12AM', 0], ['1AM', 0], ['2AM', 0], ['3AM', 0]
        ]
      },
        {
          name: '4:00AM - 7:59AM',
          id: '4AM',
          data: [['4AM', 0], ['5AM', 0], ['6AM', 0], ['7AM', 0]
          ]
        },
        {
          name: '8:00AM - 11:59AM',
          id: '8AM',
          data: [['8AM', 0], ['9AM', 0], ['10AM', 0], ['11AM', 0]
          ]
        },
        {
          name: '12:00PM-3:59PM',
          id: '12PM',
          data: [['12PM', 0], ['1PM', 0], ['2PM', 0], ['3PM', 0]
          ]
        },
        {
          name: '4:00PM-7:59PM',
          id: '4PM',
          data: [['4PM', 0], ['5PM', 0], ['6PM', 0], ['7PM', 0]
          ]
        },
        {
          name: '8:00PM-11:59PM',
          id: '8PM',
          data: [['8PM', 0], ['9PM', 0], ['10PM', 0], ['11PM', 0]
          ]
        },
      ]
    }
  });
  /*
   * Timer variable for interval updates to non-admin dashboard
   * every 5 min
   */
  updateNonAdminDashboard();
  setInterval(updateNonAdminDashboard, 5000);
  function updateNonAdminDashboard() {
    console.log("emitting RECENT_VISITORS_LIST");
    socket.emit(RECENT_VISITORS_LIST, companyData);
    socket.emit(RECENT_APPOINTMENTS_LIST, companyData);
    socket.emit(GET_LATE_APPOINTMENTS, companyData);
    socket.emit(GET_PERCENT_LATE_VISITORS, companyData);
    socket.emit(GET_EXPECTED_APPOINTMENTS, companyData);
  }

  socket.on(NOTIFY_RECENT_VISITORS_LIST, function(data) {
    var num_checkedin;
    if (data.visitors == undefined) {
      num_checkedin = 0;
    }
    else {
      checkedin_visitors = data.visitors;
      num_checkedin = data.visitors.length;
      updateChart(checkedin_visitors);
    }
    console.log("callback from NOTIFY_RECENT_VISITORS_LIST");
    document.getElementById('numCheckedIn').innerHTML = num_checkedin;
    setAptRatio(data);
  });
  socket.on(NOTIFY_RECENT_APPOINTMENTS_LIST, function(data) {
    var num_outstanding = data.appointments.length;
    console.log("callback from NOTIFY_RECENT_APPOINTMENTS_LIST");
    document.getElementById('numOutstandingUsers').innerHTML = num_outstanding;
    document.getElementById('remainingApts').innerHTML = getRemainingApts(data);
    setNextApt(data);
  });
  socket.on(NOTIFY_LATE_APPOINTMENTS, function(data) {
    var num_late = data.appointments.length;
    console.log("callback from NOTIFY_LATE_APPOINTMENTS");
    document.getElementById('numLateUsers').innerHTML = num_late;
  });
  socket.on(NOTIFY_GET_PERCENT_LATE_VISITORS, function(data) {
    var dec = data.percentLate;
    console.log("callback from NOTIFY_GET_PERCENT_LATE_VISITORS");
    document.getElementById('percentLate').innerHTML = (dec.toFixed(4) * 100) + "%";
  });
  socket.on(NOTIFY_GET_EXPECTED_APPOINTMENTS, function(data) {
    var num_expected = data.appointments.length;
    console.log("callback from NOTIFY_GET_EXPECTED_APPOINTMENTS");
    document.getElementById('numExpected').innerHTML = num_expected;
  });


  function setAptRatio(data) {
    //fill in apt to walk in for today
    var apt = 0;
    var walkIn = 0;
    for (var i = 0; i < data.visitors.length; i++) {
      var visitorObj = data.visitors[i];
      if (visitorObj.appointments.length == 0) {
        walkIn++;
      }
      else {
        apt++;
      }
    }
    if (apt == 0) {
      document.getElementById('ratioApt').innerHTML = "N/A";
      document.getElementById('ratioText').innerHTML = "No Appointment Checkin-ins";
    }
    else if (walkIn == 0) {
      document.getElementById('ratioApt').innerHTML = "N/A";
      document.getElementById('ratioText').innerHTML = "No Walk-ins";
    }
    else if (apt <= walkIn) {
      document.getElementById('ratioApt').innerHTML = "1 : " + (Math.round((walkIn / apt) * 100) / 100);
      document.getElementById('ratioText').innerHTML = "Appointments : Walk-ins";
    }
    else {
      document.getElementById('ratioApt').innerHTML = "1 : " + (Math.round((apt / walkIn) * 100) / 100);
      document.getElementById('ratioText').innerHTML = "Walk-ins : Appointments";
    }

  }

  function setNextApt(data) {
    var currentDate = new Date();
    //fill in next appointment
    var nextAppointment = undefined;
    var nextAppointmentDateDifference = undefined;
    for (var i = 0; i < data.appointments.length; i++) {
      var appointmentObj = data.appointments[i];
      var appointmentObjDateDifference = (new Date(appointmentObj.date)).valueOf() - currentDate.valueOf();
      if (appointmentObjDateDifference >= 0) {
        if (nextAppointment == undefined || nextAppointmentDateDifference == undefined) {
          nextAppointment = appointmentObj;
          nextAppointmentDateDifference = appointmentObjDateDifference;
        }
        else if (appointmentObjDateDifference < nextAppointmentDateDifference) {
          nextAppointment = appointmentObj;
          nextAppointmentDateDifference = appointmentObjDateDifference;
        }
      }
    }
    if (nextAppointment == undefined) {
      document.getElementById('nextApt').innerHTML = "None";
      document.getElementById('nextAptTime').innerHTML = "For Today";
    }
    else {
      document.getElementById('nextApt').innerHTML = nextAppointment.last_name + ", " + nextAppointment.first_name;
      document.getElementById('nextAptTime').innerHTML = formatTime(nextAppointment.date);
    }
  }

  function getRemainingApts(data) {
    var currentDate = new Date();

    //fill in remaining appointments
    var remainingAppointments = 0;
    for (var i = 0; i < data.appointments.length; i++) {
      var appointmentObj = data.appointments[i];
      var appointmentObjDate = new Date(appointmentObj.date);
      if (appointmentObjDate.valueOf() - currentDate.valueOf() > 0) {

        remainingAppointments++;
      }
    }
    return remainingAppointments;
  }

  /***
   * Function to format a JSON date object into a string
   * @param time
   */
  function formatTime(time) {
    var currentTime = new Date(Date.parse(time));
    var hour = currentTime.getHours();
    var minute = currentTime.getMinutes();

    if (minute < 10) {
      minute = '0' + minute;
    }

    if (hour >= 13) {
      hour = hour - 12;
      currentTime = hour + ':' + minute + 'PM';
    }

    else if (hour === 12) {
      currentTime = hour + ':' + minute + 'PM';
    }
    else if (hour === 0) {
      currentTime = 1 + ':' + minute + 'AM';
    }
    else {
      currentTime = hour + ':' + minute + 'AM';
    }

    return currentTime;
  }

  //charts
  function updateChart(visitors) {
    console.log("updating charts");
    console.log(chart);
    if (chart.series[0].name != 'Check-ins Overview') {
      return;
    }
    for (var i = 0; i < chart.series[0].data.length; i++) {
      chart.series[0].data[i].y = 0;
      for (var j = 0; j < chart.options.drilldown.series[i].data.length; j++) {
        chart.options.drilldown.series[i].data[j][1] = 0;
      }
    }
    for (var i = 0; i < visitors.length; i++) {
      var date = new Date(visitors[i].checkin_time);
      switch (date.getHours()) {
        case 0:
          if (chart.series[0].name == 'Check-ins Overview') {
            chart.options.drilldown.series[0].data[0][1] = chart.options.drilldown.series[0].data[0][1] + 1;
            chart.series[0].data[0].update(chart.series[0].data[0].y + 1);
          }
          break;
        case 1:
          if (chart.series[0].name == 'Check-ins Overview') {
            chart.options.drilldown.series[0].data[1][1] = chart.options.drilldown.series[0].data[1][1] + 1;
            chart.series[0].data[0].update(chart.series[0].data[0].y + 1);
          }
          break;
        case 2:
          if (chart.series[0].name == 'Check-ins Overview') {
            chart.options.drilldown.series[0].data[2][1] = chart.options.drilldown.series[0].data[2][1] + 1;
            chart.series[0].data[0].update(chart.series[0].data[0].y + 1);
          }
          break;
        case 3:
          if (chart.series[0].name == 'Check-ins Overview') {
            chart.options.drilldown.series[0].data[3][1] = chart.options.drilldown.series[0].data[3][1] + 1;
            chart.series[0].data[0].update(chart.series[0].data[0].y + 1);
          }
          break;

        case 4:
          if (chart.series[0].name == 'Check-ins Overview') {
            chart.options.drilldown.series[1].data[0][1] = chart.options.drilldown.series[1].data[0][1] + 1;
            chart.series[0].data[1].update(chart.series[0].data[1].y + 1);
          }
          break;
        case 5:
          if (chart.series[0].name == 'Check-ins Overview') {
            chart.options.drilldown.series[1].data[1][1] = chart.options.drilldown.series[1].data[1][1] + 1;
            chart.series[0].data[1].update(chart.series[0].data[1].y + 1);
          }
          break;
        case 6:
          if (chart.series[0].name == 'Check-ins Overview') {
            chart.options.drilldown.series[1].data[2][1] = chart.options.drilldown.series[1].data[2][1] + 1;
            chart.series[0].data[1].update(chart.series[0].data[1].y + 1);
          }
          break;
        case 7:
          if (chart.series[0].name == 'Check-ins Overview') {
            chart.options.drilldown.series[1].data[3][1] = chart.options.drilldown.series[1].data[3][1] + 1;
            chart.series[0].data[1].update(chart.series[0].data[1].y + 1);
          }
          break;

        case 8:
          if (chart.series[0].name == 'Check-ins Overview') {
            chart.options.drilldown.series[2].data[0][1] = chart.options.drilldown.series[2].data[0][1] + 1;
            chart.series[0].data[2].update(chart.series[0].data[2].y + 1);
          }
          break;
        case 9:
          if (chart.series[0].name == 'Check-ins Overview') {
            chart.options.drilldown.series[2].data[1][1] = chart.options.drilldown.series[2].data[1][1] + 1;
            chart.series[0].data[2].update(chart.series[0].data[2].y + 1);
          }
          break;
        case 10:
          if (chart.series[0].name == 'Check-ins Overview') {
            chart.options.drilldown.series[2].data[2][1] = chart.options.drilldown.series[2].data[2][1] + 1;
            chart.series[0].data[2].update(chart.series[0].data[2].y + 1);
          }
          break;
        case 11:
          if (chart.series[0].name == 'Check-ins Overview') {
            chart.options.drilldown.series[2].data[3][1] = chart.options.drilldown.series[2].data[3][1] + 1;
            chart.series[0].data[2].update(chart.series[0].data[2].y + 1);
          }
          break;

        case 12:
          if (chart.series[0].name == 'Check-ins Overview') {
            chart.options.drilldown.series[3].data[0][1] = chart.options.drilldown.series[3].data[0][1] + 1;
            chart.series[0].data[3].update(chart.series[0].data[3].y + 1);
          }
          break;
        case 13:
          if (chart.series[0].name == 'Check-ins Overview') {
            chart.options.drilldown.series[3].data[1][1] = chart.options.drilldown.series[3].data[1][1] + 1;
            chart.series[0].data[3].update(chart.series[0].data[3].y + 1);
          }
          break;
        case 14:
          if (chart.series[0].name == 'Check-ins Overview') {
            chart.options.drilldown.series[3].data[2][1] = chart.options.drilldown.series[3].data[2][1] + 1;
            chart.series[0].data[3].update(chart.series[0].data[3].y + 1);
          }
          break;
        case 15:
          if (chart.series[0].name == 'Check-ins Overview') {
            chart.options.drilldown.series[3].data[3][1] = chart.options.drilldown.series[3].data[3][1] + 1;
            chart.series[0].data[3].update(chart.series[0].data[3].y + 1);
          }
          break;

        case 16:
          if (chart.series[0].name == 'Check-ins Overview') {
            chart.options.drilldown.series[4].data[0][1] = chart.options.drilldown.series[4].data[0][1] + 1;
            chart.series[0].data[4].update(chart.series[0].data[4].y + 1);
          }
          break;
        case 17:
          if (chart.series[0].name == 'Check-ins Overview') {
            chart.options.drilldown.series[4].data[1][1] = chart.options.drilldown.series[4].data[1][1] + 1;
            chart.series[0].data[4].update(chart.series[0].data[4].y + 1);
          }
          break;
        case 18:
          if (chart.series[0].name == 'Check-ins Overview') {
            chart.options.drilldown.series[4].data[2][1] = chart.options.drilldown.series[4].data[2][1] + 1;
            chart.series[0].data[4].update(chart.series[0].data[4].y + 1);
          }
          break;
        case 19:
          if (chart.series[0].name == 'Check-ins Overview') {
            chart.options.drilldown.series[4].data[3][1] = chart.options.drilldown.series[4].data[3][1] + 1;
            chart.series[0].data[4].update(chart.series[0].data[4].y + 1);
          }
          break;

        case 20:
          if (chart.series[0].name == 'Check-ins Overview') {
            chart.options.drilldown.series[5].data[0][1] = chart.options.drilldown.series[5].data[0][1] + 1;
            chart.series[0].data[5].update(chart.series[0].data[5].y + 1);
          }
          break;
        case 21:
          if (chart.series[0].name == 'Check-ins Overview') {
            chart.options.drilldown.series[5].data[1][1] = chart.options.drilldown.series[5].data[1][1] + 1;
            chart.series[0].data[5].update(chart.series[0].data[5].y + 1);
          }
          break;
        case 22:
          if (chart.series[0].name == 'Check-ins Overview') {
            chart.options.drilldown.series[5].data[2][1] = chart.options.drilldown.series[5].data[2][1] + 1;
            chart.series[0].data[5].update(chart.series[0].data[5].y + 1);
          }
          break;
        case 23:
          if (chart.series[0].name == 'Check-ins Overview') {
            chart.options.drilldown.series[5].data[3][1] = chart.options.drilldown.series[5].data[3][1] + 1;
            chart.series[0].data[5].update(chart.series[0].data[5].y + 1);
          }
          break;
      }
    }
  }
}); 