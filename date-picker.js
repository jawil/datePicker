 /**
  * [datePicker plugin]
  * IOS风格日期选择器,仿滴滴打车预约用车时间选择器
  * @Author  jawil
  * @date    2017-02-17
  * @param   {[string]}   timeStr [返回的时间字符串存在sessionStorage里面]
  * @param   {[long]}     timeStamp [返回的时间戳存在sessionStorage里面]
  * @get  {[type]}        var timeStr= sessionStorage.getItem('timeStr');
  * @get  {[type]}        var timeStamp= sessionStorage.getItem('timeStamp');
  */



 ! function() {
     'use strict'
     let daysArr = []
     let hoursArr = []
     let minutesArr = []

     //用户最终选择日期
     let selectedYear = ''
     let selectedDay = ''
     let selectedHour = ''
     let selectedMinute = ''


     //初始化的时间
     let initHour, initMinute
     let initHourArr = []
     let initMinuteArr = []
     let isToday = true


     //初始化日期,获得当前日期
     let date = new Date()
     let currentYear = date.getFullYear()
     let currentMonth = date.getMonth() + 1
     let currentDay = date.getDate()
     let currentHours = date.getHours()
     let currentMinutes = date.getMinutes()
         //获取当前月有多少天
     let DayNumOfMonth = new Date(currentYear, currentMonth, 0).getDate()
         //获取daysArr
     let remainDay = DayNumOfMonth - currentDay


     //筛选符合条件的日期
     const filterDate = (f => {
         switch (remainDay) {
             case 0:
                 daysArr = [
                     `今天(${currentMonth}月${currentDay}日)`,
                     `明天(${(currentMonth+1)%12}月1日)`,
                     `后天(${(currentMonth+1)%12}月2日)`
                 ];
                 break;
             case 1:
                 daysArr = [
                     `今天(${currentMonth}月${currentDay}日)`,
                     `明天(${currentMonth}月${currentDay+1}日)`,
                     `后天(${(currentMonth+1)%12}月${1}日)`
                 ];
                 break;
             default:
                 daysArr = [
                     `今天(${currentMonth}月${currentDay}日)`,
                     `明天(${currentMonth}月${currentDay+1}日)`,
                     `后天(${currentMonth}月${currentDay+2}日)`
                 ];
                 break;
         }

         //如果是今天的23:30以后预约车,那么今天的就不能预约
         if (currentHours == 23 && currentMinutes >= 30) {
             daysArr.shift()
         }

         for (let i = currentHours; i < 24; i++) {
             hoursArr.push(i)
             initHourArr.push(i)
         }

         //如果当前的分钟超过30,则小时只能从下一个小时选择,当前时间3:40=>4:10
         if (currentMinutes + 30 > 55) {
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

         for (let j = Math.ceil(currentMinutes / 5) * 5 + 30; j < 60; j += 5) {
             minutesArr.push(j)
             initMinuteArr.push(j)
         }

         //如果分钟没有满足条件的,说明现在已经30分以后,小时会自动加1
         if (!minutesArr.length) {
             for (let k = Math.ceil((currentMinutes - 30) / 5) * 5; k < 60; k += 5) {
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


     let wheel = document.querySelectorAll('.wheel-scroll');
     let wheelDay = wheel[0]
     let wheelHour = wheel[1]
     let wheelMinute = wheel[2]



     //初始化html结构
     const initHtml = (f => {
         let wheelDayHtml = ''
         let wheelHourHtml = ''
         let wheelMinuteHtml = ''
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
     })();


     //仿IOS日期风格选择器
     class datePicker {
         constructor(obj, initIndex = 0, callback) {
             this.obj = obj
             this.index = -initIndex
             this.callback = callback
             this.deg = 25 //初始化偏转的角度
             this.length = this.obj.children.length
             this.distance = this.obj.children[0].offsetHeight
             this.ready()
         }
         static setTranslate3d(obj, dis) {
             obj.style.transform = `translate3d(0,${dis}px,0)`
         }
         static setRotateX(obj, index, deg = 25) {
             //设置每个Li的偏转角度
             Array.from(obj).forEach((ele, i) => {
                 obj[i].style.transform = `rotateX(${(i+index)*deg}deg)`
             })
         }
         ready() {
             //初始化运动距离
             datePicker.setTranslate3d(this.obj, this.index * this.distance)
                 //初始化3D偏转角度
             datePicker.setRotateX(this.obj.children, this.index)
             this.bind(this.obj)
         }
         bind(selector) {
             let iStartPageY = 0
             let step = 1 //弹性系数
             let prevPoint = 0
             let speed = 0 //手指离开时候的瞬时速度,速度越大,最后停留的越远
             let timer = null
             let length = this.length - 1
             const touchstart = e => {
                 e.preventDefault()
                 e.stopPropagation()
                 clearInterval(timer)
                 iStartPageY = e.changedTouches[0].clientY
                 prevPoint = iStartPageY
             }
             const touchmove = e => {
                 e.preventDefault()
                 e.stopPropagation()
                 let iDisY = (e.changedTouches[0].pageY - iStartPageY)
                 speed = (e.changedTouches[0].pageY - prevPoint)
                 prevPoint = e.changedTouches[0].pageY
                     //已滑动在头部或尾部,但是用户还想往上或下滑,这是给一种越往上或下滑越难拖动的体验
                 if (this.index == 0 && iDisY > 0 || this.index == -length && iDisY < 0) {
                     step = 1 - Math.abs(iDisY) / selector.clientWidth //根据超出长度计算系数大小，超出的越到 系数越小
                     step = Math.max(step, 0) //系数最小值为0
                     iDisY = parseInt(iDisY * step)
                 }
                 datePicker.setTranslate3d(selector, this.index * this.distance + iDisY)
                 datePicker.setRotateX(this.obj.children, this.index + iDisY / this.distance)
             };
             const touchend = e => {
                 e.preventDefault()
                 e.stopPropagation()
                 let iDisX = e.changedTouches[0].pageY - iStartPageY
                     //初速度很小的逻辑处理
                 let flag = false
                 if (Math.abs(speed) <= 1) {
                     flag = true
                 }
                 timer = setInterval(f => {
                     if (Math.abs(speed) <= 1) {
                         clearInterval(timer)
                         if (flag) {
                             this.index += Math.round(iDisX / this.distance)
                         }
                         this.index = this.index > 0 ? Math.min(this.index, 0) : Math.max(this.index, -length)
                         this.index = this.index > 0 ? 0 : (this.index < -length ? -length : this.index);
                         selector.style.transitionDuration = '400ms'
                         Array.from(selector.children).forEach(ele => {
                             ele.style.transitionDuration = '200ms'
                         });
                         datePicker.setTranslate3d(selector, this.index * this.distance)
                         setTimeout(f => {
                             selector.style.transitionDuration = '0ms'
                             Array.from(selector.children).forEach(ele => {
                                 ele.style.transitionDuration = '0ms'
                             })
                         }, 0)

                         datePicker.setRotateX(this.obj.children, this.index)
                         this.callback && this.callback(Math.abs(this.index))
                     } else {
                         speed *= 0.2
                         iDisX += speed
                         this.index += Math.round(iDisX / this.distance)
                     }
                 }, 13);
             }
             selector.addEventListener("touchstart", touchstart, false)
             selector.addEventListener("touchmove", touchmove, false)
             selector.addEventListener("touchend", touchend, false)
         }
     }



     new datePicker(wheelDay, 0, indexDay => {
         let wheelHourHtml = ''
         let wheelMinuteHtml = ''
             //明天或者后天
         selectedDay = daysArr[indexDay]
         if (indexDay == 1 || indexDay == 2) {
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

             new datePicker(wheelHour, hindex, indexHour => {
                 selectedHour = hoursArr[indexHour]
             })

             //天数选择影响分钟
             minutesArr = [];
             for (let m = 0; m < 60; m += 5) {
                 minutesArr.push(m)
             }
             let mindex = minutesArr.indexOf(selectedMinute)
             wheelMinuteHtml = ''
             minutesArr.forEach((ele) => {
                 wheelMinuteHtml += `<li class="wheel-item">${ele}分</li>`;
             })
             wheelMinute.innerHTML = wheelMinuteHtml
             new datePicker(wheelMinute, mindex, indexMinute => {
                 selectedMinute = minutesArr[indexMinute];
             })
         } //今天
         else if (indexDay == 0) {
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
             new datePicker(wheelHour, hindex, indexHour => {
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
                 new datePicker(wheelMinute, mindex, indexMinute => {
                     selectedMinute = minutesArr[indexMinute]
                 })
             }
         }
     })


     new datePicker(wheelHour, 0, indexHour => {
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
             new datePicker(wheelMinute, mindex, indexMinute => {
                 selectedMinute = minutesArr[indexMinute]
             })
         } else {
             minutesArr = []
             for (let m = 0; m < 60; m += 5) {
                 minutesArr.push(m)
             }
             let mindex = minutesArr.indexOf(selectedMinute)
             minutesArr.forEach(ele => {
                 wheelMinuteHtml += `<li class="wheel-item">${ele}分</li>`
             });
             wheelMinute.innerHTML = wheelMinuteHtml
             new datePicker(wheelMinute, mindex, indexMinute => {
                 selectedMinute = minutesArr[indexMinute]
             })
         }
     });

     new datePicker(wheelMinute, 0, indexMinute => {
         selectedMinute = minutesArr[indexMinute]
     });

    //获得最后选择的日期
     const confirmTime = e => {
         e.preventDefault()
         e.stopPropagation()
         const minute = selectedMinute
         const hour = selectedHour
         const day = parseInt(selectedDay.split('月')[1])
         const month = parseInt(selectedDay.split('(')[1])
         const year = (month == 1 && day <= 2) ? currentYear + 1 : currentYear
         let timeStamp = new Date(`${year}/${month}/${day} ${hour}:${minute}`).getTime()
         let timeStr = `${selectedDay} ${hour}点${minute}分`
         sessionStorage.setItem('timeStamp', timeStamp);
         sessionStorage.setItem('timeStr', timeStr);
         document.querySelector('.bookTime').innerHTML = timeStr;
         console.log(year, month, day, hour, minute, timeStamp, timeStr)
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


 }()
