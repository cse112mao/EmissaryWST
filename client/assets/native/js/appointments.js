$(document).ready(function() {
  var companyData = JSON.parse(localStorage.getItem("currentCompany"));
  var myCompanyId = companyData._id;
  var curUser = JSON.parse(localStorage.getItem('currentUser'));


  $('#user-name').text(curUser.first_name + ' ' + curUser.last_name);

  var appts = getAppts();

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

  appts = initializeAppts(appts);
  var source = $("#appt-list-template").html();
  var template = Handlebars.compile(source);
  var compiledHtml = template(appts);

  $("#appt-list").html(compiledHtml);
  $('.save-btn').click(submitForm);

  /***
   * Makes a get request to display list of appts
   * @param none
   * @returns displays the appt list
   */
  function getAppts() {
    var json;
    $.ajax({
      dataType: 'json',
      type: 'GET',
      data: $('#response').serialize(),
      async: false,
      url: '/api/appointments/company/' + myCompanyId,
      success: function(response) {
        json = response;
        console.log(response);
      }
    });
    return json;
  }

  /***
   * When a patient submits their form
   * @param none
   * @returns updates the appt list
   */
  function submitForm() {
    var d = grabFormElements();
    console.log(d);
    var date = d.date.substr(0, 3);
    var time = d.date.substr(-3, 3);

    // Execute the button if the format is correct
    if (date !== 'NaN' && time !== 'NaN') {
      updateApptList(d);
      appts = getAppts();
      appts = initializeAppts(appts);
      $("#appt-list").html(template(appts));
      document.getElementById("appt-form").reset();  
    }
    else {
      if (date === 'NaN' && time === 'NaN') {
        alert("Please enter date as mm/dd/yyyy and time as hh:mm AM/PM");
      }
      else if (date === 'NaN') {
        alert("Please enter date as mm/dd/yyyy");
      }
      else {
        alert("Please enter date as hh:mm AM/PM");
      }
    }
  }

  /***
   * Makes a post request to update list of appts when adding a new employee
   * @param none
   * @returns updates the appt list
   */
  function updateApptList(obj) {
    $.ajax({
      dataType: 'json',
      type: 'POST',
      data: obj,
      async: false,
      url: '/api/appointments/',
      success: function(response) {
        appts.push(response);
        console.log(response);
      }
    });
  }


  /***
   * Grabs elements from the check in and puts it into an object
   * @param none
   * @returns new appt object
   */
  function grabFormElements() {
    var newAppt = {};
    var userTime, userDate;
    newAppt.company_id = myCompanyId;
    newAppt.first_name = $('#appt-first').val();
    newAppt.last_name = $('#appt-last').val();
    newAppt.phone_number = $('#appt-number').val();
    newAppt.provider_name = $('#appt-provider').val();

    // Get date and time that user inputted
    userDate = $('#appt-date').val();
    userTime = $('#appt-time').val();

    newAppt.date = jsDate(userDate, userTime);
    return newAppt;
  }

  $(document).on('click', '.delete-appt', function() {
    var apptId = $(this).closest('.appt-row').attr('value');
    console.log("delete");
    $.ajax({
      dataType: 'json',
      type: 'DELETE',
      url: '/api/appointments/' + apptId,
      success: function(response) {
        var updateAppts = getAppts();
        var removeAppt = initializeAppts(updateAppts);
        $("#appt-list").html(template(removeAppt));

      }
    });

  });


  /********************* FUNCTIONS TO FORMAT JAVASCRIPT DATES ********************/

  // TODO = put in separate file for unit testing
  function formatNumber(number) {
    return '(' + number.substr(0, 3) + ')' + number.substr(3, 3) + '-' + number.substr(6, 4);
  }

});
