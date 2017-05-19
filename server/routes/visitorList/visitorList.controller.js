'use strict';

//Import Resources and Libs

var Email = require('../../notification/email');
var TextModel = require('../../notification/text');

var VisitorList = require('../../models/VisitorList');
var Employee = require('../../models/Employee');
var Appointment = require('../../models/Appointment');

/**
 *  @api {get} /api/visitorLists/company/:id
 *  @apiName GetVisitorList
 *  @apiGroup VisitorList
 *  
 *  @apiDescription Gives visitor's appointment of that current day in appointments
 *
 *  @apiParam {String} id id of the company to search for
 *
 *  @apiSuccess {String} _id unique id of entry
 *  @apiSuccess {String} company_id id of company
 *  @apiSuccess {Object} a list of all visitors and their information
 *
 *  @apiError error Getting Visitor List
 *
 *  @apiErrorExample Response (success):
 *      {
 *            _id: "123124124",
 *           company_id: "12312355",
 *           visitors:
 *           [
 *               {
 *                   _id: "12314125",
 *                   company_id: "12314125",
 *                   first_name : "test",
 *                   last_name : "test",
 *                   phone_number: "21324125",
 *                   checkin_time: "2016-04-23T18:25:43.511Z",
 *                   appointments:
 *                   [
 *                       {
 *                       _id : "12314125",
 *                       name : "test1",
 *                       phone_number : "0123456789",
 *                       date : "2016-04-23T18:25:43.511Z",
 *                       company_id : "12314125",
 *                       provider_name : "test test"
 *                       }
 *                   ]
 *                   additional_info:
 *                       {
 *                       allergies: "peanuts",
 *                       sex: "male"
 *                       }
 *               },
 *               {
 *                   _id: "12314125",
 *                   company_id: "12314125",
 *                   first_name : "test",
 *                   last_name : "test",
 *                   phone_number: "21324125",
 *                   checkin_time: "2016-04-23T18:25:43.511Z",
 *                   appointments:
 *                   [
 *                       {
 *                          _id : "12314125",
 *                          name : "test1",
 *                          phone_number : "0123456789",
 *                          date : "2016-04-23T18:25:43.511Z",
 *                          company_id : "12314125",
 *                          provider_name : "test test"
 *                       }
 *                   ]
 *                   additional_info:
 *                       {
 *                          allergies: "peanuts",
 *                          sex: "male"
 *                       }
 *           ]
 *       }
 *
 *  @apiErrorExample Response (error):
 *      {
 *          error: "Getting Visitor List"
 *      }
 */

/* handles route for getting the Company's visitor list */
exports.getCompanyVisitorListReq = function(req, res){
    var company_id=req.params.id;
    exports.getCompanyVisitorList(company_id, function(err_msg, result){
        if(err_msg) return res.status(400).json(err_msg);
        if(result == null){
            result = new VisitorList();
            result.visitors = [];
            result.company_id=companyId;
            result.save(function(err){
                return res.status(200).json(result);
            });
        }else {
            return res.status(200).json(result);
        }
    });
}


/* logic for getting the Company's visitor list */
exports.getCompanyVisitorList = function(company_id, callback){
    if(!company_id)
        return callback({error: "Please send company id."}, null);
    VisitorList.findOne({company_id: company_id}, function(err, list){
        if(err) return callback({error: "Getting Visitor List"}, null);
        if(list==null) {
            list = new VisitorList();
            list.visitors=[];
            list.company_id = company_id;
        }
        list.save(function(err){
            if(err)return callback({error: "Error in saving"}, null);
            return callback(null, list);
        });
    });
}


/**
 *  @api {delete} /api/visitorLists/company/:company_id/visitor/:visitor_id
 *  @apiName DeleteVisitor
 *  @apiGroup VisitorList
 *  
 *  @apiDescription Delete visitor from company list
 *
 *
 *  @apiSuccess {String} _id unique id of entry
 *  @apiSuccess {String} company_id id of company
 *  @apiSuccess {Object} visitor's information
 *
 *  @apiError error Getting Visitor List
 *
 *  @apiErrorExample Response (success):
 *      {
 *            _id: "123124124",
 *           company_id: "12312355",
 *           visitors:
 *           [
 *               {
 *                   _id: "12314125",
 *                   company_id: "12314125",
 *                   first_name : "test",
 *                   last_name : "test",
 *                   phone_number: "21324125",
 *                   checkin_time: "2016-04-23T18:25:43.511Z",
 *                   appointments:
 *                   [
 *                       {
 *                       _id : "12314125",
 *                       name : "test1",
 *                       phone_number : "0123456789",
 *                       date : "2016-04-23T18:25:43.511Z",
 *                       company_id : "12314125",
 *                       provider_name : "test test"
 *                       }
 *                   ]
 *                   additional_info:
 *                       {
 *                       allergies: "peanuts",
 *                       sex: "male"
 *                       }
 *               }
 *          ] 
 *      }   
 *
 *  @apiErrorExample Response (error):
 *      {
 *          error: "Getting Visitor List"
 *      }
 */

/* handles route to delete visitor in the list*/
exports.deleteVisitorReq = function(req, res){
    var visitor_id=req.params.visitor_id;
    var company_id=req.params.company_id;
    exports.deleteVisitor(company_id, visitor_id, function(err_msg, result){
        if(err_msg)  return res.status(400).json(err_msg);
        return res.status(200).json(result);
    });
}

/* logic for deleting the visitor in the list */
exports.deleteVisitor = function(company_id, visitor_id, callback){
    if(!company_id)
        return callback({error: "Please send company id."}, null);
    if(!visitor_id)
        return callback({error: "Please send visitorList id."}, null);
    VisitorList.findOneAndUpdate(
        {company_id: company_id},
        {$pull: {visitors:{_id:visitor_id}}},
        {safe: true, upsert: true, new:true}, function(err, data){
            if(err) return callback({error: "Can't update list"}, null);
            return callback(null, data);
        });
}

/**
 *  @api {delete} /api/visitorLists/:id
 *  @apiName ClearVisitorList
 *  @apiGroup VisitorList
 *  
 *  @apiDescription Clear visitor list
 *
 *
 *  @apiSuccess {String} _id unique id of entry
 *  @apiSuccess {String} _id unique id of entry
 *
 *
 *  @apiError error Could Not Find 
 *
 *  @apiErrorExample Response (success):
 *        {
 *           _id: "123124124",
 *           company_id: "12312355",
 *           visitors: []
 *        }
 *
 *  @apiErrorExample Response (error):
 *      {
 *          error: "Could Not Find"
 *      }
 */

/* clear the list */
exports.deleteReq = function(req, res){
    var list_id=req.params.id;
    exports.delete(list_id, function(err_msg, result){
        if(err_msg)  return res.status(400).json(err_msg);
        return res.status(200).json(result);
    });
}

exports.delete = function(list_id, callback){
    if(!list_id)
        return callback({error: "Please send list id."}, null);
    VisitorList.findOne({_id: list_id}, function(err, list){
        if(err || list==null) return callback({error: "Can't find company"}, null);
        list.visitors=[];
        list.save(function(err){
            if(err) return callback({error: "Can't save"}, null);
            return callback(null, list);
        });
    });
}

/**
 *  @api {post} /api/visitorLists
 *  @apiName PostVisitorList
 *  @apiGroup VisitorList
 *  
 *  @apiDescription Add a visitor to the list, gives the visitor current day's appointments
 *
 *  @apiParam {String} company_id id of the company
 *  @apiParam {String} first_name first name of visitor
 *  @apiParam {String} last_name last name of visitor
 *  @apiParam {String} phone_number phone number of visitor
 *  @apiParam {String} checkin_time time visitor checked in
 *  @apiParam {String} [additional_info] additional information of visitor
 *
 *  @apiSuccess {String} _id unique id of entry
 *  @apiSuccess {String} company_id id of company
 *  @apiSuccess {Object} a list of all visitors and their information
 *
 *  @apiError error Getting Visitor List
 *
 *  @apiErrorExample Response (success):
*      {
 *            _id: "123124124",
 *           company_id: "12312355",
 *           visitors:
 *           [
 *               {
 *                   _id: "12314125",
 *                   company_id: "12314125",
 *                   first_name : "test",
 *                   last_name : "test",
 *                   phone_number: "21324125",
 *                   checkin_time: "2016-04-23T18:25:43.511Z",
 *                   appointments:
 *                   [
 *                       {
 *                       _id : "12314125",
 *                       name : "test1",
 *                       phone_number : "0123456789",
 *                       date : "2016-04-23T18:25:43.511Z",
 *                       company_id : "12314125",
 *                       provider_name : "test test"
 *                       }
 *                   ]
 *                   additional_info:
 *                       {
 *                       allergies: "peanuts",
 *                       sex: "male"
 *                       }
 *               },
 *               {
 *                   _id: "12314125",
 *                   company_id: "12314125",
 *                   first_name : "test",
 *                   last_name : "test",
 *                   phone_number: "21324125",
 *                   checkin_time: "2016-04-23T18:25:43.511Z",
 *                   appointments:
 *                   [
 *                       {
 *                          _id : "12314125",
 *                          name : "test1",
 *                          phone_number : "0123456789",
 *                          date : "2016-04-23T18:25:43.511Z",
 *                          company_id : "12314125",
 *                          provider_name : "test test"
 *                       }
 *                   ]
 *                   additional_info:
 *                       {
 *                          allergies: "peanuts",
 *                          sex: "male"
 *                       }
 *           ]
 *       }
 *
 *  @apiErrorExample Response (error):
 *      {
 *          error: "Getting Visitor List"
 *      }
 */

// This route will be called when a visitor checks in
exports.createReq = function(req, res) {
    exports.create(req.body, function(err_msg, result){
        if(err_msg)  return res.status(400).json(err_msg);
        return res.status(200).json(result);
    });
}

exports.create = function(param, callback){
    //required fields
    var company_id = param.company_id;
    var first_name = param.first_name;
    var last_name = param.last_name;
    var phone_number = param.phone_number;
    var checkin_time = param.checkin_time;

    //optional dic var
    var additional_info = param.additional_info;

    // find all the appointments for this visitor
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var tomorrow= new Date();
    tomorrow.setDate(today.getDate()+1);
    tomorrow.setHours(0, 0, 0, 0);

    var query=
    {
        company_id: company_id,
        first_name: first_name,
        last_name: last_name,
        phone_number: phone_number,
        date: {$gte:today, $lt: tomorrow}
    };

    Appointment.find(query, function(err, appointments){
        var visitor =
        {
            company_id: company_id,
            last_name: last_name,
            first_name: first_name,
            phone_number: phone_number,
            checkin_time: checkin_time,
            additional_info: additional_info,
            appointments: appointments
        };
        VisitorList.findOne(
            {company_id: company_id},
            function(err, list) {
                if(err)
                    return callback({error: "an error occured while finding"}, null);
                if(list==null) {
                    list = new VisitorList();
                    list.visitors=[];
                    list.company_id = company_id;
                }
                list.visitors.push(visitor);
                list.save(function(err){
                    if(err) return callback({error: "an error in saving"}, null);
                    return callback(null, list);
                    /*Employee.find({company : req.body.company_id},
                     function(err, employees) {
                     var i = 0;
                     var respond = function() {
                     i++;
                     if(i == employees.length) {
                     res.status(200).json(list);
                     }
                     };

                     Email.sendEmail(req.body.name, employees, function(){respond();});
                     TextModel.sendText(req.body.name, employees, function(){respond();});
                     }
                     );*/
                });
            }
        );
    });
}

