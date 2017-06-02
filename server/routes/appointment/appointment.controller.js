'use strict';


/*This module is meant to house the functions
 * used by the authorization (auth) API. The
 * actual API is set up in index.js

 Functions:
 authSignup()
 authLogin()
 authResetCredentials()
 */


/* need this to enable cross origin resource sharing.If disabled, we might
 * not need this later. This is just to get the example to work
 * when front end is served from a something other than our app server.
 */
var Appointment = require('../../models/Appointment');
var config = require('../../config/config.js');

/****** Company TEMPLATE ROUTES ******/
module.exports.template = {};

/**
 *  @api {post} /api/appointments
 *  @apiName PostAppointment
 *  @apiGroup Appointment
 *
 *  @apiDescription Create new company for the website with provided mandatory information
 *
 *  @apiParam {String} first_name first name of visitor
 *  @apiParam {String} last_name last name of visitor
 *  @apiParam {String} phone_number phone number of visitor
 *  @apiParam {String} date date of appointment
 *  @apiParam {String} company_id id of company
 *  @apiParam {String} provider_name provider who the appoinment is with
 *
 *  @apiSuccess {String} _id unique id of entry
 *  @apiSuccess {String} first_name first name of visitor
 *  @apiSuccess {String} last_name last name of visitor
 *  @apiSuccess {String} phone_number phone number of visitor
 *  @apiSuccess {String} date date of appointment
 *    @apiSuccess {String} company_id id of company
 *    @apiSuccess {String} provider_name provider who the appoinment is with
 *
 *  @apiError error Already Created
 *
 *  @apiErrorExample Response (success):
 *      {
 *  		_id : "12314125",
 *  		first_name : "test",
 *  		last_name : "test",
 *   		phone_number : "0123456789",
 *   		date : "2016-04-23T18:25:43.511Z",
 *   		company_id : "12314125",
 *   		provider_name : "test test"
 *		}
 *
 *  @apiErrorExample Response (error):
 *      {
 *          error: "Already Created"
 *      }
 */

module.exports.template.create = function(req, res) {
  var appointment = new Appointment();
  var param = req.body;

  //require provided info
  appointment.first_name = param.first_name;
  appointment.last_name = param.last_name;
  appointment.phone_number = param.phone_number;
  appointment.date = param.date;
  appointment.company_id = param.company_id;
  appointment.provider_name = param.provider_name;

  var sendSms = function(to, message) {
    var client = require('twilio')(config.twilio_accountSid, config.twilio_authToken);
    client.messages.create({ 
      to: to, 
      from: config.twilio_sendingNumber, 
      body: message
    }, function(err, message) { 
      console.log(message.sid); 
    });
  };

  Appointment.find(
    {
      company_id: param.company_id,
      date: param.date
    }, function(err, appointments) {
      if (err) return res.status(400).json({error: "Could Not Find"});
      if (appointments.length === 0) {
        appointment.save(function(err, a) {
          if (err)
            return res.status(400).json({error: "Could Not Save"});
          return res.status(200).json(a);
        });
      } else {
        return res.status(400).json({error: "Already Created"});
      }
    });
  sendSms(appointment.phone_number, "This is a confirmation message to inform you that you have made an appointment with " + appointment.provider_name + " on " + appointment.date.toString() + ".");
};

/**
 *  @api {get} /api/appointments/admin/:id
 *  @apiName GetAllAppointment
 *  @apiGroup Appointment
 *
 *  @apiDescription Retrieve all appointments for a company
 *
 *  @apiParam {String} company_id id of company
 *
 *  @apiSuccess {String} _id unique id of entry
 *  @apiSuccess {String} first_name first name of visitor
 *  @apiSuccess {String} last_name last name of visitor
 *  @apiSuccess {String} phone_number phone number of visitor
 *  @apiSuccess {String} date date of appointment
 *    @apiSuccess {String} company_id id of company
 *    @apiSuccess {String} provider_name provider who the appoinment is with
 *
 *  @apiError error Incorrect credentials
 *
 *  @apiErrorExample Response (success):
 *      {
 *			{
 *				_id : "12314125",
 *				first_name : "test",
 *				last_name : "test",
 *				phone_number : "0123456789",
 *				date : "2016-04-23T18:25:43.511Z",
 *				company_id : "12314125",
 *				provider_name : "test test"
 *			},
 *			{
 *				_id : "1231af3424fae",
 *				first_name : "test",
 *				last_name : "test",
 *				phone_number : "0123456789",
 *				date : "2016-05-23T18:25:43.511Z",
 *				company_id : "12314125",
 *				provider_name : "test test"
 *			}
 *		}
 *
 *  @apiErrorExample Response (error):
 *      {
 *          error: "Incorrect credentials"
 *      }
 */

module.exports.template.getAll = function(req, res) {
  Appointment.find({company_id: req.params.id}, function(err, result) {
    if (err) {
      return res.status(400).json(err);
    }
    return res.status(200).json(result);
  });
};

/**
 *  @api {get} /api/appointments/:id
 *  @apiName GetAppointment
 *  @apiGroup Appointment
 *
 *  @apiDescription Retrieve information about an appointment
 *
 *  @apiParam {String} id id of the appointment to search for
 *
 *  @apiSuccess {String} _id unique id of entry
 *  @apiSuccess {String} first_name first name of visitor
 *  @apiSuccess {String} last_name last name of visitor
 *  @apiSuccess {String} phone_number phone number of visitor
 *  @apiSuccess {String} date date of appointment
 *    @apiSuccess {String} company_id id of company
 *    @apiSuccess {String} provider_name provider who the appoinment is with
 *
 *  @apiError error Can't Find
 *
 *  @apiErrorExample Response (success):
 *      {
 *  		_id : "12314125",
 *  		first_name : "test",
 *  		last_name : "test",
 *   		phone_number : "0123456789",
 *   		date : "2016-04-23T18:25:43.511Z",
 *   		company_id : "12314125",
 *   		provider_name : "test test"
 *		}
 *
 *  @apiErrorExample Response (error):
 *      {
 *          error: "Can't Find"
 *      }
 */

module.exports.template.get = function(req, res) {
  Appointment.findOne({_id: req.params.id}, function(err, a) {
    if (err || !a)
      return res.status(400).send({error: "Could Not Find"});
    return res.status(200).json(a);
  });
};

/**
 *  @api {put} /api/appointments/:id
 *  @apiName PutAppointment
 *  @apiGroup Appointment
 *
 *  @apiDescription Update a appointment's information
 *
 *  @apiParam {String} id id of the appointment to update
 *  @apiParam {String} [name] name of the visitor
 *  @apiParam {String} [phone_number] phone number of visitor
 *  @apiParam {String} [date] date of appointment
 *
 *  @apiSuccess {String} _id unique id of entry
 *  @apiSuccess {String} first_name first name of visitor
 *  @apiSuccess {String} last_name last name of visitor
 *  @apiSuccess {String} phone_number phone number of visitor
 *  @apiSuccess {String} date date of appointment
 *    @apiSuccess {String} company_id id of company
 *    @apiSuccess {String} provider_name provider who the appoinment is with
 *
 *  @apiError error Already Created
 *
 *  @apiErrorExample Response (success):
 *      {
 *  		_id : "12314125",
 *  		first_name : "test",
 *  		last_name : "test",
 *   		phone_number : "0123456789",
 *   		date : "2016-04-23T18:25:43.511Z",
 *   		company_id : "12314125",
 *   		provider_name : "test test"
 *		}
 *
 *  @apiErrorExample Response (error):
 *      {
 *          error: "Already Created"
 *      }
 */

module.exports.template.update = function(req, res) {
  Appointment.findOne({_id: req.params.id}, function(err, a) {
    if (err || !a)
      return res.status(401).json({error: "Could Not Find"});

    if (req.body.first_name !== undefined)
      a.first_name = req.body.first_name;

    if (req.body.last_name !== undefined)
      a.last_name = req.body.last_name;

    if (req.body.phone_number !== undefined)
      a.phone_number = req.body.phone_number;

    if (req.body.date !== undefined)
      a.date = req.body.date;
    if (req.body.provider_name !== undefined)
      a.provider_name = req.body.provider_name;
    //TODO check if the date is taken already
    a.save(function(err) {
      if (err) {
        return res.status(400).json({error: "Could Not Save"});
      }
      return res.status(200).json(a);
    });
  });
};

/**
 *  @api {delete} /api/appointments/:id
 *  @apiName DeleteAppointment
 *  @apiGroup Appointment
 *
 *  @apiDescription Delete an appointment
 *
 *  @apiParam {String} id id of the appointment to delete
 *
 *  @apiSuccess {String} _id unique id of entry
 *  @apiSuccess {String} first_name first name of visitor
 *  @apiSuccess {String} last_name last name of visitor
 *  @apiSuccess {String} phone_number phone number of visitor
 *  @apiSuccess {String} old_date old date of appointment
 *  @apiSuccess {String} new_date new date of appointment
 *    @apiSuccess {String} company_id id of company
 *    @apiSuccess {String} provider_name provider who the appoinment is with
 *
 *  @apiError error Could Not Find
 *
 *  @apiErrorExample Response (success):
 *     {
 *			_id : "12314125",
 *			first_name : "test",
 *			last_name : "test",
 *			phone_number : "0123456789",
 *			old_date : "2016-04-23T18:25:43.511Z",
 *			new_date : "2016-04-23T18:25:43.511Z",
 *			company_id : "12314125",
 *			provider_name : "test test"
 *		}
 *
 *  @apiErrorExample Response (error):
 *      {
 *          error: "Could Not Find"
 *      }
 */

module.exports.template.delete = function(req, res) {
  Appointment.findById(req.params.id, function(err, a) {
    if (err)
      res.status(400).json({error: "Could Not Find"});
    a.remove(function(err) {
      if (err) {
        res.status(400).json({error: "Could Not Save"});
      } else {
        return res.status(200).json(a);
      }
    });
  });
};