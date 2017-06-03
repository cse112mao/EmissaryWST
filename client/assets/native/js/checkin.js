$(document).ready(function() {

  var socket = io();

  var VALIDATE_COMPANY_ID = "validate_company_id";
  var ADD_VISITOR = "add_visitor";
  var RECENT_APPOINTMENTS_LIST = "recent_appointments_list";
  var NOTIFY_RECENT_APPOINTMENTS_LIST = "notify_recent_appointments_list";

  var companyData = JSON.parse(localStorage.getItem("currentCompany"));
  var appList;
  companyData.company_id = companyData._id;
  console.log(companyData);
  socket.emit(VALIDATE_COMPANY_ID, companyData);

  //Prevent users from scrolling around on iPad
  document.ontouchmove = function(e) {
    e.preventDefault();
  };

  //Bind Listeners
  $('#tap-to-check').on('click', askApt);
  $('#no-apt').on('click', startCheckIn);
  $('#yes-apt').on('click', selectApt);
  /*$('.check-in').on('submit', submitForm);*/
  $('.check-in').on('submit', submitFormOG);



  function formatAptForSubmit() {

  }
  //When a user starts their check in
  function startCheckIn() {
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

  function returnToVisitorList() {

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
    /*
    $(this).animate({
      top: '35%',
      opacity: '0'
    }, 0);
    */

  }

  function submitFormOG() {
   var data = {};
   data.company_id = companyData._id;
   data.first_name = $('#visitor-first').val();
   data.last_name = $('#visitor-last').val();
   data.phone_number = $('#visitor-number').val();
   data.checkin_time = new Date();
  console.log ("this is the data for submit no appt: ");
  console.log (data);
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

  //Grabs elements from the check in and puts it into an object
  function grabFormElements(event) {
    var newVisitor = {};
    newVisitor.first_name = event.first_name;
    newVisitor.last_name = event.last_name;
    newVisitor.phone_number = event.phone_number;
    newVisitor.checkin_time = event.checkin_time;
    newVisitor.company_id = companyData._id;
    newVisitor.appointments = event.appointments;

    return newVisitor;
  }

  //CLOCK
  function updateClock() {
    var currentTime = new Date();
    var currentHours = currentTime.getHours();
    var currentMinutes = currentTime.getMinutes();
    //var currentSeconds = currentTime.getSeconds ( );
    // Pad the minutes and seconds with leading zeros, if required
    currentMinutes = ( currentMinutes < 10 ? "0" : "" ) + currentMinutes;
    //currentSeconds = ( currentSeconds < 10 ? "0" : "" ) + currentSeconds;

    // Convert the hours component to 12-hour format if needed
    currentHours = ( currentHours > 12 ) ? currentHours - 12 : currentHours;

    // Convert an hours component of "0" to "12"
    currentHours = ( currentHours == 0 ) ? 12 : currentHours;

    // Compose the string for display
    var currentTimeString = currentHours + ":" + currentMinutes;

    $("#clock").html(currentTimeString);
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
   * Compare appointment Date to today's Date
   */
   function compareDate(appointment) {
    var today = new Date();
    appointment = new Date(Date.parse(appointment));

    var appointmentDate = appointment.getFullYear() + ' ' + appointment.getDate() + ' ' + appointment.getMonth();
    var todayDate = today.getFullYear() + ' ' + today.getDate() + ' ' + today.getMonth();

    return (appointmentDate == todayDate);
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
      first_name : apt.first_name,
      last_name : apt.last_name,
      phone_number : apt.phone_number,
      checkin_time : (new Date()),
      appointments : [{
        "_id" :  apt._id,
        "first_name" : apt.first_name,
        "last_name" : apt.last_name,
        "phone_number" : apt.phone_number,
        "date" : (new Date()), 
        "company_id" : apt.company_id,
        "provider_name" : apt.provider_name
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

/*
    function initializeAppts(appts) {
    appts.sort(function(a, b) {
      return new Date(a.date) - new Date(b.date);
    });
    for (var i = 0, len = appts.length; i < len; i++) {
      appts[i].fullDate = formatDate(appts[i].date.toString());
      appts[i].appointmentTime = formatTime(appts[i].date.toString());
    }
    return appts;
  }
  */
    /***
   * Makes a get request to display list of appts
   * @param none
   * @returns displays the appt list
   */
   /*
  function getAppts() {
    var json;
    $.ajax({
      dataType: 'json',
      type: 'GET',
      data: $('#response').serialize(),
      async: false,
      url: '/api/appointments/company/' + companyData.company_id,
      success: function(response) {
        json = response;
        console.log(response);
      }
    });
    return json;
  }
*/
  /*
  $(document).on('click', '.patient-queue-text', function() {
    var uniqueId = $(this).attr('value');
    var apt = findApt(uniqueId);
    var compiledTemplate = modalTemplate(apt);
    $('.modal-dialog').html(compiledTemplate);
  });
  */

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
