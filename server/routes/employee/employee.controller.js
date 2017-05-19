'use strict';

/*
 * This module is meant to house all of the API
 * routes that pertain to users
 */
var exports = module.exports;

var Employee = require('../../models/Employee');

/**
 *  @api {post} /api/employees/login
 *  @apiName PostLogin
 *  @apiGroup Employees
 *  
 *  @apiDescription Login into an employee account
 *
 *  @apiParam {String} email email to login with
 *  @apiParam {String} password password for the associated email
 *
 *  @apiSuccess {String} _id unique id of entry
 *  @apiSuccess {String} email email that the user logged in with
 *  @apiSuccess {String} phone_number phone number of the employee
 *  @apiSuccess {String} role the role of the account under the user
 *
 *  @apiError error Incorrect Credentials
 *  @apiError error Can not Find
 *
 *  @apiErrorExample Response (success):
 *      {
 *          _id : "12314125"
 *          email : "test@yahoo.com",
 *          phone_number : "0123456789",
 *          role: "a_admin"
 *      }
 *
 *  @apiErrorExample Response (error):
 *      {
 *          error: "Incorrect Credentials"
 *      }
 */


exports.login = function(req, res) {
    Employee.findOne({email:req.body.email}, function(err, e) {
        if(err || !e){
          return res.status(400).send({error: "Can not Find"});
        }
        if(!e.validPassword(req.body.password))
          return res.status(400).send({error: "Incorrect Credentials"});
        var employee_json=e.toJSON();
        delete employee_json.password;
        return res.status(200).json(employee_json);
    });
};

/**
 *  @api {get} /api/employees/company/:id
 *  @apiName GetAllEmployees
 *  @apiGroup Employees
 *  
 *  @apiDescription Get data pertaining to all employee based on a provided company id
 *
 *  @apiParam {String} id unique id of the company
 *  @apiParam {String} email company email to login with
 *  @apiParam {String} password password for the associated email
 *
 *  @apiSuccess {String} _id unique id of entry
 *  @apiSuccess {String} email email that the user logged in with
 *  @apiSuccess {String} phone_number phone number of the employee
 *  @apiSuccess {String} role the role of the account under the user
 *  @apiSuccess {String} company_id unique id of the company they belong to
 *
 *  @apiError error Can not Find
 *
 *  @apiErrorExample Response (success):
 *      {
 *        {
 *            _id : "12314125"
 *            email : "test@yahoo.com",
 *            phone_number : "0123456789",
 *            role: "a_admin",
 *            company_id: "1234125"
 *        }
 *        { 
 *            _id : "12314125"
 *            email : "test@yahoo.com",
 *            phone_number : "0123456789",
 *            role: "a_admin",
 *            company_id: "1234125"
 *        }
 *      }
 *
 *  @apiErrorExample Response (error):
 *      {
 *          error: "Can not Find"
 *      }
 */

exports.getAllEmployees = function(req, res) {
  Employee.find({company_id : req.params.id}, { password: 0}, function(err, result) {
    if(err){
      return res.status(400).send({error: "Can not Find"});
    }
    return res.status(200).json(result);
  });
};


/**
 *  @api {get} /api/employees/:id
 *  @apiName GetEmployees
 *  @apiGroup Employees
 *  
 *  @apiDescription Get data pertaining to an employee based on their id
 *
 *  @apiParam {String} id unique id of the employee
 *
 *  @apiSuccess {String} _id unique id of entry
 *  @apiSuccess {String} email email that the user logged in with
 *  @apiSuccess {String} phone_number phone number of the employee
 *  @apiSuccess {String} role the role of the account under the user
 *  @apiSuccess {String} company_id unique id of the company they belong to
 *
 *  @apiError error Can not Find
 *
 *  @apiErrorExample Response (success):
 *      {
 *          _id : "12314125"
 *          email : "test@yahoo.com",
 *          phone_number : "0123456789",
 *          role: "a_admin",
 *          company_id: "1234125"
 *      }
 *
 *  @apiErrorExample Response (error):
 *      {
 *          error: "Can not Find"
 *      }
 */

exports.getById = function(req, res) {
   Employee.findById(req.params.id, { password: 0}, function(err, employee) {
      if(err) {
          return res.status(400).json({error: "Can not Find"});
      } else {
          console.log(employee)
          return res.status(200).json(employee);
      }
    });
};

/**
 *  @api {post} /api/employees
 *  @apiName PostEmployees
 *  @apiGroup Employees
 *  
 *  @apiDescription Create a new employee and insert into the system
 *
 *  @apiParam {String} first_name employee email to signup with
 *  @apiParam {String} last_name employee email to signup with
 *  @apiParam {String} email employee email to signup with
 *  @apiParam {String} password password for the associated email
 *  @apiParam {String} phone_number phone number of the employee
 *  @apiParam {String} role role of the employee under this account
 *  @apiParam {String} company_id unique id of the company they belong to
 *
 *  @apiSuccess {String} _id unique id of entry
 *  @apiSuccess {String} email email that the user logged in with
 *  @apiSuccess {String} phone_number phone number of the employee
 *  @apiSuccess {String} role the role of the account under the user
 *
 *  @apiError error Can not Save
 *
 *  @apiErrorExample Role:
 *      c_admin: company admin   
 *      c_receptionist: company receptionist   
 *      c_employee: company employee
 *      a_admin: app administrator
 *
 *  @apiErrorExample Response (success):
 *      {
 *          _id : "12314125"
 *          email : "test@yahoo.com",
 *          phone_number : "0123456789",
 *          role: "a_admin",
 *      }
 *
 *  @apiErrorExample Response (error):
 *      {
 *          error: "Can not Save"
 *      }
 */

exports.insert = function(req, res) {
    var employee = new Employee();

    /* required info */
    employee.first_name = req.body.first_name;
    employee.last_name = req.body.last_name;
    employee.email = req.body.email,
    employee.phone_number  = req.body.phone_number,
    employee.company_id = req.body.company_id,
    employee.password = employee.generateHash(req.body.password),
    employee.role =  req.body.role

    employee.save(function(err, e) {
        if(err) {
            return res.status(400).json({error: "Can not Save"});
        }
        var employee_json=e.toJSON();
        delete employee_json.password;
        return res.status(200).json(employee_json);
    });
};

/**
 *  @api {put} /api/employees
 *  @apiName PutEmployees
 *  @apiGroup Employees
 *  
 *  @apiDescription Update an employees record
 *
 *  @apiParam {String} [first_name] employee email to signup with
 *  @apiParam {String} [last_name] employee email to signup with
 *  @apiParam {String} [email employee] email to signup with
 *  @apiParam {String} [password] password for the associated email
 *  @apiParam {String} [phone_number] phone number of the employee
 *  @apiParam {String} [role] role of the employee under this account
 *
 *  @apiSuccess {String} _id unique id of entry
 *  @apiSuccess {String} email email that the user logged in with
 *  @apiSuccess {String} phone_number phone number of the employee
 *  @apiSuccess {String} role the role of the account under the user
 *  @apiSuccess {String} company_id unique id of the company they belong to
 *
 *  @apiError error Can not Save
 *
 *  @apiErrorExample Response (success):
 *      {
 *          _id : "12314125"
 *          email : "test@yahoo.com",
 *          phone_number : "0123456789",
 *          role: "a_admin",
 *          company_id: "1234125"
 *      }
 *
 *  @apiErrorExample Response (error):
 *      {
 *          error: "Can not Save"
 *      }
 */

exports.update = function(req, res) {
    Employee.findById(req.params.id, function (err, employee) {
        if(err)
            return res.status(400).json({error: "Can not Update"});
 
        employee.first_name = req.body.first_name || employee.first_name;
        employee.last_name = req.body.last_name || employee.last_name;
        employee.email = req.body.email || employee.email;
        employee.phone_number = req.body.phone_number || employee.phone_number;
        employee.password = employee.generateHash(req.body.password) || employee.password;
        employee.role = req.body.role || employee.role;

        employee.save(function(err) {
            console.log(err);
            console.log(employee);
            if(err)
                return res.status(400).json({error: "Can not Save"});
            var employee_json=employee.toJSON();
            delete employee_json.password;
            return res.status(200).send(employee_json);
        });
   });
};

/**
 *  @api {delete} /api/employees
 *  @apiName DeleteEmployees
 *  @apiGroup Employees
 *  
 *  @apiDescription Delete an employee from the record
 *
 *  @apiSuccess {String} _id unique id of entry
 *  @apiSuccess {String} email email that the user logged in with
 *  @apiSuccess {String} phone_number phone number of the employee
 *  @apiSuccess {String} role the role of the account under the user
 *  @apiSuccess {String} company_id unique id of the company they belong to
 *
 *  @apiError error Can not Find
 *
 *  @apiErrorExample Response (success):
 *      {
 *          _id : "12314125"
 *          email : "test@yahoo.com",
 *          phone_number : "0123456789",
 *          role: "a_admin",
 *          company_id: "1234125"
 *      }
 *
 *  @apiErrorExample Response (error):
 *      {
 *          error: "Can not Find"
 *      }
 */

exports.delete = function(req, res) {
  Employee.findById(req.params.id, function(err, employee) {
    return employee.remove(function(err) {
      if(err) {
        res.status(400).json({error: "Can not Find"});
      } else {
          var employee_json=employee.toJSON();
          delete employee_json.password;
          return res.status(200).send(employee_json);
      }
    });
  });
};
