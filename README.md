#### 仿滴滴预约打车IOS风格时间选择器在线预览地址(PC请切换到移动端模式打开)

>[http://codepen.io/jawil/full/WRBxya/](http://codepen.io/jawil/full/WRBxya/)

 ```
  * [datePicker plugin]
  * IOS风格日期选择器,仿滴滴打车预约用车时间选择器
  * @Author  jawil
  * @date    2017-02-17
  * @param   {[object]}   options [配置参数]
 ```

#### 运行预览

1. cd datePicker
2. npm install
3. npm run dev


#### 示例：

 ```
 <script src="dist/date-picker.min.js"></script>
 
 datePicker({
     appointDays: 7, //默认可以预约未来7天
     
     preTime: 20, //默认只能预约20分钟之后,如果两个小时就填120
     
     disMinute: 1, //分钟的间隔，默认一分钟

     callBack: function(timeStr, timeStamp) {//点击确认获取到的时间戳和时间字符串
         console.log(timeStr, timeStamp)
     }Ï
     
 })
 ```
点击确认之后，回到函数callback可以拿到选择的时间字符串和时间戳。


#### 效果图

<img src="http://oo2r9rnzp.bkt.clouddn.com/WX20170411-212505@2x.png" width="50%" height="50%">

