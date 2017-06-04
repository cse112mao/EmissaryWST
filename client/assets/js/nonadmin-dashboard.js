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
  var NOTIFY_RECENT_VISITORS_LIST = "notify_recent_visitor_list";

  var companyData = JSON.parse(localStorage.getItem("currentCompany"));  
  /*
   * Timer variable for interval updates to non-admin dashboard
   * every 5 min
   */
    setTimeout(updateNonAdminDashboard, 300000);
    function updateNonAdminDashboard(){
      socket.emit(RECENT_VISITOR_LIST, companyData);
      socket.emit(RECENT_VISITOR_LIST, companyData);
    }

    socket.on(NOTIFY_RECENT_VISITORS_LIST, function(data) {
      var num_checkedin = data.visitors.length;
      console.log(num_checkedin);
    });
});