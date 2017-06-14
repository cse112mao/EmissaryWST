'use strict';

var express = require('express');
var server;
var io = require('socket.io')();
var exports = module.exports;

//Constants for listening to Sockets
var CONNECTION = "connection";
var VALIDATE_COMPANY_ID = "validate_company_id";
var VISITOR_LIST_UPDATE = "visitor_list_update";

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

var DISCONNECT = "disconnect";
var REMOVE_VISITOR = "remove_visitor";
var ADD_VISITOR = "add_visitor";
var NOTIFY_ERROR = "notify_error";

var VisitorListCtr = require('../routes/visitorList/visitorList.controller');
var AppointmentListCtr = require('../routes/appointment/appointment.controller');
var twilio = require('../twilio');

var Company = require('../models/Company');
/********** Socket IO Module **********/
exports.createServer = function(io_in) {
  io = io_in;

  /*
   * This handles the 'connection' event, which is send when the user is
   * trying to connect a socket.`
   *
   * Note that when the connection is established for that client,
   * the '_admin_id' needs to be set so that the client can be added to the
   * room and notified when changes are being made.
   */
   io.on(CONNECTION, function(socket) {
    console.log("SOCKET CONNECTED");
    /* company_id is required to connect to join right socket to listen to*/
    socket.on(VALIDATE_COMPANY_ID, function(data) {
      console.log("VLAID COMPANY ID");
      var company_id = data.company_id;
      Company.findOne({_id: company_id}, function(err, c) {
        if (err || !c)
          return;
        else {
          socket.join(company_id);
          VisitorListCtr.getCompanyVisitorList(company_id, function(err_msg, result) {
            console.log(result);
            if (err_msg)
              exports.notifyError(company_id, {error: err_msg});
            else {
              exports.notifyNewList(company_id, result);
            }

          });
        }
      });
    });


    /**
     * Description: socket call listener for VISITOR_LIST_UPDATE
     * Preconditions: data contains company_id
     * OnSuccess: calls notifyNewList with object that is similar to VisitorList schema
     * OnFailure: calls notifyError 
     */

     socket.on(VISITOR_LIST_UPDATE, function(data) {
      var company_id = data.company_id;
      console.log("Visitor List Update" + data);
      VisitorListCtr.getCompanyVisitorList(company_id, function(err_msg, result) {
        if (err_msg) {
          exports.notifyError(company_id, {error: err_msg});
        }
        else
          exports.notifyNewList(company_id, result);
      });
    });

     socket.on(DISCONNECT, function() {
      // console.log('user disconnected from ' + company_id);
    });

    /**
     * Description: socket call listener for DISCONNECT 
     * Preconditions: data contains company_id and visitor_id
     * OnSuccess: calls notifyNewList, and deletes object with visitor_id from VisitorList database 
     * OnFailure: calls notifyError 
     */
     socket.on(REMOVE_VISITOR, function(data) {
      var company_id = data.company_id;
      var visitor_id = data.visitor_id;
      if (!company_id || !visitor_id) return;
      VisitorListCtr.deleteVisitor(company_id, visitor_id, function(err_msg, result) {
        if (err_msg) {
          console.log("error");
          exports.notifyError(company_id, {error: err_msg});
        }
        else
          exports.notifyNewList(company_id, result);

      });
    });

   /**
   * Description: socket call listener for ADD_VISITOR 
   * Preconditions: data contains company_id 
   * OnSuccess: calls notifynewlist, and adds visitor to VisitorList database 
   * OnFailure: calls notifyerror 
   */
   socket.on(ADD_VISITOR, function(data) {
    console.log("ADDING VISITOR");
    var company_id = data.company_id;
    VisitorListCtr.create(data, function(err_msg, result) {
      if (err_msg) {
        exports.notifyError(company_id, {error: err_msg});
      }
      else {
        exports.notifyNewList(company_id, result);
        twilio.sendSms('COMPANY_PHONE', data.first_name + ' ' + data.last_name + ' has checked in at ' + data.checkin_time.toString());
      }
    });
  });

  /**
   * Description: socket call listener for RECENT_VISITORS_LIST 
   * Preconditions: data contains company_id 
   * OnSuccess: calls notifyRecentVisitors with an object similar to VisitorList schema 
   * OnFailure: calls notifyError 
   */

   socket.on(RECENT_VISITORS_LIST, function(data) {
    console.log("get number of visitors checked in");
    var company_id = data.company_id;
    var currentDate = new Date();
    var visitorsWithin24Hours = {
      "_id": data._id,
      "company_id": data.company_id,
      "visitors": [],
    };

    VisitorListCtr.getCompanyVisitorList(company_id, function(err_msg, result) {

      for (var i = 0; i < result.visitors.length; i++) {
        var visitorObj = result.visitors[i];
        var tempDate = new Date(visitorObj.checkin_time);
        if (currentDate.getFullYear() == tempDate.getFullYear() && currentDate.getMonth() == tempDate.getMonth() && currentDate.getDate() == tempDate.getDate()) {
          visitorsWithin24Hours.visitors.push(visitorObj);
        }
      }

      if (err_msg) {
        console.log("error in recent_visitors_list");
        exports.notifyError(company_id, {error: err_msg});
      }
      else {
        exports.notifyRecentVisitors(company_id, visitorsWithin24Hours);
      }

    });

  });

  /**
   * Description: socket call listener for RECENT_APPOINTMENT_LIST
   * Preconditions: data contains company_id 
   * OnSuccess: calls notifyRecentAppointments with object similar to Appointments schema
   * OnFailure: calls notifyError 
   */
   socket.on(RECENT_APPOINTMENTS_LIST, function(data) {
    console.log("get number of visitors checked in");
    var company_id = data.company_id;
    var currentDate = new Date();
    var appointmentsWithin24Hours = {
      "company_id": company_id,
      "appointments": []
    };

    AppointmentListCtr.getAll(company_id, function(err_msg, result) {

      for (var i = 0; i < result.length; i++) {
        var appointmentObj = result[i];
        var tempDate = new Date(appointmentObj.date);
        if (currentDate.getFullYear() == tempDate.getFullYear() && currentDate.getMonth() == tempDate.getMonth() && currentDate.getDate() == tempDate.getDate()) {
          appointmentsWithin24Hours.appointments.push(appointmentObj);
        }
      }

      if (err_msg) {
        console.log("error in getting appointments");
        exports.notifyError(company_id, {error: err_msg});
      }
      else {
        exports.notifyRecentAppointments(company_id, appointmentsWithin24Hours);
      }

    });

  });

  /**
   * Description: socket call listener for GET_LATE_APPOINTMENTS 
   * Preconditions: data contains company_id 
   * OnSuccess: calls notifyLateAppointment with object similar to Appointments schema
   * OnFailure: calls notifyError 
   */
   socket.on(GET_LATE_APPOINTMENTS, function(data) {
    console.log("get number of visitors checked in");
    var company_id = data.company_id;
    var currentDate = new Date();
    var lateAppointments = {
      "company_id": company_id,
      "appointments": []
    };

    AppointmentListCtr.getAll(company_id, function(err_msg, result) {
      console.log(result);
      for (var i = 0; i < result.length; i++) {
        var appointmentObj = result[i];
        var tempDate = new Date(appointmentObj.date);
        if (currentDate.getFullYear() == tempDate.getFullYear() && currentDate.getMonth() == tempDate.getMonth() && currentDate.getDate() == tempDate.getDate()) {
          if (currentDate - tempDate > 0) {
            lateAppointments.appointments.push(appointmentObj);
          }
        }
      }

      if (err_msg) {
        console.log("error in getting appointments");
        exports.notifyError(company_id, {error: err_msg});
      }
      else {
        exports.notifyLateAppointment(company_id, lateAppointments);
      }

    });

  });

  /**
   * Description: socket call listener for GET_PERCENT_LATE_VISITORS 
   * Preconditions: data contains company_id 
   * OnSuccess: calls notifyPercentLate with the following object:
   * {
   *   "company_id": company_id,
   *   "percentLate": Float
   * };
   * OnFailure: calls notifyError 
   */
   socket.on(GET_PERCENT_LATE_VISITORS, function(data) {
    var company_id = data.company_id;
    var currentDate = new Date();
    var currentDateEnd = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 23, 59, 59, 999);
    var percentLateWeek = {
      "company_id": company_id,
      "percentLate": 0
    };

    VisitorListCtr.getCompanyVisitorList(company_id, function(err_msg, result) {
      var lateUsers = 0;
      var totalUsers = 0;

      result.visitors.sort(function(a,b){
        return parseInt(a._id) > parseInt(b._id);
      });

      for (var i = 0;i < result.visitors.length; i++){
        if(i == 0 || result.visitors[i]._id != result.visitors[i-1]._id){
          var visitorObj = result.visitors[i]; 
          for(var j = 0; j < visitorObj.appointments.length; j++){
            var appointmentObj = visitorObj.appointments[j];
            var checkin_time = new Date(appointmentObj.checkin_time);
            var tempDate = new Date(appointmentObj.date);
            if(currentDateEnd.valueOf() - tempDate.valueOf() >= 0 && (currentDateEnd.valueOf() - tempDate.valueOf())/1000 < 604800){
              if(checkin_time == undefined || checkin_time.valueOf() - tempDate.valueOf() > 0) {
                lateUsers++;
              }
              totalUsers++;
            }
          }
        }
      }
      if (totalUsers == 0) {
        percentLateWeek.percentLate = 0;
      }
      else {
        percentLateWeek.percentLate = lateUsers / totalUsers;
      }
      console.log(totalUsers);

      if (err_msg) {
        console.log("error in getting appointments");
        exports.notifyError(company_id, {error: err_msg});
      }
      else {
        console.log("sent");
        exports.notifyPercentLate(company_id, percentLateWeek);
      }

        /*
         //add existing late appointments
         AppointmentListCtr.getAll(company_id, function(err_msg, appointmentResult) {

         for (var i = 0;i < appointmentResult.length; i++){
         var innerAppointmentObj = appointmentResult[i]; 
         var innerAppintmentDate = new Date(innerAppointmentObj.date);
         if(currentDateEnd.valueOf() - innerAppintmentDate.valueOf() >= 0 && (currentDateEnd.valueOf() - innerAppintmentDate.valueOf())/1000 < 604800){
         if(currentDate.valueOf() - innerAppintmentDate.valueOf() > 0){
         lateUsers++;
         totalUsers++;
         }
         }

         }
         if(totalUsers == 0){
         percentLateWeek.percentLate = 0;
         }
         else{
         percentLateWeek.percentLate = lateUsers/totalUsers;
         }
         console.log(totalUsers);

         if(err_msg){
         console.log("error in getting appointments");
         exports.notifyError(company_id, {error: err_msg});
         }
         else{
         console.log("sent");
         exports.notifyPercentLate(company_id, percentLateWeek);
         }


         });
         */

       });
  });

  /**
   * Description: socket call listener for GET_EXPECTED_APPOINTMENTS
   * Preconditions: data contains company_id 
   * OnSuccess: calls notifyGetExpectedAppointments with object similar to Appointments schema
   * OnFailure: calls notifyError 
   */
   socket.on(GET_EXPECTED_APPOINTMENTS, function(data) {
    console.log("get number of visitors checked in");
    var company_id = data.company_id;
    var currentDate = new Date();
    var expectedAppointments = {
      "company_id": company_id,
      "appointments": []
    };

    AppointmentListCtr.getAll(company_id, function(err_msg, result) {

      for (var i = 0; i < result.length; i++) {
        var appointmentObj = result[i];
        var tempDate = new Date(appointmentObj.date);
        if (tempDate.valueOf() < (currentDate.valueOf() + 60 * 60 * 1000) && (currentDate.valueOf() - 60 * 60 * 1000) < tempDate.valueOf()) {
          expectedAppointments.appointments.push(appointmentObj);
        }
      }

      if (err_msg) {
        console.log("error in getting appointments");
        exports.notifyError(company_id, {error: err_msg});
      }
      else {
        exports.notifyGetExpectedAppointments(company_id, expectedAppointments);
      }

    });

  });
 });
return server;
};

/**
 * Function Name: notifyNewList
 * @Param company_id: id of the company
 * @Param data: data to pass in. Should contain data in defined in VisitorsList schema 
 * Description: notifies a change in the visitors list. Handled both here and /client/assets/native/js/dashboard.js
 * OnSuccess: emits data 
 */
 exports.notifyNewList = function(company_id, data) {
  io.to(company_id).emit(VISITOR_LIST_UPDATE, data);
};

/**
 * Function Name: notifyNewList
 * @Param company_id: id of the company
 * @Param data: data to pass in. 
 * Description: notifies a Error. 
 * OnSuccess: emits data 
 */
exports.notifyError = function(company_id, data) {
  io.to(company_id).emit(NOTIFY_ERROR, data);
};

/**
 * Function Name: notifyRecentVisitors
 * @Param company_id: id of the company
 * @Param data: data to pass in.
 * Description: notifies a change in the visitors list. /client/assets/native/views/nonadmin-dashboard.js
 * OnSuccess: emits data 
 */
exports.notifyRecentVisitors = function(company_id, data) {
  io.emit(NOTIFY_RECENT_VISITORS_LIST, data);
};

/**
 * Function Name: notifyRecentAppointments
 * @Param company_id: id of the company
 * @Param data: data to pass in. 
 * Description: notifies a change in the visitors list. /client/assets/native/views/nonadmin-dashboard.js
 * OnSuccess: emits data 
 */
exports.notifyRecentAppointments = function(company_id, data) {
  io.emit(NOTIFY_RECENT_APPOINTMENTS_LIST, data);
};

/**
 * Function Name: notifyLateAppointments
 * @Param company_id: id of the company
 * @Param data: data to pass in. 
 * Description: notifies a change in the visitors list. /client/assets/native/views/nonadmin-dashboard.js
 * OnSuccess: emits data 
 */
exports.notifyLateAppointment = function(company_id, data) {
  io.emit(NOTIFY_LATE_APPOINTMENTS, data);
};

/**
 * Function Name: notifyPercentLate
 * @Param company_id: id of the company
 * @Param data: data to pass in.
 * Description: notifies a change in the visitors list. /client/assets/native/views/nonadmin-dashboard.js
 * OnSuccess: emits data 
 */
exports.notifyPercentLate = function(company_id, data) {
  io.emit(NOTIFY_GET_PERCENT_LATE_VISITORS, data);
};

/**
 * Function Name: notifyExpectedAppointments
 * @Param company_id: id of the company
 * @Param data: data to pass in.
 * Description: notifies a change in the visitors list. /client/assets/native/views/nonadmin-dashboard.js
 * OnSuccess: emits data 
 */
exports.notifyGetExpectedAppointments = function(company_id, data) {
  io.emit(NOTIFY_GET_EXPECTED_APPOINTMENTS, data);
};
/*
 * Set up a custom namespace.
 *
 * On the client side get the socket as follows to robobetty:
 *   var socket = io('/visitorList');
 */
 var nsp = io.of('/visitorList');

// To be used with authorization.
// io.set('authorization', socketioJwt.authorize({
//   secret: jwtSecret,
//   handshake: true
// }));
