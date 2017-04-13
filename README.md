#### 仿滴滴预约打车IOS风格时间选择器在线预览地址(PC请切换到移动端模式打开)

>[http://codepen.io/jawil/full/WRBxya/](http://codepen.io/jawil/full/WRBxya/)

 ```
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
 ```

#### 示例：

 ```
 datePicker({
     appointDays: 7, //默认可以预约未来7天
     
     preTime: 20, //默认只能预约20分钟之后,如果两个小时就填120
     
     disMinute: 1 //分钟的间隔，默认一分钟
     
 })
 ```
　点击确认之后，时间和字符串存到在sessionstorage里面：

```
var timeStr= sessionStorage.getItem('timeStr')
var timeStamp= sessionStorage.getItem('timeStamp')
```

#### 效果图

<img src="http://oo2r9rnzp.bkt.clouddn.com/WX20170411-212505@2x.png" width="50%" height="50%">

