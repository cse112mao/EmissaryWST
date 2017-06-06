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

var Company = require('../models/Company');
/********** Socket IO Module **********/
exports.createServer = function(io_in) {
  io = io_in;

  /*
   * This handles the 'connection' event, which is send when the user is
   * trying to connect a socket.
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

    //requires the company_id to be sent
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

    //requires the company_id and visitor_id to be sent
    socket.on(REMOVE_VISITOR, function(data) {
      console.log(data.company_id);
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

    //require the params to be set with info of the visitor
    socket.on(ADD_VISITOR, function(data) {
      console.log("ADDING VISITOR");
      console.log(data);
      console.log(data.company_id);
      var company_id = data.company_id;
      VisitorListCtr.create(data, function(err_msg, result) {
        if (err_msg) {
          console.log("error");
          exports.notifyError(company_id, {error: err_msg});
        }
        else {
          exports.notifyNewList(company_id, result);
        }
      });
    });


    //get list of user within 24 hours
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


//get list of oppointment within 24 hours
    //get list of user within 24 hours
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

        /* result.visitors.sort(function(a,b){
         return (a.first_name + a.last_name) > (b.first_name + b.last_name) ? 1 : -1;
         });*/

        for (var i = 0; i < result.visitors.length; i++) {

          var visitorObj = result.visitors[i];
          var checkin_time = new Date(visitorObj.checkin_time);
          for (var j = 0; j < visitorObj.appointments.length; j++) {
            var appointmentObj = visitorObj.appointments[j];
            var appointmentDate = new Date(appointmentObj.date);
            if (currentDateEnd.valueOf() - appointmentDate.valueOf() >= 0 && (currentDateEnd.valueOf() - appointmentDate.valueOf()) / 1000 < 604800) {
              if (checkin_time.valueOf() - appointmentDate.valueOf() > 0) {
                lateUsers++;
              }
              totalUsers++;
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


    //get list of oppointment within 24 hours
    //get list of user within 24 hours
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
/*
 * A function that allows you to notify all clients that
 * the queue has been updated.
 *
 * The client side needs to be listening for the 'queue_updated' event. When
 * this event is triggered, the client side can retrieve the whole queue of
 * patients to reflect the changes.
 */
exports.notifyNewList = function(company_id, data) {
  io.to(company_id).emit(VISITOR_LIST_UPDATE, data);
};

exports.notifyError = function(company_id, data) {
  io.to(company_id).emit(NOTIFY_ERROR, data);
};
exports.notifyRecentVisitors = function(company_id, data) {
  io.emit(NOTIFY_RECENT_VISITORS_LIST, data);
};
exports.notifyRecentAppointments = function(company_id, data) {
  io.emit(NOTIFY_RECENT_APPOINTMENTS_LIST, data);
};
exports.notifyLateAppointment = function(company_id, data) {
  io.emit(NOTIFY_LATE_APPOINTMENTS, data);
};
exports.notifyPercentLate = function(company_id, data) {
  io.emit(NOTIFY_GET_PERCENT_LATE_VISITORS, data);
};

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