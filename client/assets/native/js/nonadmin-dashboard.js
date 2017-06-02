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

  var companyData = JSON.parse(localStorage.getItem("currentCompany"));  
  companyData.company_id = companyData._id;
  /*
   * Timer variable for interval updates to non-admin dashboard
   * every 5 min
   */
    setInterval(updateNonAdminDashboard, 5000);
    function updateNonAdminDashboard(){
      console.log("emitting RECENT_VISITORS_LIST");
      socket.emit(RECENT_VISITORS_LIST, companyData);
    }

    socket.on(NOTIFY_RECENT_VISITORS_LIST, function(data) {
      var num_checkedin = data.visitors.length;
      console.log("callback from NOTIFY_RECENT_VISITORS_LIST");
      document.getElementById('numCheckedIn').innerHTML = num_checkedin;
      console.log(num_checkedin);
    });
});