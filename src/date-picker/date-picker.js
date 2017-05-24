 /**
  * [datePicker plugin]
  * IOS风格日期选择器,仿滴滴打车预约用车时间选择器
  * @Author  jawil
  * @date    2017-02-17
  * @param   {[object]}   options [配置参数]
  */

 import pickerSlider from '../util/pickerSlider.js'

 'use strict'

 //默认配置
 const DEFAULT_OPTIONS = {
     appointDays: 7, //默认可以预约未来7天
     preTime: 20, //默认只能预约20分钟之后,如果两个小时就填120
     disMinute: 1, //分钟的间隔，默认一分钟
     callBack: function(timeStr, timeStamp) { //点击确认获取到的时间戳和时间字符串
         console.log(timeStr, timeStamp)
     }
 }

 function datePicker(options = {}) {
     //最终的配置
     const
         CHOICE_OPTIONS = Object.assign({}, DEFAULT_OPTIONS, options),
         callBack = CHOICE_OPTIONS.callBack,
         app = CHOICE_OPTIONS.appointDays,
         pre_min = CHOICE_OPTIONS.preTime % 60,
         dism = CHOICE_OPTIONS.disMinute,
         pre_hour = Math.floor(DEFAULT_OPTIONS.preTime / 60)

     let daysArr = [],
         hoursArr = [],
         minutesArr = [],

         //用户最终选择日期
         selectedYear = '',
         selectedDay = '',
         selectedHour = '',
         selectedMinute = '',


         //初始化的时间
         initHour, initMinute,
         initHourArr = [],
         initMinuteArr = [],
         isToday = true,


         //初始化日期,获得当前日期
         date = new Date(),
         currentYear = date.getFullYear(),
         currentMonth = date.getMonth() + 1,
         currentDay = date.getDate(),
         currentHours = date.getHours() + pre_hour,
         currentMinutes = date.getMinutes()


     //筛选符合条件的日期
     const filterDate = (f => {
         //获取当前月有多少天
         let timeStamp = Date.now()

         for (let i = 0; i < app; i++) {
             let preStamp = timeStamp + 24 * 60 * 60 * 1000 * i,
                 date = new Date(preStamp),
                 preYear = date.getFullYear(),
                 preMonth = date.getMonth() + 1,
                 preDay = date.getDate()
             switch (i) {
                 case 0:
                     daysArr.push(`今天(${preMonth}月${preDay}日)`)
                     break
                 case 1:
                     daysArr.push(`明天(${preMonth}月${preDay}日)`)
                     break
                 case 2:
                     daysArr.push(`后天(${preMonth}月${preDay}日)`)
                     break
                 default:
                     daysArr.push(`${preMonth}月${preDay}日`)
                     break
             }
         }

         //如果是今天的23:30以后预约车,那么今天的就不能预约
         if (currentHours == 23 && currentMinutes >= 60 - pre_min) {
             daysArr.shift()
         }

         for (let i = currentHours; i < 24; i++) {
             hoursArr.push(i)
             initHourArr.push(i)
         }

         //如果当前的分钟超过pre_min(假设pre_min=30),则小时只能从下一个小时选择,当前时间3:40=>4:10
         if (currentMinutes + pre_min > 60 - dism) {
             hoursArr.shift()
             initHourArr.shift()
         }

         //如果hoursArr没有数据,说明今天已经不能预约,明天任何小时都可以预约
         if (!hoursArr.length) {
             for (let h = 0; h < 24; h++) {
                 hoursArr.push(h)
                 initHourArr.push(h)
             }
         }

         for (let j = Math.ceil(currentMinutes / dism) * dism + pre_min; j < 60; j += dism) {
             minutesArr.push(j)
             initMinuteArr.push(j)
         }

         //如果分钟没有满足条件的,说明现在已经30分以后,小时会自动加1
         if (!minutesArr.length) {
             for (let k = Math.ceil((currentMinutes + pre_min - 60) / dism) * dism; k < 60; k += dism) {
                 minutesArr.push(k)
                 initMinuteArr.push(k)
             }
         }
     })()



     //初始化数据
     const initData = (f => {
         selectedDay = daysArr[0]
         selectedHour = initHour = initHourArr[0]
         selectedMinute = initMinute = initMinuteArr[0]
     })()


     let wheel = document.querySelectorAll('.wheel-scroll'),
         wheelDay = wheel[0],
         wheelHour = wheel[1],
         wheelMinute = wheel[2]



     //初始化html结构
     const initHtml = (f => {
         let wheelDayHtml = '',
             wheelHourHtml = '',
             wheelMinuteHtml = ''

         daysArr.forEach(ele => {
             wheelDayHtml += `<li class="wheel-item">${ele}</li>`
         })

         hoursArr.forEach(ele => {
             wheelHourHtml += `<li class="wheel-item">${ele}点</li>`
         })

         minutesArr.forEach(ele => {
             wheelMinuteHtml += `<li class="wheel-item">${ele}分</li>`
         })

         wheelDay.innerHTML = wheelDayHtml
         wheelHour.innerHTML = wheelHourHtml
         wheelMinute.innerHTML = wheelMinuteHtml
     })()



     new pickerSlider(wheelDay, 0, indexDay => {
         let wheelHourHtml = '',
             wheelMinuteHtml = ''
             //没有逗号，这个selectedDay是全局变量。。。
         selectedDay = daysArr[indexDay]
             //今天
         if (indexDay == 0) {
             isToday = true
                 //用户选择今天,但是此时的小时已不满足要求,小于当前时间,需要重置初始化小时选项
             hoursArr = initHourArr
             hoursArr.forEach(ele => {
                 wheelHourHtml += `<li class="wheel-item">${ele}点</li>`
             })
             wheelHour.innerHTML = wheelHourHtml
             let hindex = selectedHour < initHour ? 0 : hoursArr.indexOf(selectedHour)
                 //重置当前选择的时间,从明天滑回选择今天需要重置selectedHour
             selectedHour = hoursArr[hindex]
             new pickerSlider(wheelHour, hindex, indexHour => {
                     selectedHour = hoursArr[indexHour]
                 })
                 //用户选择今天,但是此时的分钟已不满足要求,小于当前时间,需要重置初始化分钟选项
             if (hindex === 0) {
                 minutesArr = initMinuteArr
                 minutesArr.forEach(ele => {
                     wheelMinuteHtml += `<li class="wheel-item">${ele}分</li>`
                 });
                 wheelMinute.innerHTML = wheelMinuteHtml
                 let mindex = selectedMinute < initMinute ? 0 : minutesArr.indexOf(selectedMinute)
                     //重置当前选择的时间,从明天滑回选择今天需要重置selectedMinute
                 selectedMinute = minutesArr[mindex]
                 new pickerSlider(wheelMinute, mindex, indexMinute => {
                     selectedMinute = minutesArr[indexMinute]
                 })
             }
             //明天或者后天
         } else {
             //天数选择影响小时
             isToday = false
             hoursArr = []
             for (let h = 0; h < 24; h++) {
                 hoursArr.push(h)
             }
             let hindex = hoursArr.indexOf(selectedHour)
             hoursArr.forEach((ele) => {
                 wheelHourHtml += `<li class="wheel-item">${ele}点</li>`
             })
             wheelHour.innerHTML = wheelHourHtml

             new pickerSlider(wheelHour, hindex, indexHour => {
                     selectedHour = hoursArr[indexHour]
                 })
                 //天数选择影响分钟
             minutesArr = [];
             for (let m = 0; m < 60; m += dism) {
                 minutesArr.push(m)
             }
             let mindex = minutesArr.indexOf(selectedMinute)
             wheelMinuteHtml = ''
             minutesArr.forEach((ele) => {
                 wheelMinuteHtml += `<li class="wheel-item">${ele}分</li>`;
             })
             wheelMinute.innerHTML = wheelMinuteHtml
             new pickerSlider(wheelMinute, mindex, indexMinute => {
                 selectedMinute = minutesArr[indexMinute];
             })
         }
     })


     new pickerSlider(wheelHour, 0, indexHour => {
         let wheelMinuteHtml = ''
         selectedHour = hoursArr[indexHour]
             //滑到头部,这是要处理分钟是否小于当前时间
         if (indexHour == 0 && isToday) {
             minutesArr = initMinuteArr
             minutesArr.forEach(ele => {
                 wheelMinuteHtml += `<li class="wheel-item">${ele}分</li>`
             });
             wheelMinute.innerHTML = wheelMinuteHtml
             let mindex = selectedMinute < initMinute ? 0 : minutesArr.indexOf(selectedMinute)
                 //重置当前选择的时间,从明天滑回选择今天需要重置selectedMinute
             selectedMinute = minutesArr[mindex]
             new pickerSlider(wheelMinute, mindex, indexMinute => {
                 selectedMinute = minutesArr[indexMinute]
             })
         } else {
             minutesArr = []
             for (let m = 0; m < 60; m += dism) {
                 minutesArr.push(m)
             }
             let mindex = minutesArr.indexOf(selectedMinute)
             minutesArr.forEach(ele => {
                 wheelMinuteHtml += `<li class="wheel-item">${ele}分</li>`
             });
             wheelMinute.innerHTML = wheelMinuteHtml
             new pickerSlider(wheelMinute, mindex, indexMinute => {
                 selectedMinute = minutesArr[indexMinute]
             })
         }
     })

     new pickerSlider(wheelMinute, 0, indexMinute => {
         selectedMinute = minutesArr[indexMinute]
     })

     //获得最后选择的日期
     const confirmTime = e => {
         e.preventDefault()
         e.stopPropagation()

         const minute = selectedMinute,
             hour = selectedHour,
             day = parseInt(selectedDay.split('月')[1]),
             month = parseInt(selectedDay.split('月')[0].slice(-1)),
             year = (month == 1 && day < app) ? currentYear + 1 : currentYear
             //IOS版本浏览器不兼容new Date('2017-04-11')这种格式化，故用new Date('2017/04/11')
         let timeStamp = new Date(`${year}/${month}/${day} ${hour}:${minute}`).getTime(),
             timeStr = `${selectedDay} ${hour}点${minute}分`

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

 export default datePicker