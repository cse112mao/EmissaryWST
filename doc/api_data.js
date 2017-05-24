define({
  "api": [
    {
      "type": "delete",
      "url": "/api/companies:id",
      "title": "",
      "name": "DeleteCompany",
      "group": "Company",
      "description": "<p>Delete a company's information</p>",
      "parameter": {
        "fields": {
          "Parameter": [
            {
              "group": "Parameter",
              "type": "String",
              "optional": false,
              "field": "id",
              "description": "<p>id of the company to delete</p>"
            }
          ]
        }
      },
      "success": {
        "fields": {
          "Success 200": [
            {
              "group": "Success 200",
              "type": "String",
              "optional": false,
              "field": "_id",
              "description": "<p>unique id of entry</p>"
            },
            {
              "group": "Success 200",
              "type": "String",
              "optional": false,
              "field": "name",
              "description": "<p>name of the company</p>"
            },
            {
              "group": "Success 200",
              "type": "String",
              "optional": false,
              "field": "email",
              "description": "<p>email of the company</p>"
            },
            {
              "group": "Success 200",
              "type": "String",
              "optional": false,
              "field": "phone_number",
              "description": "<p>phone number of the company</p>"
            },
            {
              "group": "Success 200",
              "type": "String",
              "optional": false,
              "field": "paid_time",
              "description": "<p>when the payment was made</p>"
            }
          ]
        }
      },
      "error": {
        "fields": {
          "Error 4xx": [
            {
              "group": "Error 4xx",
              "optional": false,
              "field": "error",
              "description": "<p>Could Not Find</p>"
            }
          ]
        },
        "examples": [
          {
            "title": "Response (success):",
            "content": "{\n    _id : \"12314125\"\n    name : \"test\",\n    email : \"test@yahoo.com\",\n    phone_number : \"0123456789\",\n    paid_time: \"2016-04-23T18:25:43.511Z\",\n}",
            "type": "json"
          },
          {
            "title": "Response (error):",
            "content": "{\n    error: \"Could Not Find\"\n}",
            "type": "json"
          }
        ]
      },
      "version": "0.0.0",
      "filename": "server/routes/company/company.controller.js",
      "groupTitle": "Company"
    },
    {
      "type": "get",
      "url": "/api/companies",
      "title": "",
      "name": "GetAllCompany",
      "group": "Company",
      "description": "<p>Retrieve information for all companies</p>",
      "success": {
        "fields": {
          "Success 200": [
            {
              "group": "Success 200",
              "type": "String",
              "optional": false,
              "field": "_id",
              "description": "<p>unique id of entry</p>"
            },
            {
              "group": "Success 200",
              "type": "String",
              "optional": false,
              "field": "name",
              "description": "<p>name of the company</p>"
            },
            {
              "group": "Success 200",
              "type": "String",
              "optional": false,
              "field": "email",
              "description": "<p>email of the company</p>"
            },
            {
              "group": "Success 200",
              "type": "String",
              "optional": false,
              "field": "phone_number",
              "description": "<p>phone number of the company</p>"
            },
            {
              "group": "Success 200",
              "type": "String",
              "optional": false,
              "field": "paid_time",
              "description": "<p>when the payment was made</p>"
            }
          ]
        }
      },
      "error": {
        "fields": {
          "Error 4xx": [
            {
              "group": "Error 4xx",
              "optional": false,
              "field": "error",
              "description": "<p>Incorrect credentials</p>"
            }
          ]
        },
        "examples": [
          {
            "title": "Response (success):",
            "content": "{\n    {\n        _id : \"12314125\"\n        name : \"test\",\n        email : \"test@yahoo.com\",\n        phone_number : \"0123456789\",\n        paid_time: \"2016-04-23T18:25:43.511Z\",\n    },\n    {\n        _id : \"12314125\"\n        name : \"test\",\n        email : \"test@yahoo.com\",\n        phone_number : \"0123456789\",\n        paid_time: \"2016-04-23T18:25:43.511Z\",\n    }\n}",
            "type": "json"
          },
          {
            "title": "Response (error):",
            "content": "{\n    error: \"Incorrect credentials\"\n}",
            "type": "json"
          }
        ]
      },
      "version": "0.0.0",
      "filename": "server/routes/company/company.controller.js",
      "groupTitle": "Company"
    },
    {
      "type": "get",
      "url": "/api/companies/:id",
      "title": "",
      "name": "GetCompany",
      "group": "Company",
      "description": "<p>Retrieve information about a company</p>",
      "parameter": {
        "fields": {
          "Parameter": [
            {
              "group": "Parameter",
              "type": "String",
              "optional": false,
              "field": "id",
              "description": "<p>id of the company to search for</p>"
            }
          ]
        }
      },
      "success": {
        "fields": {
          "Success 200": [
            {
              "group": "Success 200",
              "type": "String",
              "optional": false,
              "field": "_id",
              "description": "<p>unique id of entry</p>"
            },
            {
              "group": "Success 200",
              "type": "String",
              "optional": false,
              "field": "name",
              "description": "<p>name of the company</p>"
            },
            {
              "group": "Success 200",
              "type": "String",
              "optional": false,
              "field": "email",
              "description": "<p>email of the company</p>"
            },
            {
              "group": "Success 200",
              "type": "String",
              "optional": false,
              "field": "phone_number",
              "description": "<p>phone number of the company</p>"
            },
            {
              "group": "Success 200",
              "type": "String",
              "optional": false,
              "field": "paid_time",
              "description": "<p>when the payment was made</p>"
            }
          ]
        }
      },
      "error": {
        "fields": {
          "Error 4xx": [
            {
              "group": "Error 4xx",
              "optional": false,
              "field": "error",
              "description": "<p>Could Not Save</p>"
            }
          ]
        },
        "examples": [
          {
            "title": "Response (success):",
            "content": "{\n    _id : \"12314125\"\n    name : \"test\",\n    email : \"test@yahoo.com\",\n    phone_number : \"0123456789\",\n    paid_time: \"2016-04-23T18:25:43.511Z\",\n}",
            "type": "json"
          },
          {
            "title": "Response (error):",
            "content": "{\n    error: \"Could Not Save\"\n}",
            "type": "json"
          }
        ]
      },
      "version": "0.0.0",
      "filename": "server/routes/company/company.controller.js",
      "groupTitle": "Company"
    },
    {
      "type": "post",
      "url": "/api/companies",
      "title": "",
      "name": "PostCompany",
      "group": "Company",
      "description": "<p>Create new company for the website with provided mandatory information</p>",
      "parameter": {
        "fields": {
          "Parameter": [
            {
              "group": "Parameter",
              "type": "String",
              "optional": false,
              "field": "name",
              "description": "<p>name of the company</p>"
            },
            {
              "group": "Parameter",
              "type": "String",
              "optional": false,
              "field": "credit_card_number",
              "description": "<p>credit card to sign up the company with</p>"
            },
            {
              "group": "Parameter",
              "type": "String",
              "optional": false,
              "field": "expiration_date",
              "description": "<p>credit card's expiration date</p>"
            },
            {
              "group": "Parameter",
              "type": "String",
              "optional": false,
              "field": "email",
              "description": "<p>to sign up with</p>"
            },
            {
              "group": "Parameter",
              "type": "String",
              "optional": false,
              "field": "phone_number",
              "description": "<p>phone number to sign up with</p>"
            },
            {
              "group": "Parameter",
              "type": "String",
              "optional": false,
              "field": "paid_time",
              "description": "<p>when the payment was made</p>"
            }
          ]
        }
      },
      "success": {
        "fields": {
          "Success 200": [
            {
              "group": "Success 200",
              "type": "String",
              "optional": false,
              "field": "_id",
              "description": "<p>unique id of entry</p>"
            },
            {
              "group": "Success 200",
              "type": "String",
              "optional": false,
              "field": "name",
              "description": "<p>name of the company</p>"
            },
            {
              "group": "Success 200",
              "type": "String",
              "optional": false,
              "field": "email",
              "description": "<p>email of the company</p>"
            },
            {
              "group": "Success 200",
              "type": "String",
              "optional": false,
              "field": "phone_number",
              "description": "<p>phone number of the company</p>"
            },
            {
              "group": "Success 200",
              "type": "String",
              "optional": false,
              "field": "paid_time",
              "description": "<p>when the payment was made</p>"
            }
          ]
        }
      },
      "error": {
        "fields": {
          "Error 4xx": [
            {
              "group": "Error 4xx",
              "optional": false,
              "field": "error",
              "description": "<p>Could Not Save</p>"
            }
          ]
        },
        "examples": [
          {
            "title": "Response (success):",
            "content": "{\n    _id : \"12314125\"\n    name : \"test\",\n    email : \"test@yahoo.com\",\n    phone_number : \"0123456789\",\n    paid_time: \"2016-04-23T18:25:43.511Z\",\n}",
            "type": "json"
          },
          {
            "title": "Response (error):",
            "content": "{\n    error: \"Could Not Save\"\n}",
            "type": "json"
          }
        ]
      },
      "version": "0.0.0",
      "filename": "server/routes/company/company.controller.js",
      "groupTitle": "Company"
    },
    {
      "type": "put",
      "url": "/api/companies:id",
      "title": "",
      "name": "PutCompany",
      "group": "Company",
      "description": "<p>Update a company's information</p>",
      "parameter": {
        "fields": {
          "Parameter": [
            {
              "group": "Parameter",
              "type": "String",
              "optional": false,
              "field": "id",
              "description": "<p>id of the company to update</p>"
            },
            {
              "group": "Parameter",
              "type": "String",
              "optional": true,
              "field": "name",
              "description": "<p>name of the company</p>"
            },
            {
              "group": "Parameter",
              "type": "String",
              "optional": true,
              "field": "credit_card_number",
              "description": "<p>credit card to sign up the company with</p>"
            },
            {
              "group": "Parameter",
              "type": "String",
              "optional": true,
              "field": "expiration_date",
              "description": "<p>credit card's expiration date</p>"
            },
            {
              "group": "Parameter",
              "type": "String",
              "optional": true,
              "field": "email",
              "description": "<p>to sign up with</p>"
            },
            {
              "group": "Parameter",
              "type": "String",
              "optional": true,
              "field": "phone_number",
              "description": "<p>phone number to sign up with</p>"
            }
          ]
        }
      },
      "success": {
        "fields": {
          "Success 200": [
            {
              "group": "Success 200",
              "type": "String",
              "optional": false,
              "field": "_id",
              "description": "<p>unique id of entry</p>"
            },
            {
              "group": "Success 200",
              "type": "String",
              "optional": false,
              "field": "name",
              "description": "<p>name of the company</p>"
            },
            {
              "group": "Success 200",
              "type": "String",
              "optional": false,
              "field": "email",
              "description": "<p>email of the company</p>"
            },
            {
              "group": "Success 200",
              "type": "String",
              "optional": false,
              "field": "phone_number",
              "description": "<p>phone number of the company</p>"
            },
            {
              "group": "Success 200",
              "type": "String",
              "optional": false,
              "field": "paid_time",
              "description": "<p>when the payment was made</p>"
            }
          ]
        }
      },
      "error": {
        "fields": {
          "Error 4xx": [
            {
              "group": "Error 4xx",
              "optional": false,
              "field": "error",
              "description": "<p>Could Not Find</p>"
            }
          ]
        },
        "examples": [
          {
            "title": "Response (success):",
            "content": "{\n    _id : \"12314125\"\n    name : \"test\",\n    email : \"test@yahoo.com\",\n    phone_number : \"0123456789\",\n    paid_time: \"2016-04-23T18:25:43.511Z\",\n}",
            "type": "json"
          },
          {
            "title": "Response (error):",
            "content": "{\n    error: \"Could Not Find\"\n}",
            "type": "json"
          }
        ]
      },
      "version": "0.0.0",
      "filename": "server/routes/company/company.controller.js",
      "groupTitle": "Company"
    },
    {
      "type": "delete",
      "url": "/api/employees",
      "title": "",
      "name": "DeleteEmployees",
      "group": "Employees",
      "description": "<p>Delete an employee from the record</p>",
      "success": {
        "fields": {
          "Success 200": [
            {
              "group": "Success 200",
              "type": "String",
              "optional": false,
              "field": "_id",
              "description": "<p>unique id of entry</p>"
            },
            {
              "group": "Success 200",
              "type": "String",
              "optional": false,
              "field": "email",
              "description": "<p>email that the user logged in with</p>"
            },
            {
              "group": "Success 200",
              "type": "String",
              "optional": false,
              "field": "phone_number",
              "description": "<p>phone number of the employee</p>"
            },
            {
              "group": "Success 200",
              "type": "String",
              "optional": false,
              "field": "role",
              "description": "<p>the role of the account under the user</p>"
            },
            {
              "group": "Success 200",
              "type": "String",
              "optional": false,
              "field": "company_id",
              "description": "<p>unique id of the company they belong to</p>"
            }
          ]
        }
      },
      "error": {
        "fields": {
          "Error 4xx": [
            {
              "group": "Error 4xx",
              "optional": false,
              "field": "error",
              "description": "<p>Can not Find</p>"
            }
          ]
        },
        "examples": [
          {
            "title": "Response (success):",
            "content": "{\n    _id : \"12314125\"\n    email : \"test@yahoo.com\",\n    phone_number : \"0123456789\",\n    role: \"a_admin\",\n    company_id: \"1234125\"\n}",
            "type": "json"
          },
          {
            "title": "Response (error):",
            "content": "{\n    error: \"Can not Find\"\n}",
            "type": "json"
          }
        ]
      },
      "version": "0.0.0",
      "filename": "server/routes/employee/employee.controller.js",
      "groupTitle": "Employees"
    },
    {
      "type": "get",
      "url": "/api/employees/company/:id",
      "title": "",
      "name": "GetAllEmployees",
      "group": "Employees",
      "description": "<p>Get data pertaining to all employee based on a provided company id</p>",
      "parameter": {
        "fields": {
          "Parameter": [
            {
              "group": "Parameter",
              "type": "String",
              "optional": false,
              "field": "id",
              "description": "<p>unique id of the company</p>"
            },
            {
              "group": "Parameter",
              "type": "String",
              "optional": false,
              "field": "email",
              "description": "<p>company email to login with</p>"
            },
            {
              "group": "Parameter",
              "type": "String",
              "optional": false,
              "field": "password",
              "description": "<p>password for the associated email</p>"
            }
          ]
        }
      },
      "success": {
        "fields": {
          "Success 200": [
            {
              "group": "Success 200",
              "type": "String",
              "optional": false,
              "field": "_id",
              "description": "<p>unique id of entry</p>"
            },
            {
              "group": "Success 200",
              "type": "String",
              "optional": false,
              "field": "email",
              "description": "<p>email that the user logged in with</p>"
            },
            {
              "group": "Success 200",
              "type": "String",
              "optional": false,
              "field": "phone_number",
              "description": "<p>phone number of the employee</p>"
            },
            {
              "group": "Success 200",
              "type": "String",
              "optional": false,
              "field": "role",
              "description": "<p>the role of the account under the user</p>"
            },
            {
              "group": "Success 200",
              "type": "String",
              "optional": false,
              "field": "company_id",
              "description": "<p>unique id of the company they belong to</p>"
            }
          ]
        }
      },
      "error": {
        "fields": {
          "Error 4xx": [
            {
              "group": "Error 4xx",
              "optional": false,
              "field": "error",
              "description": "<p>Can not Find</p>"
            }
          ]
        },
        "examples": [
          {
            "title": "Response (success):",
            "content": "{\n  {\n      _id : \"12314125\"\n      email : \"test@yahoo.com\",\n      phone_number : \"0123456789\",\n      role: \"a_admin\",\n      company_id: \"1234125\"\n  }\n  { \n      _id : \"12314125\"\n      email : \"test@yahoo.com\",\n      phone_number : \"0123456789\",\n      role: \"a_admin\",\n      company_id: \"1234125\"\n  }\n}",
            "type": "json"
          },
          {
            "title": "Response (error):",
            "content": "{\n    error: \"Can not Find\"\n}",
            "type": "json"
          }
        ]
      },
      "version": "0.0.0",
      "filename": "server/routes/employee/employee.controller.js",
      "groupTitle": "Employees"
    },
    {
      "type": "get",
      "url": "/api/employees/:id",
      "title": "",
      "name": "GetEmployees",
      "group": "Employees",
      "description": "<p>Get data pertaining to an employee based on their id</p>",
      "parameter": {
        "fields": {
          "Parameter": [
            {
              "group": "Parameter",
              "type": "String",
              "optional": false,
              "field": "id",
              "description": "<p>unique id of the employee</p>"
            }
          ]
        }
      },
      "success": {
        "fields": {
          "Success 200": [
            {
              "group": "Success 200",
              "type": "String",
              "optional": false,
              "field": "_id",
              "description": "<p>unique id of entry</p>"
            },
            {
              "group": "Success 200",
              "type": "String",
              "optional": false,
              "field": "email",
              "description": "<p>email that the user logged in with</p>"
            },
            {
              "group": "Success 200",
              "type": "String",
              "optional": false,
              "field": "phone_number",
              "description": "<p>phone number of the employee</p>"
            },
            {
              "group": "Success 200",
              "type": "String",
              "optional": false,
              "field": "role",
              "description": "<p>the role of the account under the user</p>"
            },
            {
              "group": "Success 200",
              "type": "String",
              "optional": false,
              "field": "company_id",
              "description": "<p>unique id of the company they belong to</p>"
            }
          ]
        }
      },
      "error": {
        "fields": {
          "Error 4xx": [
            {
              "group": "Error 4xx",
              "optional": false,
              "field": "error",
              "description": "<p>Can not Find</p>"
            }
          ]
        },
        "examples": [
          {
            "title": "Response (success):",
            "content": "{\n    _id : \"12314125\"\n    email : \"test@yahoo.com\",\n    phone_number : \"0123456789\",\n    role: \"a_admin\",\n    company_id: \"1234125\"\n}",
            "type": "json"
          },
          {
            "title": "Response (error):",
            "content": "{\n    error: \"Can not Find\"\n}",
            "type": "json"
          }
        ]
      },
      "version": "0.0.0",
      "filename": "server/routes/employee/employee.controller.js",
      "groupTitle": "Employees"
    },
    {
      "type": "post",
      "url": "/api/employees",
      "title": "",
      "name": "PostEmployees",
      "group": "Employees",
      "description": "<p>Create a new employee and insert into the system</p>",
      "parameter": {
        "fields": {
          "Parameter": [
            {
              "group": "Parameter",
              "type": "String",
              "optional": false,
              "field": "first_name",
              "description": "<p>employee email to signup with</p>"
            },
            {
              "group": "Parameter",
              "type": "String",
              "optional": false,
              "field": "last_name",
              "description": "<p>employee email to signup with</p>"
            },
            {
              "group": "Parameter",
              "type": "String",
              "optional": false,
              "field": "email",
              "description": "<p>employee email to signup with</p>"
            },
            {
              "group": "Parameter",
              "type": "String",
              "optional": false,
              "field": "password",
              "description": "<p>password for the associated email</p>"
            },
            {
              "group": "Parameter",
              "type": "String",
              "optional": false,
              "field": "phone_number",
              "description": "<p>phone number of the employee</p>"
            },
            {
              "group": "Parameter",
              "type": "String",
              "optional": false,
              "field": "role",
              "description": "<p>role of the employee under this account</p>"
            },
            {
              "group": "Parameter",
              "type": "String",
              "optional": false,
              "field": "company_id",
              "description": "<p>unique id of the company they belong to</p>"
            }
          ]
        }
      },
      "success": {
        "fields": {
          "Success 200": [
            {
              "group": "Success 200",
              "type": "String",
              "optional": false,
              "field": "_id",
              "description": "<p>unique id of entry</p>"
            },
            {
              "group": "Success 200",
              "type": "String",
              "optional": false,
              "field": "email",
              "description": "<p>email that the user logged in with</p>"
            },
            {
              "group": "Success 200",
              "type": "String",
              "optional": false,
              "field": "phone_number",
              "description": "<p>phone number of the employee</p>"
            },
            {
              "group": "Success 200",
              "type": "String",
              "optional": false,
              "field": "role",
              "description": "<p>the role of the account under the user</p>"
            }
          ]
        }
      },
      "error": {
        "fields": {
          "Error 4xx": [
            {
              "group": "Error 4xx",
              "optional": false,
              "field": "error",
              "description": "<p>Can not Save</p>"
            }
          ]
        },
        "examples": [
          {
            "title": "Role:",
            "content": "c_admin: company admin   \nc_receptionist: company receptionist   \nc_employee: company employee\na_admin: app administrator",
            "type": "json"
          },
          {
            "title": "Response (success):",
            "content": "{\n    _id : \"12314125\"\n    email : \"test@yahoo.com\",\n    phone_number : \"0123456789\",\n    role: \"a_admin\",\n}",
            "type": "json"
          },
          {
            "title": "Response (error):",
            "content": "{\n    error: \"Can not Save\"\n}",
            "type": "json"
          }
        ]
      },
      "version": "0.0.0",
      "filename": "server/routes/employee/employee.controller.js",
      "groupTitle": "Employees"
    },
    {
      "type": "post",
      "url": "/api/employees/login",
      "title": "",
      "name": "PostLogin",
      "group": "Employees",
      "description": "<p>Login into an employee account</p>",
      "parameter": {
        "fields": {
          "Parameter": [
            {
              "group": "Parameter",
              "type": "String",
              "optional": false,
              "field": "email",
              "description": "<p>email to login with</p>"
            },
            {
              "group": "Parameter",
              "type": "String",
              "optional": false,
              "field": "password",
              "description": "<p>password for the associated email</p>"
            }
          ]
        }
      },
      "success": {
        "fields": {
          "Success 200": [
            {
              "group": "Success 200",
              "type": "String",
              "optional": false,
              "field": "_id",
              "description": "<p>unique id of entry</p>"
            },
            {
              "group": "Success 200",
              "type": "String",
              "optional": false,
              "field": "email",
              "description": "<p>email that the user logged in with</p>"
            },
            {
              "group": "Success 200",
              "type": "String",
              "optional": false,
              "field": "phone_number",
              "description": "<p>phone number of the employee</p>"
            },
            {
              "group": "Success 200",
              "type": "String",
              "optional": false,
              "field": "role",
              "description": "<p>the role of the account under the user</p>"
            }
          ]
        }
      },
      "error": {
        "fields": {
          "Error 4xx": [
            {
              "group": "Error 4xx",
              "optional": false,
              "field": "error",
              "description": "<p>Incorrect Credentials</p>"
            }
          ]
        },
        "examples": [
          {
            "title": "Response (success):",
            "content": "{\n    _id : \"12314125\"\n    email : \"test@yahoo.com\",\n    phone_number : \"0123456789\",\n    role: \"a_admin\"\n}",
            "type": "json"
          },
          {
            "title": "Response (error):",
            "content": "{\n    error: \"Incorrect Credentials\"\n}",
            "type": "json"
          }
        ]
      },
      "version": "0.0.0",
      "filename": "server/routes/employee/employee.controller.js",
      "groupTitle": "Employees"
    },
    {
      "type": "put",
      "url": "/api/employees",
      "title": "",
      "name": "PutEmployees",
      "group": "Employees",
      "description": "<p>Update an employees record</p>",
      "parameter": {
        "fields": {
          "Parameter": [
            {
              "group": "Parameter",
              "type": "String",
              "optional": true,
              "field": "first_name",
              "description": "<p>employee email to signup with</p>"
            },
            {
              "group": "Parameter",
              "type": "String",
              "optional": true,
              "field": "last_name",
              "description": "<p>employee email to signup with</p>"
            },
            {
              "group": "Parameter",
              "type": "String",
              "optional": true,
              "field": "email",
              "description": "<p>employee] email to signup with</p>"
            },
            {
              "group": "Parameter",
              "type": "String",
              "optional": true,
              "field": "password",
              "description": "<p>password for the associated email</p>"
            },
            {
              "group": "Parameter",
              "type": "String",
              "optional": true,
              "field": "phone_number",
              "description": "<p>phone number of the employee</p>"
            },
            {
              "group": "Parameter",
              "type": "String",
              "optional": true,
              "field": "role",
              "description": "<p>role of the employee under this account</p>"
            }
          ]
        }
      },
      "success": {
        "fields": {
          "Success 200": [
            {
              "group": "Success 200",
              "type": "String",
              "optional": false,
              "field": "_id",
              "description": "<p>unique id of entry</p>"
            },
            {
              "group": "Success 200",
              "type": "String",
              "optional": false,
              "field": "email",
              "description": "<p>email that the user logged in with</p>"
            },
            {
              "group": "Success 200",
              "type": "String",
              "optional": false,
              "field": "phone_number",
              "description": "<p>phone number of the employee</p>"
            },
            {
              "group": "Success 200",
              "type": "String",
              "optional": false,
              "field": "role",
              "description": "<p>the role of the account under the user</p>"
            },
            {
              "group": "Success 200",
              "type": "String",
              "optional": false,
              "field": "company_id",
              "description": "<p>unique id of the company they belong to</p>"
            }
          ]
        }
      },
      "error": {
        "fields": {
          "Error 4xx": [
            {
              "group": "Error 4xx",
              "optional": false,
              "field": "error",
              "description": "<p>Can not Save</p>"
            }
          ]
        },
        "examples": [
          {
            "title": "Response (success):",
            "content": "{\n    _id : \"12314125\"\n    email : \"test@yahoo.com\",\n    phone_number : \"0123456789\",\n    role: \"a_admin\",\n    company_id: \"1234125\"\n}",
            "type": "json"
          },
          {
            "title": "Response (error):",
            "content": "{\n    error: \"Can not Save\"\n}",
            "type": "json"
          }
        ]
      },
      "version": "0.0.0",
      "filename": "server/routes/employee/employee.controller.js",
      "groupTitle": "Employees"
    }
  ]
});
