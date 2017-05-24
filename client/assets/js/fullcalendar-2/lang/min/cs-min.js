!function(e) {
  "function" == typeof define && define.amd ? define(["jquery", "moment"], e) : e(jQuery, moment)
}(function(e, n) {
  function t(e) {
    return e > 1 && 5 > e && 1 !== ~~(e / 10)
  }

  function r(e, n, r, s) {
    var a = e + " ";
    switch (r) {
      case"s":
        return n || s ? "pár sekund" : "pár sekundami";
      case"m":
        return n ? "minuta" : s ? "minutu" : "minutou";
      case"mm":
        return n || s ? a + (t(e) ? "minuty" : "minut") : a + "minutami";
      case"h":
        return n ? "hodina" : s ? "hodinu" : "hodinou";
      case"hh":
        return n || s ? a + (t(e) ? "hodiny" : "hodin") : a + "hodinami";
      case"d":
        return n || s ? "den" : "dnem";
      case"dd":
        return n || s ? a + (t(e) ? "dny" : "dní") : a + "dny";
      case"M":
        return n || s ? "měsíc" : "měsícem";
      case"MM":
        return n || s ? a + (t(e) ? "měsíce" : "měsíců") : a + "měsíci";
      case"y":
        return n || s ? "rok" : "rokem";
      case"yy":
        return n || s ? a + (t(e) ? "roky" : "let") : a + "lety"
    }
  }

  var s = "leden_únor_březen_duben_květen_červen_červenec_srpen_září_říjen_listopad_prosinec".split("_"),
    a = "led_úno_bře_dub_kvě_čvn_čvc_srp_zář_říj_lis_pro".split("_");
  (n.defineLocale || n.lang).call(n, "cs", {
    months: s,
    monthsShort: a,
    monthsParse: function(e, n) {
      var t, r = [];
      for (t = 0; 12 > t; t++)r[t] = RegExp("^" + e[t] + "$|^" + n[t] + "$", "i");
      return r
    }(s, a),
    weekdays: "neděle_pondělí_úterý_středa_čtvrtek_pátek_sobota".split("_"),
    weekdaysShort: "ne_po_út_st_čt_pá_so".split("_"),
    weekdaysMin: "ne_po_út_st_čt_pá_so".split("_"),
    longDateFormat: {
      LT: "H:mm",
      LTS: "LT:ss",
      L: "DD.MM.YYYY",
      LL: "D. MMMM YYYY",
      LLL: "D. MMMM YYYY LT",
      LLLL: "dddd D. MMMM YYYY LT"
    },
    calendar: {
      sameDay: "[dnes v] LT", nextDay: "[zítra v] LT", nextWeek: function() {
        switch (this.day()) {
          case 0:
            return "[v neděli v] LT";
          case 1:
          case 2:
            return "[v] dddd [v] LT";
          case 3:
            return "[ve středu v] LT";
          case 4:
            return "[ve čtvrtek v] LT";
          case 5:
            return "[v pátek v] LT";
          case 6:
            return "[v sobotu v] LT"
        }
      }, lastDay: "[včera v] LT", lastWeek: function() {
        switch (this.day()) {
          case 0:
            return "[minulou neděli v] LT";
          case 1:
          case 2:
            return "[minulé] dddd [v] LT";
          case 3:
            return "[minulou středu v] LT";
          case 4:
          case 5:
            return "[minulý] dddd [v] LT";
          case 6:
            return "[minulou sobotu v] LT"
        }
      }, sameElse: "L"
    },
    relativeTime: {
      future: "za %s",
      past: "před %s",
      s: r,
      m: r,
      mm: r,
      h: r,
      hh: r,
      d: r,
      dd: r,
      M: r,
      MM: r,
      y: r,
      yy: r
    },
    ordinalParse: /\d{1,2}\./,
    ordinal: "%d.",
    week: {dow: 1, doy: 4}
  }), e.fullCalendar.datepickerLang("cs", "cs", {
    closeText: "Zavřít",
    prevText: "&#x3C;Dříve",
    nextText: "Později&#x3E;",
    currentText: "Nyní",
    monthNames: ["leden", "únor", "březen", "duben", "květen", "červen", "červenec", "srpen", "září", "říjen", "listopad", "prosinec"],
    monthNamesShort: ["led", "úno", "bře", "dub", "kvě", "čer", "čvc", "srp", "zář", "říj", "lis", "pro"],
    dayNames: ["neděle", "pondělí", "úterý", "středa", "čtvrtek", "pátek", "sobota"],
    dayNamesShort: ["ne", "po", "út", "st", "čt", "pá", "so"],
    dayNamesMin: ["ne", "po", "út", "st", "čt", "pá", "so"],
    weekHeader: "Týd",
    dateFormat: "dd.mm.yy",
    firstDay: 1,
    isRTL: !1,
    showMonthAfterYear: !1,
    yearSuffix: ""
  }), e.fullCalendar.lang("cs", {
    defaultButtonText: {month: "Měsíc", week: "Týden", day: "Den", list: "Agenda"},
    allDayText: "Celý den",
    eventLimitText: function(e) {
      return "+další: " + e
    }
  })
});