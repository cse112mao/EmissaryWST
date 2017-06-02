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
  var GET_LATE_APPOINTMENTS= "get_late_appointments";
  var NOTIFY_LATE_APPOINTMENTS= "notify_late_appointments";

  var companyData = JSON.parse(localStorage.getItem("currentCompany"));  
  companyData.company_id = companyData._id;
  /*
   * Timer variable for interval updates to non-admin dashboard
   * every 5 min
   */
   updateNonAdminDashboard();
   setInterval(updateNonAdminDashboard, 5000);
   function updateNonAdminDashboard(){
   	console.log("emitting RECENT_VISITORS_LIST");
   	socket.emit(RECENT_VISITORS_LIST, companyData);
   	socket.emit(RECENT_APPOINTMENTS_LIST, companyData);
   	socket.emit(GET_LATE_APPOINTMENTS, companyData);
   }

   socket.on(NOTIFY_RECENT_VISITORS_LIST, function(data) {
   	var num_checkedin;
   	if (data.visitors == undefined) {
   		num_checkedin = 0;
   	}
   	else {
   		num_checkedin = data.visitors.length;
   	}
   	console.log("callback from NOTIFY_RECENT_VISITORS_LIST");
   	document.getElementById('numCheckedIn').innerHTML = num_checkedin;
   	console.log(num_checkedin);
   });
   socket.on(NOTIFY_RECENT_APPOINTMENTS_LIST, function(data) {
   	var num_outstanding = data.appointments.length;
   	console.log("callback from NOTIFY_RECENT_APPOINTMENTS_LIST");
   	document.getElementById('numOutstandingUsers').innerHTML = num_outstanding;
   	console.log(num_outstanding);
   });
   socket.on(NOTIFY_LATE_APPOINTMENTS, function(data) {
   	var num_late = data.appointments.length;
   	console.log("callback from NOTIFY_LATE_APPOINTMENTS");
   	document.getElementById('numLateUsers').innerHTML = num_late;
   	console.log(num_late);
   });
});