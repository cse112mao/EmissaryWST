!function(e) {
  "function" == typeof define && define.amd ? define(["jquery", "moment"], e) : e(jQuery, moment)
}(function(e, t) {
  function n(e, t, n) {
    var a = {
      m: ["eine Minute", "einer Minute"],
      h: ["eine Stunde", "einer Stunde"],
      d: ["ein Tag", "einem Tag"],
      dd: [e + " Tage", e + " Tagen"],
      M: ["ein Monat", "einem Monat"],
      MM: [e + " Monate", e + " Monaten"],
      y: ["ein Jahr", "einem Jahr"],
      yy: [e + " Jahre", e + " Jahren"]
    };
    return t ? a[n][0] : a[n][1]
  }

  (t.defineLocale || t.lang).call(t, "de-at", {
    months: "Jänner_Februar_März_April_Mai_Juni_Juli_August_September_Oktober_November_Dezember".split("_"),
    monthsShort: "Jän._Febr._Mrz._Apr._Mai_Jun._Jul._Aug._Sept._Okt._Nov._Dez.".split("_"),
    weekdays: "Sonntag_Montag_Dienstag_Mittwoch_Donnerstag_Freitag_Samstag".split("_"),
    weekdaysShort: "So._Mo._Di._Mi._Do._Fr._Sa.".split("_"),
    weekdaysMin: "So_Mo_Di_Mi_Do_Fr_Sa".split("_"),
    longDateFormat: {
      LT: "HH:mm",
      LTS: "HH:mm:ss",
      L: "DD.MM.YYYY",
      LL: "D. MMMM YYYY",
      LLL: "D. MMMM YYYY LT",
      LLLL: "dddd, D. MMMM YYYY LT"
    },
    calendar: {
      sameDay: "[Heute um] LT [Uhr]",
      sameElse: "L",
      nextDay: "[Morgen um] LT [Uhr]",
      nextWeek: "dddd [um] LT [Uhr]",
      lastDay: "[Gestern um] LT [Uhr]",
      lastWeek: "[letzten] dddd [um] LT [Uhr]"
    },
    relativeTime: {
      future: "in %s",
      past: "vor %s",
      s: "ein paar Sekunden",
      m: n,
      mm: "%d Minuten",
      h: n,
      hh: "%d Stunden",
      d: n,
      dd: n,
      M: n,
      MM: n,
      y: n,
      yy: n
    },
    ordinalParse: /\d{1,2}\./,
    ordinal: "%d.",
    week: {dow: 1, doy: 4}
  }), e.fullCalendar.datepickerLang("de-at", "de", {
    closeText: "Schließen",
    prevText: "&#x3C;Zurück",
    nextText: "Vor&#x3E;",
    currentText: "Heute",
    monthNames: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
    monthNamesShort: ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"],
    dayNames: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
    dayNamesShort: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
    dayNamesMin: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
    weekHeader: "KW",
    dateFormat: "dd.mm.yy",
    firstDay: 1,
    isRTL: !1,
    showMonthAfterYear: !1,
    yearSuffix: ""
  }), e.fullCalendar.lang("de-at", {
    defaultButtonText: {
      month: "Monat",
      week: "Woche",
      day: "Tag",
      list: "Terminübersicht"
    }, allDayText: "Ganztägig", eventLimitText: function(e) {
      return "+ weitere " + e
    }
  })
});