/**
* Unit tests for native/date_time.js
*/

var assert = require('assert');
var date_time_test = require("../../../assets/native/js/date-time.js");

describe('date_time_test.js', function() {
  describe('#compareDate(appointment)', function() {
    
    it("Expects to return 'true' from compateDate('current date')", function() {
      var today = new Date();
      var todayMonth = today.getMonth() + 1; // January is 0 so add 1
      var todayDate = todayMonth + '/' + today.getDate() + '/' + today.getFullYear();
      var boolOutput = date_time_test.compareDate(todayDate);
      var expected_output = true;
      assert.equal(expected_output, boolOutput);
    });

    it("Expects to return 'false' from compateDate('currentDate with mod')", function() {
      var today = new Date();
      var todayMonth = today.getMonth(); // January is 0 so add 1
      var todayDate = todayMonth + '/' + today.getDate() + '/' + today.getFullYear();
      var boolOutput = date_time_test.compareDate(todayDate);
      var expected_output = false;
      assert.equal(expected_output, boolOutput);
    });

    it("Expects to return 'false' from compateDate('06/09/2017')", function() {
      var boolOutput = date_time_test.compareDate('06/09/2017');
      var expected_output = false;
      assert.equal(expected_output, boolOutput);
    });

    it("Expects to return 'false' from compateDate('chicken')", function() {
      var boolOutput = date_time_test.compareDate('chicken');
      var expected_output = false;
      assert.equal(expected_output, boolOutput);
    });    
  });

  describe('#formatTime(time)', function() {
    
    it("Expects to return '1:29AM' from formatTime('2017-06-13T01:29:53.995Z')", function() {
      var stringOutput = date_time_test.formatTime('2017-06-13T01:29:53.995Z');
      var expected_output = '1:29AM';
      assert.equal(expected_output, stringOutput);
    });

    it("Expects to return '1:09AM' from formatTime('2017-06-13T01:09:53.995Z')", function() {
      var stringOutput = date_time_test.formatTime('2017-06-13T01:09:53.995Z');
      var expected_output = '1:09AM';
      assert.equal(expected_output, stringOutput);
    });
    
    it("Expects to return '12:29PM' from formatTime('2017-06-13T12:29:53.995Z')", function() {
      var stringOutput = date_time_test.formatTime('2017-06-13T12:29:53.995Z');
      var expected_output = '12:29PM';
      assert.equal(expected_output, stringOutput);
    });

    it("Expects to return '2:29PM' from formatTime('2017-06-13T2:29:53.995Z')", function() {
      var stringOutput = date_time_test.formatTime('2017-06-13T2:29:53.995Z');
      var expected_output = '2:29PM';
      assert.equal(expected_output, stringOutput);
    });

    it("Expects to return '12:29AM' from formatTime('2017-06-13T12:29:53.995Z')", function() {
      var stringOutput = date_time_test.formatTime('2017-06-13T12:29:53.995Z');
      var expected_output = '12:29AM';
      assert.equal(expected_output, stringOutput);
    });
  });

  describe('#formatDate(time)', function() {
    
    it("Expects to return '6/13/2017' from formatDate('2017-06-13T08:29:53.995Z')", function() {
      var stringOutput = date_time_test.formatDate('2017-06-13T08:29:53.995Z');
      var expected_output = '6/13/2017';
      assert.equal(expected_output, stringOutput);
    });
  });

  describe('#reFormatDate(date)', function() {

    it("Expects to return '2017-11-13' from reFormatDate('11/13/2017')", function() {
      var stringOutput = date_time_test.reFormatDate('11/13/2017');
      var expected_output = '2017-11-13';
      assert.equal(expected_output, stringOutput);
    });

    it("Expects to return '2017-06-13' from reFormatDate('6/13/2017')", function() {
      var stringOutput = date_time_test.reFormatDate('6/13/2017');
      var expected_output = '2017-06-13';
      assert.equal(expected_output, stringOutput);
    });

    it("Expects to return '2017-11-01' from reFormatDate('11/01/2017')", function() {
      var stringOutput = date_time_test.reFormatDate('11/01/2017');
      var expected_output = '2017-11-01';
      assert.equal(expected_output, stringOutput);
    });

    it("Expects to return '2017-11-13' from reFormatDate('2017-11-13T08:29:53.995Z')", function() {
      var stringOutput = date_time_test.reFormatDate('2017-11-13T08:29:53.995Z');
      var expected_output = '2017-11-13';
      assert.equal(expected_output, stringOutput);
    });

    it("Expects to return '2017-11-13' from reFormatDate('11 13 17')", function() {
      var stringOutput = date_time_test.reFormatDate('11 13 17');
      var expected_output = '2017-11-13';
      assert.equal(expected_output, stringOutput);
    });

    it("Expects to return 'NaN' from reFormatDate('chicken')", function() {
      var stringOutput = date_time_test.reFormatDate('chicken');
      var expected_output = 'NaN';
      assert.equal(expected_output, stringOutput);
    });
  });

  describe('#reFormatTime(time)', function() {

    it("Expects to return '12:00:00' from reFormatTime('12:00 PM')", function() {
      var stringOutput = date_time_test.reFormatTime('12:00 PM');
      var expected_output = '12:00:00';
      assert.equal(expected_output, stringOutput);
    });

    it("Expects to return '15:39:00' from reFormatTime('3:39PM')", function() {
      var stringOutput = date_time_test.reFormatTime('3:39PM');
      var expected_output = '15:39:00';
      assert.equal(expected_output, stringOutput);
    });

    it("Expects to return '03:39:00' from reFormatTime('3:39 AM')", function() {
      var stringOutput = date_time_test.reFormatTime('3:39 AM');
      var expected_output = '03:39:00';
      assert.equal(expected_output, stringOutput);
    });

    it("Expects to return 'NaN' from reFormatTime('3:39')", function() {
      var stringOutput = date_time_test.reFormatTime('3:39');
      var expected_output = 'NaN';
      assert.equal(expected_output, stringOutput);
    });

    it("Expects to return 'NaN' from reFormatTime('6/13/2017')", function() {
      var stringOutput = date_time_test.reFormatTime('6/13/2017');
      var expected_output = 'NaN';
      assert.equal(expected_output, stringOutput);
    });

    it("Expects to return 'NaN' from reFormatTime('6/13/2017 PM')", function() {
      var stringOutput = date_time_test.reFormatTime('6/13/2017 PM');
      var expected_output = 'NaN';
      assert.equal(expected_output, stringOutput);
    });

    it("Expects to return '16:01:00' from reFormatTime('4:1 PM')", function() {
      var stringOutput = date_time_test.reFormatTime('4:1 PM');
      var expected_output = '16:01:00';
      assert.equal(expected_output, stringOutput);
    });

    it("Expects to return 'NaN' from reFormatTime('PM 3:58')", function() {
      var stringOutput = date_time_test.reFormatTime('PM 3:58');
      var expected_output = 'NaN';
      assert.equal(expected_output, stringOutput);
    });

    it("Expects to return 'NaN' from reFormatTime('33:58')", function() {
      var stringOutput = date_time_test.reFormatTime('33:58');
      var expected_output = 'NaN';
      assert.equal(expected_output, stringOutput);
    });

    it("Expects to return 'NaN' from reFormatTime('33:58 PM')", function() {
      var stringOutput = date_time_test.reFormatTime('33:58 PM');
      var expected_output = 'NaN';
      assert.equal(expected_output, stringOutput);
    });

    it("Expects to return 'NaN' from reFormatTime('l')", function() {
      var stringOutput = date_time_test.reFormatTime('l');
      var expected_output = 'NaN';
      assert.equal(expected_output, stringOutput);
    });

    it("Expects to return '15:38:00' from reFormatTime('3:38:38:38:38 PM')", function() {
      var stringOutput = date_time_test.reFormatTime('3:38:38:38:38 PM');
      var expected_output = '15:38:00';
      assert.equal(expected_output, stringOutput);
    });
  });
});
