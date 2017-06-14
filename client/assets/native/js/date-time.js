/***
 * Compare appointment Date to today's Date
 */
var compareDate = function compareDate(appointment) {
  var today = new Date();
  appointment = new Date(Date.parse(appointment));

  var appointmentDate = appointment.getFullYear() + ' ' + appointment.getDate() + ' ' + appointment.getMonth();
  var todayDate = today.getFullYear() + ' ' + today.getDate() + ' ' + today.getMonth();

  return (appointmentDate == todayDate);
}

/***
 * Function to format a JSON date object into a string
 * @param time
 * @return currentTime
 */
var formatTime = function formatTime(time) {
  var currentTime = new Date(Date.parse(time));
  var hour = currentTime.getHours();
  var minute = currentTime.getMinutes();

  if (minute < 10) {
    minute = '0' + minute;
  }

  if (hour >= 13) {
    hour = hour - 12;
    currentTime = hour + ':' + minute + 'PM';
  }

  else if (hour === 12) {
    currentTime = hour + ':' + minute + 'PM';
  }
  else if (hour === 0) {
    currentTime = 12 + ':' + minute + 'AM';
  }
  else {
    currentTime = hour + ':' + minute + 'AM';
  }

  return currentTime;

}

/***
 * Format date to be mm/dd/yyyy format 
 * @param date - the unformated date
 * @return formatted date
 */
var formatDate = function formatDate(time) {
  var date = new Date(Date.parse(time));
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  return month + "/" + day + "/" + year;
}

/***
 * Get the current time and update #clock element
 */
var updateClock = function updateClock() {
  var currentTime = new Date();
  var currentHours = currentTime.getHours();
  var currentMinutes = currentTime.getMinutes();
  //var currentSeconds = currentTime.getSeconds ( );
  // Pad the minutes and seconds with leading zeros, if required
  currentMinutes = ( currentMinutes < 10 ? "0" : "" ) + currentMinutes;
  //currentSeconds = ( currentSeconds < 10 ? "0" : "" ) + currentSeconds;

  // Convert the hours component to 12-hour format if needed
  currentHours = ( currentHours > 12 ) ? currentHours - 12 : currentHours;

  // Convert an hours component of "0" to "12"
  currentHours = ( currentHours == 0 ) ? 12 : currentHours;

  // Compose the string for display
  var currentTimeString = currentHours + ":" + currentMinutes;

  $("#clock").html(currentTimeString);
}


/***
 * Format Date object in JS 
 * @param date - the unformated date
 * @param time - the unformated time
 * @return jsDateObj - formatted js date object for Robots
 */
function jsDate(date, time) {
  var jsDate = reFormatDate(date);
  var jsTime = reFormatTime(time);
  jsDateObj = jsDate + ' ' + jsTime;
  console.log(jsDateObj);
  return jsDateObj;
}

/***
 * Format date for Date object in JS 
 * @param date - the unformated date
 * @return date - formatted js date for Date object for Robots
 */
function reFormatDate(date) {
  var date = new Date(Date.parse(date));
  
  // Validity check
  if (isNaN(date)) {
    return 'NaN';
  }

  // Date is good so set up variables
  var month = date.getMonth() + 1;
  var year = date.getFullYear();
  var day = date.getDate();

  // Add 0 padding if values of day or month is less than 10
  if (day < 10) {
    day = '0' + day;
  }
  if (month < 10) {
    month = '0' + month;
  }

  return year + '-' + month + '-' + day;
}

/***
 * Format time to JS for Robots
 * @param time - the unformated time
 * @return formattedTime formatted time
 */
function reFormatTime(time) {
  var ampm = time.substr(-2, 2);
  var formattedTime;
  var formattedHour;
  var colon = time.indexOf(":");

  // Check if time is valid
  if (ampm !== "AM" && ampm !== "PM") {
    console.log("h1");
    return 'NaN';
  }

  // Check if there is a colon in input
  if (colon === -1) {
    console.log("h2");
    return 'NaN';
  }

  formattedHour = parseInt(time.substr(0, 2)); // Get value of hour
  formattedMin = parseInt(time.substr(colon + 1, 3)); // Get value of hour

  // Check if within 1-12
  if (formattedHour < 1 || formattedHour > 12 || formattedMin < 0 || formattedMin > 59) {
    console.log("h3");
    return 'NaN';
  }

  // Format the input
  if (ampm === "PM") {
    if (formattedHour !== 12) {
      formattedHour = 12 + formattedHour;
    }
    
    if (formattedMin < 10) {
      formattedMin = '0' + formattedMin;
    }
  }

  else {
    if (formattedHour < 10) {
      formattedHour = '0' + formattedHour;
    }
    if (formattedMin < 10) {
      formattedMin = '0' + formattedHour;
    }
    if (formattedHour == 12) {
      formattedHour = '00';
    }
  }

    formattedTime = formattedHour + ':' + formattedMin + ":00";

  return formattedTime;
}

if (typeof exports !== 'undefined') {
  exports.formatTime = formatTime;
  exports.formatDate = formatDate;
  exports.compareDate = compareDate;
  exports.updateClock = updateClock;
  exports.jsDate = jsDate;
  exports.reFormatTime = reFormatTime;
  exports.reFormatDate = reFormatDate;
}