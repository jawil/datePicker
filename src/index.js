 /**
  * [datePicker plugin]
  * IOS风格日期选择器,仿滴滴打车预约用车时间选择器
  * @Author  jawil
  * @date    2017-02-17
  * @param   {[object]}   options [配置参数]
  */

 import Picker from './datePicker.js'

 const DEFAULT_OPTIONS = {
     appointDays: 7, //默认可以预约未来7天
     preTime: 20, //默认只能预约20分钟之后,如果两个小时就填120
     disMinute: 1, //分钟的间隔，默认一分钟
     callBack: function(timeStr, timeStamp) { //点击确认获取到的时间戳和时间字符串
         console.log(timeStr, timeStamp)
     }
 }

 function datePicker(options = {}) {

     const CHOICE_OPTIONS = function() {
         for (let attr in options) {
             DEFAULT_OPTIONS[attr] = options[attr]
         }
         return DEFAULT_OPTIONS
     }()

     const
         callBack = CHOICE_OPTIONS.callBack,
         app_day = CHOICE_OPTIONS.appointDays,
         pre_min = CHOICE_OPTIONS.preTime % 60,
         dis_min = CHOICE_OPTIONS.disMinute,
         pre_hour = Math.floor(DEFAULT_OPTIONS.preTime / 60)

     // 符合条件的数据
     let filter = { day: [], hour: [], minute: [] }

     // 原始数据
     let original = { day: [], hour: [], minute: [] }

     // 用户最终选择的日期
     let selected = { year: '', day: '', hour: '', minute: '' }

     // 开头第一个符合条件的日期
     let start = { hour: '', minute: '', hourArr: [], minuteArr: [] }

     //初始化日期,获得当前日期
     const current = function() {
         let date = new Date()
         return {
             year: date.getFullYear(),
             month: date.getMonth() + 1,
             day: date.getDate(),
             hour: date.getHours() + pre_hour,
             minute: date.getMinutes()
         }

     }()

     // 获取符合条件的预约天数
     filter.day = function() {
         let timeStamp = Date.now(),
             daysArr = []
         for (let i = 0; i < app_day; i++) {
             let preStamp = timeStamp + 24 * 60 * 60 * 1000 * i,
                 date = new Date(preStamp),
                 preYear = date.getFullYear(),
                 preMonth = date.getMonth() + 1,
                 preDay = date.getDate()
             switch (i) {
                 case 0:
                     daysArr.push({ text: '今天', year: preYear, month: preMonth, day: preDay })
                     break
                 case 1:
                     daysArr.push({ text: '明天', year: preYear, month: preMonth, day: preDay })
                     break
                 case 2:
                     daysArr.push({ text: '后天', year: preYear, month: preMonth, day: preDay })
                     break
                 default:
                     daysArr.push({ text: `${preMonth}月${preDay}日`, year: preYear, month: preMonth, day: preDay })
                     break
             }
         }

         //如果是今天的23:30以后预约车,那么今天的就不能预约
         if (current.hour == 23 && current.minute >= 60 - pre_min) {
             daysArr.shift()
         }
         return daysArr
     }()

     // 获取符合条件的预约小时数
     filter.hour = function() {
         let hoursArr = []
         for (let i = current.hour; i < 24; i++) {
             hoursArr.push(i)
             start.hourArr.push(i)
         }

         // 如果当前的分钟超过pre_min(假设pre_min=30),则小时只能从下一个小时选择,当前时间3:40=>4:10
         if (current.minute + pre_min > 60 - dis_min) {
             hoursArr.shift()
             start.hourArr.shift()
         }

         // 如果hoursArr没有数据,说明今天已经不能预约,明天任何小时都可以预约
         if (!hoursArr.length) {
             for (let h = 0; h < 24; h++) {
                 hoursArr.push(h)
                 start.hourArr.push(h)
             }
         }
         return hoursArr
     }()

     // 获取符合条件的预约小时数
     filter.minute = function() {
         let minutesArr = []
         for (let i = Math.ceil(current.minute / dis_min) * dis_min + pre_min; i < 60; i += dis_min) {
             minutesArr.push(i)
             start.minuteArr.push(i)
         }
         //如果分钟没有满足条件的,说明现在已经30分以后,小时会自动加1
         if (!minutesArr.length) {
             for (let i = Math.ceil((current.minute + pre_min - 60) / dis_min) * dis_min; i < 60; i += dis_min) {
                 minutesArr.push(i)
                 start.minuteArr.push(i)
             }
         }
         return minutesArr
     }()

     // 初始化数据
     const initData = function() {
         for (let h = 0; h < 24; h++) {
             original.hour.push(h)
         }
         for (let m = 0; m < 60; m += dis_min) {
             original.minute.push(m)
         }
         selected.day = filter.day[0]
         selected.hour = start.hour = filter.hour[0]
         selected.minute = start.minute = filter.minute[0]

     }()

     let wheel = document.querySelectorAll('.wheel-scroll'),
         wheelDay = wheel[0],
         wheelHour = wheel[1],
         wheelMinute = wheel[2]

     //初始化html结构
     const initHtml = function() {
         let wheelDayHtml = '',
             wheelHourHtml = '',
             wheelMinuteHtml = ''

         filter.day.forEach(ele => {
             wheelDayHtml += `<li class="wheel-item">${ele.text}</li>`
         })

         filter.hour.forEach(ele => {
             wheelHourHtml += `<li class="wheel-item">${ele}点</li>`
         })

         filter.minute.forEach(ele => {
             wheelMinuteHtml += `<li class="wheel-item">${ele}分</li>`
         })

         wheelDay.innerHTML = wheelDayHtml
         wheelHour.innerHTML = wheelHourHtml
         wheelMinute.innerHTML = wheelMinuteHtml
     }()

     new Picker(wheelDay, 0)
     new Picker(wheelHour, 0)
     new Picker(wheelMinute, 0)

     Object.defineProperty(wheelDay, 'index', {
         set: function(value) {
             if (value !== 0) { //当前预约时间不是今天

                 createHTML(wheelHour, original.hour, '点')
                 createHTML(wheelMinute, original.minute, '分')
                 start.hourArr = original.hour
                 start.minuteArr = original.minute
                 let hourIndex = original.hour.indexOf(selected.hour)
                 let minuIndex = original.minute.indexOf(selected.minute)
                 new Picker(wheelHour, hourIndex)
                 new Picker(wheelMinute, minuIndex)

             } else { //当前预约时间是今天

                 createHTML(wheelHour, filter.hour, '点')
                 start.hourArr = filter.hour
                 let index = selected.hour < start.hour ? 0 : filter.hour.indexOf(selected.hour)
                 new Picker(wheelHour, index)
                 selected.hour = filter.hour[index]

                 if (index === 0) {
                     let minuIndex = selected.minute < start.minute ? 0 : filter.minute.indexOf(selected.minute)
                     createHTML(wheelMinute, filter.minute, '分')
                     start.minuteArr = filter.minute
                     new Picker(wheelMinute, minuIndex)
                     selected.minute = filter.minute[minuIndex]
                 } else {
                     let index = original.minute.indexOf(selected.minute)
                     createHTML(wheelMinute, original.minute, '分')
                     start.minuteArr = original.minute
                     new Picker(wheelMinute, index)
                 }

             }
         }
     })

     // 监测小时的变化，会影响分钟的变化
     Object.defineProperty(wheelHour, 'current', {
         set: function(value) {

             selected.hour = start.hourArr[value]

             if (value !== 0 || wheelDay.current) { //时间不是此刻，分钟可以任意选择

                 let index = original.minute.indexOf(selected.minute)
                 createHTML(wheelMinute, original.minute, '分')
                 start.minuteArr = original.minute
                 new Picker(wheelMinute, index)

             } else { // 预约时刻是当前时刻，校验分钟时刻是否需要重置

                 let index = selected.minute < start.minute ? 0 : filter.minute.indexOf(selected.minute)
                 selected.minute = filter.minute[index]
                 createHTML(wheelMinute, filter.minute, '分')
                 start.minuteArr = filter.minute
                 new Picker(wheelMinute, index)

             }
         }
     })

     Object.defineProperty(wheelMinute, 'current', {
         set: function(value) {
             selected.minute = start.minuteArr[value]
         }
     })


     function createHTML(ele, arr, unit) {
         let innerHTML = ''
         arr.forEach(item => {
             innerHTML += `<li class="wheel-item">${item+unit}</li>`
         })

         ele.innerHTML = innerHTML
     }

     const confirmTime = e => {
         e.preventDefault()
         e.stopPropagation()
         let index = wheelDay.current || 0
         const minute = selected.minute,
             hour = selected.hour,
             day = filter.day[index].day,
             month = filter.day[index].month,
             year = filter.day[index].year

         // IOS版本浏览器不兼容new Date('2017-04-11')这种格式化，故用new Date('2017/04/11')
         let timeStamp = new Date(`${year}/${month}/${day} ${hour}:${minute}`).getTime(),
             timeStr = `${filter.day[index].text} ${hour}点${minute}分`

         callBack && callBack(timeStamp, timeStr)
         document.querySelector('.mf-picker').style.display = 'none'
     }

     //显示隐藏
     const toggle = e => {
         e.preventDefault()
         e.stopPropagation()
         document.querySelector('.mf-picker').style.display = 'none'
     }
     document.querySelector('.confirm').addEventListener('touchend', confirmTime, false)
     document.querySelector('.cancel').addEventListener('touchend', toggle, false)
     document.querySelector('.mf-picker').addEventListener('touchend', toggle, false)

 }

 module.exports = datePicker