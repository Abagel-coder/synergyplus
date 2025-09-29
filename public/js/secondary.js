// secondary.js
// . All Rights Reserved. 
// 
// Handles parsing and rendering message data and attendance data (secondary features)

let attendance = {
  data: {config: {}, absences: [], total: {}}, 
  rawData: {}, 
  loaded: false, 
  filterPeriods: [{
    name: 'Last 7 Days', 
    func: (i) => {return i.date > moment().subtract(7, 'days')}
  }, {
    name: 'Last 14 Days', 
    func: (i) => {return i.date > moment().subtract(14, 'days')}
  }, {
    name: 'Last 30 Days', 
    func: (i) => {return i.date > moment().subtract(30, 'days')}
  }, {
    name: false, // use curPd_name (false signifies that) 
    func: (i) => {return i.date.isSame(moment().add(attendance.data.monthShown, 'months'), 'months')}
  }, {
    name: 'All Time', 
    func: (i) => {return true}
  }], 
  parse: (raw) => {
    let res = {
      config: {
        startPeriod: 1, 
        endPeriod: 10
      }, absences: [], total: {}
    };  
    res.config.startPeriod = parseInt(raw.$.StartPeriod); 
    res.config.endPeriod = parseInt(raw.$.EndPeriod); 
    if(res.config.endPeriod > 11) {res.config.endPeriod = 11}
    if(raw.Absences[0].Absence){
      for(let i = 0; i < raw.Absences[0].Absence.length; i++){
        let item = raw.Absences[0].Absence[i]; 
        if(item.Periods[0] === ''){
          continue } // ghost item w/o any attendance data
        let rawPeriods = item.Periods[0].Period; 
        let periods = []; 
        let periodItems = {}; // Used for "summary" key
        let summaryStr = '', summaryText = [], calMark = ''; // calMark represents the circles on the calendar 
        for(let j = 0; j < rawPeriods.length; j++){
          let period = rawPeriods[j].$; 
          let p = parseInt(period.Number) - res.config.startPeriod; // adjust for offset (first period is index 0, etc.) 
          periods[p] = {
            number: parseInt(period.Number), 
            name: period.Name, 
            reason: period.Reason, 
            course: period.Course
          }
          if(!periodItems[period.Name]){
            periodItems[period.Name] = 1 }
          else{
            periodItems[period.Name] ++ }
        }
        for(let i = 0; i < Object.keys(periodItems).length; i++){
          let item = Object.keys(periodItems)[i];
          calMark += `<div class='att-calMark ${attendance.methods.getColor(item, 1)}' style='left: calc(50% - ${(2 + 6*i - 3*(Object.keys(periodItems).length-1))}px)'></div>`; 
          summaryStr += `<span class='${attendance.methods.getColor(item)}'>${periodItems[item]}x  ${attendance.methods.getIcon(item)}</span> `;
          summaryText.push(`${periodItems[item]}x ${item}`); 
        }
        summaryText = summaryText.join(', ');
        res.absences.push({
          date: moment(item.$.AbsenceDate, 'MM/DD/YYYY'), 
          dateStr: moment(item.$.AbsenceDate, 'MM/DD/YYYY').format('ddd, M/DD/YY'),
          dateRaw: item.$.AbsenceDate,
          note: item.$.Note, 
          reason: item.$.Reason, 
          periods: periods, 
          summary: summaryStr, 
          summaryText: summaryText, 
          individual: periodItems, 
          calMark: calMark
        })
      }
    }
    attendance.rawData = raw; 
    attendance.data = res; 
    attendance.data.showSelPD = false; 
    attendance.data.monthShown = 0; // default to current month
    attendance.data.curFilterPeriod = 0; // default to last seven days
    attendance.data.filterPeriods = attendance.filterPeriods;
    attendance.data.showMostRecent = true;
    attendance.data.curDayShown = res.absences.length > 0 ? res.absences[0]:!1;

    if(!vAttendance){initAttendance()}
  }, 
  update: function (){
    $.get('data/attendance').then(r => {
      attendance.loaded = true; 
      $('#att-loading').hide(); 
      $('#att-main').show(); 
      attendance.parse(r.data.Attendance); 
    }, e => {
      try {
        let resp = JSON.parse(e.response)
        $('#att-loading-text').html(`<i class='fas fa-exclamation-triangle'></i> ${e.status}: ${resp.msg}`)
      } catch (e) {
        $('#att-loading-text').html(`<i class='fas fa-exclamation-triangle'></i> We were unable to fetch your attendance records.`)
      } 
    })
  }, 
  methods: { // Methods other than core attendance functions (parse, update)
    getIcon: (name) => {
      let icon = ''; 
      switch (name) {
        case 'Activity': 
          icon = 'fas fa-flag light-blue-text bw'
          break;
        case 'Excused': 
          icon = 'fas fa-check-circle green-text bw'
          break;
        case 'Absent': 
          icon = 'fas fa-check-circle light-blue-text bw'
          break;
        case 'Excused Tardy': 
          icon = 'fas fa-clock yellow-text bw'; 
          break; 
        case 'Unexcused Tardy': 
          icon = 'fas fa-exclamation-circle orange-text bw'; 
          break; 
        case 'Unexcused': 
          icon = 'fas fa-times-circle red-text bw'; 
          break; 
        case 'Not Included': 
          icon = 'fas fa-dot-circle light-blue-text bw'
          break;
        default: 
          icon = 'fas fa-question-circle'; 
          break;
      }
      return `<i title='${name}' class='${icon}'></i>`
    }, 
    getColor: (name, type) => {
      switch(name) {
        case 'Activity': 
        case 'Absent': 
        case 'Not Included': 
          if(type) return 'light-blue bw'; 
          return 'light-blue-text bw'; 
        case 'Excused': 
          if(type) return 'green bw'; 
          return 'green-text bw'; 
        case 'Excused Tardy': 
          if(type) return 'yellow bw'; 
          return 'yellow-text bw'; 
        case 'Unexcused Tardy': 
          if(type) return 'orange bw'; 
          return 'orange-text bw'; 
        case 'Unexcused': 
          if(type) return 'red bw'; 
          return 'red-text bw'; 
        default: 
          return 'bw'; 
      }
    }
  }
}

let vAttendance; 
function initAttendance(){
  vAttendance = new Vue({
    el: '#v-attendance', 
    data: attendance.data, // wait to initialize module as vue needs the data to be reactive
    methods: {
      moment: window.moment, 
      $_getDay: (i, j) => { // render calendar
        let monthShift = attendance.data.monthShown; 
        let day = moment().add(monthShift, 'months').date(1).day(j-1 + 7*(i-1));
        let dayText = day.format('D');
        if(moment().isSame(day, 'day')){
          dayText = `<b class='light-blue-text bw'>${dayText}</b>`}
        else if(j === 1 || j === 7 || moment().add(monthShift, 'months').month() !== day.month()){dayText = `<span class='gray'>${dayText}</span>`}
        let markings = attendance.data.absences.filter((i) => {return i.date.isSame(day, 'day')}); 
        if(markings.length > 0){
          dayText += markings[0].calMark}
        return dayText
      }, 
      $_showDay: (ele, i, j) => { // select day on calendar
        let monthShift = attendance.data.monthShown; 
        let day = moment().add(monthShift, 'months').date(1).day(j-1 + 7*(i-1));
        let attNotes = attendance.data.absences.filter((i) => {
          return i.date.isSame(day, 'day'); // fetch attendance notes, if they exist
        }); 
        
        if(attNotes.length === 0){
          if(day.isSame(moment(), 'day')){
            attendance.data.showMostRecent = true; 
            attendance.data.curDayShown = attendance.data.absences[0]; 
            return; 
          }
          rlib.toast.info(`No attendance notes for ${day.format('MM/D')}.`);
          return; 
        }
        attendance.data.showMostRecent = day.isSame(moment(), 'day');
        attendance.data.curDayShown = attNotes[0];  
      }, 
      $_calHL: (i, j) => { // determine which day to highlight on calendar
        let monthShift = attendance.data.monthShown; 
        let day = moment().add(monthShift, 'months').date(1).day(j-1 + 7*(i-1));
        if(attendance.data.showMostRecent){
          if(day.isSame(moment(), 'day')){return 'att-calSelToday'}
          return ''; 
        }
        if(day.isSame(attendance.data.curDayShown.date, 'day')){
          return 'att-calSel' }
        return ''; 
      }, 
      $_selPd: (v) => { // select period (secondary div w/ overall "periods")
        attendance.data.showSelPD = false; 
        attendance.data.curFilterPeriod = v; 
      }, 
      $_getIcon: attendance.methods.getIcon, 
      $_getColor: attendance.methods.getColor, 
      $_trim: v_shared.trimTitle
    }, 
    computed: {
      curPd_name: () => { // name of current month, if selected period is "(month) total"
        let monthShift = attendance.data.monthShown; 
        return moment().add(monthShift, 'months').format('MMMM') + ' Total';
      }, 
      currentPeriod: () => {
        let raw = attendance.data.absences.filter(attendance.filterPeriods[attendance.data.curFilterPeriod].func).map(i => i.individual), out = {};
        raw.forEach(r => {
          for(i in r){
            if(!out[i]){
              out[i] = r[i]; 
            }
            else{
              out[i] += r[i]
            }
          }
        }); 
        return out; 
      }, 
      h_curShown: () => { // header for "Currently Shown", defaults to "Most Recent"
        let det = attendance.data.curDayShown; 
        if(!det){
          return '<b>Most Recent</b> None' }
        else if(attendance.data.showMostRecent){
          return `<b>Most Recent</b> ${moment(det.date).format('ddd, MMMM D')}`}
        return moment(det.date).format('ddd, MMMM D'); 
      }, 
      f_curShown: () => { // filter for current periods, removes periods w/o markings
        if(!attendance.data.curDayShown){return []}
        return attendance.data.curDayShown.periods.filter(r => {return r});
      }
    }
  }); 
  M.Collapsible.init($('#attendance-list')[0]); 
}

let messages = {
  data: [], 
  rawData: [], 
  loaded: false, 
  parse: (raw) => {
    let res = []; 
    messages.rawData = raw; 
    if(!raw){ // no messages
      initMessages(); 
      return; 
    }
    for(let i = 0; i < raw.length; i++){
      let msg = raw[i].$; 
      res.push({
        dateRaw: msg.BeginDate, 
        date: moment(msg.BeginDate, 'MM/DD/YYYY HH:mm:ss'), 
        dateStr: moment(msg.BeginDate, 'MM/DD/YYYY HH:mm:ss').format('M/DD h:mm A'), 
        dateStrShort: moment(msg.BeginDate, 'MM/DD/YYYY HH:mm:ss').format('M/DD'), 
        subject: msg.Subject, 
        from: msg.From,
        content: msg.Content
      }); 
    }
    messages.data = res; 
    if(!vMessages){initMessages()}
    vMessages.data = messages.data; 
  }, 
  update: function (){
    $.get('data/messages').then(r => {
      messages.parse(r.data.PXPMessagesData.MessageListings[0].MessageListing); 
      $('#messages-loading').hide();
      $('.messages-doneLoading').removeClass('hidden');
      messages.loaded = true; 
    }, e => {
      try {
        let resp = JSON.parse(e.response)
        $('#messages-loading-text').html(`<i class='fas fa-exclamation-triangle'></i> ${e.status}: ${resp.msg}`)
      } catch (e) {
        $('#messages-loading-text').html(`<i class='fas fa-exclamation-triangle'></i> We were unable to fetch your messages.`)
      } 
    })
  }
}

let vMessages; 
function initMessages(){
  vMessages = new Vue({
    el: '#v-messages', 
    data: {
      messages: messages.data
    }
  }); 
  M.Collapsible.init($('#message-list')[0]); 
}

// -1 = no period
// -2 = lunch
// -3 = passing period

let bellSchedule = {
  vue: undefined, 
  raw: { // easy to read, "raw" input
    'Foothill High School': [
      {
        name: '2023-2024', 
        times: [
          {'7:26-8:23': 0}, 
          {'8:30-9:27': 1}, 
          {'9:34-10:31': 2}, 
          {'10:38-11:35': 3},
          {'11:42-12:39': 4},
          {'12:39-13:09': -2},  
          {'13:16-14:13': 5}, 
          {'14:20-15:17': 6}, 
        ]
      }, {
        name: '2023-2024', 
        times: [
          {'7:26-8:23': 0},
          {'8:30-9:27': 1}, 
          {'9:34-10:31': 2}, 
          {'10:38-11:35': 3},
          {'11:42-12:39': 4},
          {'12:39-13:09': -2},  
          {'13:16-14:13': 5}, 
          {'14:20-15:17': 6}, 
        ]
      }, {
        name: '2023-2024', 
        times: [
          {'8:50-10:24': 1}, 
          {'10:31-12:05': 3}, 
          {'12:05-12:35': -2}, 
          {'12:42-13:32': 8}, 
          {'13:39-15:13': 5}
        ]
      }, {
        name: '2023-2024', 
        times: [
          {'7:10-8:43': 0}, 
          {'8:50-10:24': 2}, 
          {'10:31-12:05': 4}, 
          {'12:05-12:35': -2}, 
          {'12:42-13:32': 8}, 
          {'13:39-15:13': 6}
        ]
      }, {
        name: '2023-2024', 
        times: [
          {'7:26-8:23': 0},
          {'8:30-9:27': 1}, 
          {'9:34-10:31': 2}, 
          {'10:38-11:35': 3},
          {'11:42-12:39': 4},
          {'12:39-13:09': -2},  
          {'13:16-14:13': 5}, 
          {'14:20-15:17': 6}, 
        ]
      }
    ]
  }, 
  scheduleData: [ // machine-parsable schedule generated using init()

  ], 
  scheduleDisp: [ // what's directly rendered on the GUI -- contains class information

  ],
  dispData: {}, // data store for dynamic aspects (current period, what period's highlighted, etc.) 
  init: (school) => {
    $('#bell-date').text(`${moment().format('dddd, MMMM Do')}`); 
    if(bellSchedule.raw[school]){ // If not available, the page will say that unless otherwise told not to so no other action is needed
      $('#bell-now-outer').show(); 
      $('#bell-unavailable').hide(); 
      $('.bell-hidden').removeClass('hidden'); 
      bellSchedule.dispData.school = school; // saved for when using reInit
      let raw = bellSchedule.raw[school]; 
      raw.forEach(day => {
        let p = []; // periods 
        let t = []; // timestamps (two per period, start/end)
        day.times.forEach(time => {
          let ts = Object.keys(time)[0]; // timestamp (singular)
          p.push(time[ts]); // add period to periods array
          ts = ts.split('-'); 
          ts.forEach(val => {
            t.push(moment(val, 'H:mm'))
          })
        })
        bellSchedule.scheduleData.push({
          name: day.name, 
          periods: p, 
          times: t
        }); 
      })
      if(moment().day() === 0 || moment().day() === 6){
        $('#bell-drop-title').text(`Monday`);
        bellSchedule.updateDay(1) } // weekend, no schedule for weekends
      else{
        $('#bell-drop-title').text(`Today (${moment().format('ddd')})`);
        bellSchedule.updateDay() }
      bellSchedule.vue = new Vue({ // Initialize Vue instance after building today's schedule
        el: '#v-schedule', 
        data: {
          schedule: bellSchedule.scheduleDisp
        }, 
        methods: {
          $_day: (i) => {
            return moment(i, 'd').format('dddd') + ' - ' + bellSchedule.scheduleData[i-1].name
          }, 
          $_changeDay: (i) => {
            M.Dropdown.getInstance($('#bell-drop-trigger')[0]).close(); 
            if(moment().format('d') !== i.toString()){ // Change text based on which schedule is shown
              bellSchedule.removeHL(); 
              bellSchedule.dispData.noHL = true; 
              bellSchedule.updateDay(i); // Remove highlighting before changing day
              $('#bell-drop-title').text(`${moment(i, 'd').format('dddd')}`)}
            else{ 
              bellSchedule.dispData.noHL = false; 
              bellSchedule.updateDay(i); // Update day before adding highlighting back
              bellSchedule.update();
              $('#bell-drop-title').text(`Today (${moment().format('ddd')})`)}
          }
        }
      }); 

      M.Dropdown.init($('#bell-drop-trigger')[0]);
      M.Dropdown.getInstance($('#bell-drop-trigger')[0]).options.constrainWidth = false;
      M.Dropdown.getInstance($('#bell-drop-trigger')[0]).options.closeOnClick = false;
      bellSchedule.update(); 
      return; 
    }
  }, 
  reInit: () => { // called when the day has changed
    let school = bellSchedule.dispData.school; 
    if(!school){throw 'cannot call reInit before calling init'}
    console.log(school)
    bellSchedule.scheduleData = []; 
    let raw = bellSchedule.raw[school]; 
    raw.forEach(day => {
      let p = []; // periods 
      let t = []; // timestamps (two per period, start/end)
      day.times.forEach(time => {
        let ts = Object.keys(time)[0]; // timestamp (singular)
        p.push(time[ts]); // add period to periods array
        ts = ts.split('-'); 
        ts.forEach(val => {
          t.push(moment(val, 'H:mm'))
        })
      })
      bellSchedule.scheduleData.push({
        name: day.name, 
        periods: p, 
        times: t
      }); 
    })
    
    if(moment().day() === 0 || moment().day() === 6){
      $('#bell-drop-title').text(`Monday`);
      bellSchedule.updateDay(1) } 
    else{
      $('#bell-drop-title').text(`Today (${moment().format('ddd')})`);
      bellSchedule.updateDay() } 
    bellSchedule.update(); 
    return; 
  }, 
  removeHL: function(){ // Removes highlighting (used when showing the schedule for a different day)
    let dd = bellSchedule.dispData; 
    eleMap = dd.periodMap[dd.now+10]; // id of element to modify
    $('#bell-now-'+eleMap).hide(); 
    $('#bell-li-'+eleMap).removeClass('hl-new'); 
    eleMap = dd.periodMap[dd.next+10];
    $('#bell-next-'+eleMap).hide(); 
    $('#bell-li-'+eleMap).removeClass('hl-i2'); 
    dd.now = -1; dd.next = -1; 
  }, 
  update: function() { // Automatically scheduled to regularly run after calling init
    $('#bell-time').text(moment().format('h:mm a') + ' •');
    let period = bellSchedule.getPeriods(); 
    if(period.reinit){ // day has changed
      bellSchedule.removeHL(); 
      bellSchedule.reInit(); 
      return; 
    }
    if(period.class){
      let timeStr = Math.round(period.time/60000); 
      if(timeStr === 0){timeStr = '<1'}
      $('#bell-timeLeft').text(timeStr); 
      $('#bell-timeLeft-outer').show()}
    else{$('#bell-timeLeft-outer').hide()}
    $('#bell-now').text(period.msg); 
    if(bellSchedule.dispData.noHL){return} // don't show highlights (used when showing a different day's schedules)
    let dd = bellSchedule.dispData; 
    if (!dd.periodMap){return}
    if(period.now !== dd.now){
      let eleMap; 
      if(dd.now){ // remove previous highlight
        eleMap = dd.periodMap[dd.now+10]; // id of element to modify
        $('#bell-now-'+eleMap).hide(); 
        $('#bell-li-'+eleMap).removeClass('hl-new'); 
      }
      dd.now = period.now; 
      eleMap = dd.periodMap[dd.now+10];
      $('#bell-now-'+eleMap).show(); 
      $('#bell-li-'+eleMap).addClass('hl-new'); 
    }
    if(period.next !== dd.next){ // same as above but for the next period
      let eleMap; 
      if(dd.next){ 
        eleMap = dd.periodMap[dd.next+10]; 
        $('#bell-next-'+eleMap).hide(); 
        $('#bell-li-'+eleMap).removeClass('hl-i2'); 
      }
      dd.next = period.next; 
      eleMap = dd.periodMap[dd.next+10];
      $('#bell-next-'+eleMap).show(); 
      $('#bell-li-'+eleMap).addClass('hl-i2'); 
    }
  },
  updateDay: function(day=parseInt(moment().format('d'))) { // Called once during init and then again from update if day has changed
    let schedule = bellSchedule.scheduleData[day-1]; 
    if(day === parseInt(moment().format('d'))){ // is today
      $('#bell-date').text(`${moment().format('dddd, MMMM Do')}`)
      $('#bell-schedule').text(` • ${schedule.name}`) }
    else{ // not today - make that obvious
      $('#bell-date').html(`${moment().format('dddd, MMMM Do')}`)
      $('#bell-schedule').html(`<span class='hide-on-small-only'> • </span><br class='hide-on-med-and-up'/><span class='bw yellow-text'>Showing <b>${moment(day, 'd').format('dddd')}</b> (${schedule.name})</span>`) }
    this.scheduleDisp.name = schedule.name; 
    let res = []; 
    let periodMap = []; // 0-indexed +10 array connecting period numbers to "course" elements (i.e., period 7 would be periodMap[17], lunch (-2) would be periodMap[8])

    // construct array of available classes
    let courseData = cbData; 
    let classSchedule = []; // classSchedule[i] is the class during period i, everything else is empty; 
    courseData.forEach(course => {
      if (!course._m && course.$) {
        let period = parseInt(course.$.Period); 
        classSchedule[period] = {
          room: course.$.Room, 
          staff: course.$.Staff, 
          title: v_shared.trimTitle(course.$.Title) // v_shared from main.js, optional (but keeps titles more concise)
        }
      }
    })

    schedule.periods.forEach((period, index) => { // schedule.periods is the list of periods the user has that day
      let timeStart = schedule.times[index*2]; 
      let timeEnd = schedule.times[index*2 + 1]; 
      let timeStr = timeStart.format('h:mm a') + ' - ' + timeEnd.format('h:mm a'); 
      if(period == -2){ // special period (any period <0 is special, but as of now, only -2 is used)
        periodMap[8] = res.length; // lunch is always period -2
        res.push({
          name: 'Lunch', 
          class: 'Lunch Period', 
          time: timeStr, 
          subtext: ''
        }); 
      }
      else if(classSchedule[period]) { // valid period, put in as class
        let cls = classSchedule[period]; // cls = class, as "class" is a reserved word
        periodMap[period+10] = res.length; 
        res.push({
          name: `Period ${period}`, 
          class: cls.title, 
          time: timeStr, 
          subtext: cls.room?`${cls.staff} • ${cls.room}`:cls.staff
        })
      }
      else{ // period not in schedule, default to off period
        periodMap[period+10] = res.length; 
        res.push({
          name: `Period ${period}`, 
          class: '(Off Period)', 
          time: timeStr, 
          subtext: ''
        }); 
      }
    })
    this.scheduleDisp = res; 
    this.dispData.periodMap = periodMap; 
    if(this.vue){ // update Vue
      this.vue.schedule = res}
    return res; 
  },
  getPeriods: (time=moment(), day=parseInt(moment().format('d'))) => { 
    // returns object {class: boolean, now: number, next: number, time: number, msg: string}
    // "msg" is used for the "now" section, "class" is used to determine whether the "_m left" shows up or not
    // will fail if day is not properly initialized from updateDay method
    // 
    // time is a date object or moment object, defaults to current time
    // day is a number 1-5, 1=Mon, 2=Tue, and so on, defaults to current day
    if(day < 1 || day > 5) {return {class: false, msg: 'No school today.'}} // no periods on weekends
    let schedule = bellSchedule.scheduleData[day-1]; 
    if (!schedule) {
      return {
        class: false, 
        msg: 'We were unable to find and/or load your bell schedule.', 
        now: -1
      }
    }
    let times = schedule.times, periods = schedule.periods; 
    if(time.isBefore(times[0])){ // first class hasn't started yet
      return {class: false, msg: 'The school day has not started yet.', next: periods[0]}}
    else if(time.isAfter(times[times.length-1])){ // last class has ended
      if(time.format('d') !== moment(times[times.length-1]).format('d')){
        return {reinit: true}} // tell .update() to stop, reinitialize, and then update again
      return {class: false, msg: 'School is over for the day.'}} 
    let currentIndex = 0;
    while(time.isAfter(times[currentIndex]) && currentIndex < times.length){
      // find out the most recent period that's started/finished
      currentIndex ++ }
    if(currentIndex%2 === 1){ // means that current period hasn't ended yet
      let currentPeriod = periods[Math.floor(currentIndex/2)]; 
      return {
        class: true, 
        msg: bellSchedule.scheduleDisp[bellSchedule.dispData.periodMap[currentPeriod+10]].class, 
        now: currentPeriod, 
        next: periods[Math.floor(currentIndex/2) + 1], 
        time: (times[currentIndex].valueOf() - time.valueOf())
      }
    }
    else{ // current period ended but next one hasn't started -- passing period
      let nextPeriod = periods[Math.floor(currentIndex/2)]; 
      return {
        class: true, 
        msg: 'Passing Period',
        now: -3, // passing period
        next: nextPeriod, 
        time: (times[currentIndex].valueOf() - time.valueOf())
      }
    }
  }
}

// Remove courseHistory feature: no longer loaded or exposed.

let welcome = {
  instance: null, 
  open: function(){
    M.Modal.init($('#modal-welcome')[0], {'dismissible': false, 'onOpenEnd': () => {
      this.instance = M.Carousel.init($('#wel-carousel')[0], {
        fullWidth: true, 
        indicators: true, 
        noWrap: true, 
        onCycleTo: (e) => {
          if(this.instance){
            let pos = this.instance.center; 
            if(pos === 0){
              $('#wel-next').text('Get Started');
            } else if(pos === 4){
              $('#wel-next').text('Let\'s Go!')
              $('#wel-final').show(); // hidden until we reach it due to a quirk w/ Materialize that'll make it show up beforehand
            } else{
              $('#wel-next').text('Continue')
            }
          }
        }
      })
    }}); 
    $('#wel-qa button').on('click', (e) => {
      let t = $(e.target).closest('button')[0]; 
      let d = t.dataset; 
      let i = $(t).html();
      i = i.slice(0, i.indexOf('</svg>')+6);
      $('#wel-qa-desc').html(`<b>${i} ${d.name}</b><br/>${d.desc}<br/><span class='light-blue-text bw'><i class='fas fa-lightbulb'></i> Tip: ${d.tip}</span>`);
    }); 
    $('#wel-more button').on('click', (e) => {
      let t = $(e.target).closest('button')[0]; 
      let d = t.dataset; 
      let i = $(t).html();
      i = i.slice(0, i.indexOf('</svg>')+6);
      $('#wel-more-desc').html(`<b>${i} ${d.name}</b><br/>${d.desc}<br/><span class='light-blue-text bw'><i class='fas fa-lightbulb'></i> Tip: ${d.tip}</span>`);
    }); 
    M.Modal.getInstance($('#modal-welcome')[0]).open();
  }, 
  next: function(){
    if(this.instance.center < 4){
      this.instance.next(); 
    } else{
      delete sessionStorage.isNew; 
      M.Modal.getInstance($('#modal-welcome')[0]).close();
    }
  }, 
  skip: function(){
    delete sessionStorage.isNew; 
    cbList.pushMessage({i: 'i', text: 'You can return to the welcome screen under Settings 🡒 About.'}); 
    M.Modal.getInstance($('#modal-welcome')[0]).close();
  }
}

// Remove pendingSudo hooks used by courseHistory 