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
  var RECENT_VISITOR_LIST = "recent_visitor_list";

  var companyData = JSON.parse(localStorage.getItem("currentCompany"));
  var visitorList;
  companyData.company_id = companyData._id;


  //var curCompany = JSON.parse(localStorage.getItem('currentCompany'));
  var curUser = JSON.parse(localStorage.getItem('currentUser'));
  var companyName = companyData.name;


  $('#user-name').text(curUser.first_name + ' ' + curUser.last_name);

  //Connect to private socket
  //var companyId = getCookie('company_id');
  socket.emit(VALIDATE_COMPANY_ID, companyData);

  /***
   * Compile all the Handle Bar Templates
   */
    //DashBoard Template
  var source = $("#visitor-list-template").html();
  var template = Handlebars.compile(source);

  //Modal Template
  var modal = $('#visitor-info-template').html();
  var modalTemplate = Handlebars.compile(modal);

  //SOCKET LISTEN FOR VISITOR QUEUE
  socket.on(VISITOR_LIST_UPDATE, function(data) {
    visitorList = data.visitors
    
    //Parse Visitor List to format Date
    for (var i = 0, len = visitorList.length; i < len; i++) {
      visitorList[i].checkin_time = formatTime(visitorList[i].checkin_time);
    }

    //Parse Visitors appoitments
    for (i = 0; i < len; i++) {
      var appList = visitorList[i].appointments;
      if (appList[0]) {
        for (var j = 0, appLen = appList.length; j < appLen; j++) {
          if (compareDate(appList[j].date)) {
            visitorList[i].appointmentTime = formatTime(appList[j].date) + ", Today";
            visitorList[i]._apptId = appList[j]._id;
            break;
          }
          else {
            visitorList[i].appointmentTime = formatDate(appList[j].date);
            visitorList[i]._apptId = appList[j]._id;
            break;

          }
        }
      }
      else {

        visitorList[i].appointmentTime = "None";
      }
    }

    //visitorList.checkin_time = visitorList;
    var compiledHtml = template(visitorList);
    $('#visitor-list').html(compiledHtml);
  });


  /***
   * Listener for Opening a Modal
   */
  $(document).on('click', '.patient-check-out', function() {
    var uniqueId = $(this).attr('value');
    var visitor = findVisitor(uniqueId);
    var compiledTemplate = modalTemplate(visitor);
    $('.modal-dialog').html(compiledTemplate);
  });

  /***
   * Listener for Checking out a Visitor
   */
  $(document).on('click', '.check-in-btn', function() {
    var id = $(this).closest('.modal-content').find('.modal-body').attr('value');
    var apptId = $(this).closest('.modal-content').find('.modal-left').attr('value');

    var removeVisitor = findVisitor(id);

    removeVisitor.visitor_id = removeVisitor._id;

    $.ajax({
      dataType: 'json',
      type: 'DELETE',
      url: '/api/appointments/' + apptId,
      success: function(response) {
      }
    });


    socket.emit(REMOVE_VISITOR, removeVisitor);
  });

  /***
   * Find Specific Visitor Given Visitor ID within the Visitor Array
   * @param id
   * @returns {string}
   */
  function findVisitor(id) {

    for (var visitor in visitorList) {
      if (visitorList.hasOwnProperty(visitor)) {
        if (visitorList[visitor]._id === id) {
          if (DEBUG) console.log(visitorList[visitor]);
          return visitorList[visitor];
        }
      }
    }
  }

});
