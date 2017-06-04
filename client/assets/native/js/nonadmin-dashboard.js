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
  var GET_PERCENT_LATE_VISITORS= "get_percent_late_visitors";
  var NOTIFY_GET_PERCENT_LATE_VISITORS= "notify_get_percent_late_visitors";
  var GET_EXPECTED_APPOINTMENTS= "get_expected_appointments";
  var NOTIFY_GET_EXPECTED_APPOINTMENTS= "notify_get_expected_appointments";

  var checkedin_visitors;
  var chart;
  var tmpCurrDate = new Date();
  var todayStr = (tmpCurrDate.getMonth() + 1) + "/" + tmpCurrDate.getDate() + "/" + tmpCurrDate.getFullYear();
  var companyData = JSON.parse(localStorage.getItem("currentCompany"));  
  companyData.company_id = companyData._id;

  /* chart! */
   chart = Highcharts.chart('container', {
   	title: {
   		text: 'Check-ins Today'
   	},
   	subtitle: {
   		text: todayStr
   	},
   	xAxis: {
   		categories:  [
 			'12:00AM - 3:59AM',
   			'4:00AM - 7:59AM',
   			'8:00AM - 11:59AM',
   			'12:00AM - 3:59AM',
   			'4:00PM - 7:59PM',
   			'8:00PM - 11:59PM',
   			]
   	},
   	
   	yAxis: {
   		title: {
   			text: 'Number of Check-ins'
   		}

   	},
   	series: [{name: '# Check-ins', type:'column', data: [0,0,0,0,0,0]}]
   });
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
   });
   socket.on(NOTIFY_RECENT_APPOINTMENTS_LIST, function(data) {
   	var num_outstanding = data.appointments.length;
   	console.log("callback from NOTIFY_RECENT_APPOINTMENTS_LIST");
   	document.getElementById('numOutstandingUsers').innerHTML = num_outstanding;
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

   

   //charts
   function updateChart(visitors){
   	console.log("updating charts");
   	console.log(chart);
   	for (var i = 0; i < chart.series[0].data.length; i++) {
   		chart.series[0].data[i].y = 0;
   	}
   	for (var i = 0;i < visitors.length;i++){
   		var date = new Date(visitors[i].checkin_time);
   		switch (date.getHours()) {
   			case 0:
   			case 1:
   			case 2:
   			case 3:
   			chart.series[0].data[0].update(chart.series[0].data[0].y + 1);
   			break;
   			case 4:
   			case 5:
   			case 6:
   			case 7:
   			chart.series[0].data[1].update(chart.series[0].data[1].y + 1);
   			break;
   			case 8:
   			case 9:
   			case 10:
   			case 11:
   			chart.series[0].data[2].update(chart.series[0].data[2].y + 1);
   			break;
   			case 12:
   			case 13:
   			case 14:
   			case 15:
   			chart.series[0].data[3].update(chart.series[0].data[3].y + 1);
   			break;
   			case 16:
   			case 17:
   			case 18:
   			case 19:
   			chart.series[0].data[4].update(chart.series[0].data[4].y + 1);
   			break;
   			case 20:
   			case 21:
   			case 22:
   			case 23:
   			chart.series[0].data[5].update(chart.series[0].data[5].y + 1);
   			break;
   		}
   	}
   }
}); 