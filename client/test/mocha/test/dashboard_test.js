/**
* Unit tests for native/dashboard.js
*/
this.jsdom = require('jsdom-global')()
global.$ = global.jQuery = require('jquery');

var assert = require('assert');
var dashboard_test = require("../../../assets/native/js/login.js");

describe('dashboard_test.js', function() {
  describe('#compareDate(appointment)', function() {
    /*
    * 
    */
    it("Expects: 'true' from compateDate('22:22')", function() {
      var boolOutput = dashboard_test.compareDate('06/09/2017');
      var expected_output = true;
      assert.equal(expected_output, boolOutput);
      assert.equal(true, true);
    });
  });
/*  describe('#isValidTime(strInputTime, boolInputSeconds)', function() {

    it("Expects: false from isValidTime('22', false, true)", function() {
      var time = hw2_test.isValidTime('22', false, true);
      assert.equal(false, time);
    });

    it("Expects: false from isValidTime('-22:22:22', true, true)", function() {
      var time = hw2_test.isValidTime('-22:22:22', true, true);
      assert.equal(false, time);
    });

    it("Expects: false from isValidTime('22:-22:22', true, true)", function() {
      var time = hw2_test.isValidTime('22:-22:22', true, true);
      assert.equal(false, time);
    });

    it("Expects: false from isValidTime('22:22:-22', true, true)", function() {
      var time = hw2_test.isValidTime('22:22:-22', true, true);
      assert.equal(false, time);
    });

    it("Expects: false from isValidTime('22:59:59', true, true)", function() {
      var time = hw2_test.isValidTime('24:59:59', true, true);
      assert.equal(false, time);
    });

    it("Expects: false from isValidTime('22:60:59', true, true)", function() {
      var time = hw2_test.isValidTime('23:60:59', true, true);
      assert.equal(false, time);
    });

    it("Expects: false from isValidTime('22:59:60', true, true)", function() {
      var time = hw2_test.isValidTime('23:59:60', true, true);
      assert.equal(false, time);
    });

    it("Expects: true from isValidTime('22:59:59', true, true)", function() {
      var time = hw2_test.isValidTime('23:59:59', true, true);
      assert.equal(true, time);
    });

    it("Expects: true from isValidTime('00:00:00', true, true)", function() {
      var time = hw2_test.isValidTime('00:00:00', true, true);
      assert.equal(true, time);
    });

    it("Expects: false from isValidTime('00:as:00', true, true)", function() {
      var time = hw2_test.isValidTime('00:as:00', true, true);
      assert.equal(false, time);
    });

    it("Expects: false from isValidTime('00000002:000010:000', true, true)", function() {
      var time = hw2_test.isValidTime('00000002:000010:000', true, true);
      assert.equal(false, time);
    });

    it("Expects: false from isValidTime('23:59:59 PM', true, false)", function() {
      var time = hw2_test.isValidTime('23:59:59 PM', true, false);
      assert.equal(false, time);
    });

    it("Expects: false from isValidTime('11:59:59', true, false)", function() {
      var time = hw2_test.isValidTime('11:59:59', true, false);
      assert.equal(false, time);
    });

    it("Expects: true from isValidTime('11:59:59 PM', true, false)", function() {
      var time = hw2_test.isValidTime('11:59:59 PM', true, false);
      assert.equal(true, time);
    });

    it("Expects: true from isValidTime('11:59:59 AM', true, false)", function() {
      var time = hw2_test.isValidTime('11:59:59 AM', true, false);
      assert.equal(true, time);
    });

    it("Expects: true from isValidTime('11:59:59 Pm', true, false)", function() {
      var time = hw2_test.isValidTime('11:59:59 Pm', true, false);
      assert.equal(true, time);
    });

    it("Expects: false from isValidTime('0000011:59:59 PM', true, false)", function() {
      var time = hw2_test.isValidTime('0000011:59:59 PM', true, false);
      assert.equal(false, time);
    });

  });*/
});
