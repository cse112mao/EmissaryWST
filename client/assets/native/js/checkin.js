$(document).ready(function() {

  var socket = io();

  var VALIDATE_COMPANY_ID = "validate_company_id";
  var ADD_VISITOR = "add_visitor";
  var RECENT_APPOINTMENTS_LIST = "recent_appointments_list";
  var NOTIFY_RECENT_APPOINTMENTS_LIST = "notify_recent_appointments_list";

  var appList;
  var companyData = JSON.parse(localStorage.getItem("currentCompany"));
  companyData.company_id = companyData._id;
  console.log(companyData);
  socket.emit(VALIDATE_COMPANY_ID, companyData);

  //Prevent users from scrolling around on iPad
  document.ontouchmove = function(e) {
    e.preventDefault();
  };

  $.ajax({
      dataType: 'json',
      type: 'GET',
      url: '/api/form/template/company/' + companyData.company_id,
      success: function(response) {
        document.getElementById("check-in-page").style.backgroundColor = '#' + response.color;
      }
  });
  //Bind Listeners
  $('#tap-to-check').on('click', askApt);
  $('#no-apt').on('click', startCheckIn);
  $('#yes-apt').on('click', selectApt);
  $('.check-in').on('submit', submitFormOG);


  //When a user starts their check in
  function startCheckIn() {
    $.ajax({
      dataType: 'json',
      type: 'GET',
      url: '/api/form/template/company/' + companyData.company_id,
      success: function(response) {
        var compiledHtml = formTemplate(response.template);
        $('#custom-form').html(compiledHtml);
    }
  });
    $('.check-in').removeClass('hide');
    $('.check-in').addClass('show');
    $('.check-in').animate({
      top: '10%',
      opacity: '1'
    }, 700);
    $('.has-apt').addClass('hide');
    $('#clock').addClass('hide');
  }

  function askApt() {
    $('.has-apt').removeClass('hide');
    $('.has-apt').addClass('show');
    $('.has-apt').animate({
      top: '10%',
      opacity: '1'
    }, 700);
    $(this).addClass('hide');
    $('#clock').addClass('hide');
  }

  function selectApt() {
    $('.select-apt').removeClass('hide');
    $('.select-apt').addClass('show');
    $('.select-apt').animate({
      top: '10%',
      opacity: '1'
    }, 700);
    $('.has-apt').addClass('hide');
  }

  //When a patient submits their form
  function submitForm(event) {
    //event.preventDefault();
    var data = grabFormElements(event);
    //console.log(data.company_id);
    if (localStorage.getItem("slackToken") && localStorage.getItem("slackChannel")) {
      $.post("https://slack.com/api/chat.postMessage",
        {
          'token': localStorage.getItem("slackToken"),
          'channel': localStorage.getItem("slackChannel"),
          'text': "Name: " + data['first_name'] + " " + data['last_name'] + " Phone Number: " + data['phone_number']
        },
        function(data, status) {
        });
    }
    socket.emit(ADD_VISITOR, data);
  }

  function submitFormOG() {
    var data = {};
    data.company_id = companyData._id;
    data.checkin_time = new Date();
    data.additional_info = [];

    $('.visitor-fields').each(function() {
      if ($(this).attr('name') == "first") {
        data.first_name = $(this).val();
      }
      else if ($(this).attr('name') == "last") {
        data.last_name = $(this).val();
      }
      else if ($(this).attr('name') == "phoneNumber") {
        data.phone_number = $(this).val();
      }
      else {
        data.additional_info.push({name: $(this).attr('name'), value: $(this).val()});
      }
    });
    console.log("this is the data for submit no appt: ");
    console.log(data);
    if (localStorage.getItem("slackToken") && localStorage.getItem("slackChannel")) {
      $.post("https://slack.com/api/chat.postMessage",
        {
          'token': localStorage.getItem("slackToken"),
          'channel': localStorage.getItem("slackChannel"),
          'text': "Name: " + data['first_name'] + " " + data['last_name'] + " Phone Number: " + data['phone_number']
        },
        function(data, status) {
        });
    }
    socket.emit(ADD_VISITOR, data);
  }
  
  updateClock();
  setInterval(updateClock, 60 * 1000);
  /***
   * Compile all the Handle Bar Templates
   */
    //DashBoard Template
  var source = $("#apt-list-template").html();
  var template = Handlebars.compile(source);

  //Modal Template
  var modal = $('#apt-info-template').html();
  var modalTemplate = Handlebars.compile(modal);

  //Custom Form Template
  var form = $('#custom-form-template').html();
  var formTemplate = Handlebars.compile(form);

  console.log("emitting apt");
  socket.emit(RECENT_APPOINTMENTS_LIST, companyData);

  socket.on(NOTIFY_RECENT_APPOINTMENTS_LIST, function(data) {
    console.log("received callback apt");
    appList = data.appointments;
    console.log("appList:");
    console.log(appList);
    //Parse Visitors appointments
    for (var i = 0, appLen = appList.length; i < appLen; i++) {
      if (compareDate(appList[i].date)) {
        appList[i].appointmentTime = formatTime(appList[i].date);
        appList[i]._apptId = appList[i]._id;
      }
      else {

        appList[i].appointmentTime = "None";
      }
    }

    //visitorList.checkin_time = visitorList;
    var compiledHtml = template(appList);
    $('#apt-list').html(compiledHtml);
  });

  /***
   * Listener for Opening a Modal
   */
  $(document).on('click', '.patient-check-out', function() {
    var uniqueId = $(this).attr('value');
    var apt = findApt(uniqueId);
    var compiledTemplate = modalTemplate(apt);
    $('.modal-dialog').html(compiledTemplate);
  });

  $(document).on('click', '.check-in-btn', function() {
    console.log("entered on click confirm")
    var uniqueId = $(this).attr('value');
    var apt = findApt(uniqueId);
    var newVisitor = {
      first_name: apt.first_name,
      last_name: apt.last_name,
      phone_number: apt.phone_number,
      checkin_time: (new Date()),
      appointments: [{
        "_id": apt._id,
        "first_name": apt.first_name,
        "last_name": apt.last_name,
        "phone_number": apt.phone_number,
        "date": (new Date()),
        "company_id": apt.company_id,
        "provider_name": apt.provider_name
      }]
    };
    console.log("submitting visitor with apt")
    submitForm(newVisitor);
    $.ajax({
      dataType: 'json',
      type: 'DELETE',
      url: '/api/appointments/' + apt._id,
      success: function(response) {
      }
    });
    window.location.reload();
  });

  function findApt(id) {

    for (var apt in appList) {
      if (appList.hasOwnProperty(apt)) {
        if (appList[apt]._id === id) {
          /*if (DEBUG) console.log(visitorList[visitor]);*/
          return appList[apt];
        }
      }
    }
  }

  /***
   * Find a specific cookie name
   * @param cName
   * @returns {string|*}
   */
  function getCookie(cName) {
    var name = cName + '=';
    var cookieArray = document.cookie.split(';');

    for (var i = 0, len = cookieArray.length; i < len; i++) {
      var cookie = cookieArray[i];
      while (cookie.charAt(0) == ' ')
        cookie.substring(1);
      if (cookie.indexOf(name) == 0)
        return cookie.substring(name.length, cookie.length);
    }

  }


});
