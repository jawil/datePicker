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
3. npm run dev(浏览器预览)
4. npm run build(生成dist目录)


#### 示例：

 ```JavaScript
 // UMD兼容规范，支持浏览器直接引入，require，define等多种JS模块化引入
 <script src="dist/date-picker.min.js"></script>
 
 datePicker({
     afterDay: 0, // 第几天后开始可以预约，默认是今天
     
     appointDays: 7, // 默认可以预约未来7天
     
     minuteLater: 20, // 当天的话，默认只能预约20分钟之后,如果两个小时就填120
     
     hourArea: [9, 22], // 预约小时可选的范围，默认是9：00-22：00
     
     interval: 1, // 分钟的间隔，默认一分钟
     
     callBack: function(timeStr, timeStamp) { // 点击确认获取到的时间戳和时间字符串
         console.log(timeStr, timeStamp)
     }
     
 })
 ```
点击确认之后，回到函数callback可以拿到选择的时间字符串和时间戳。


#### 效果图

![](http://oo2r9rnzp.bkt.clouddn.com/WX20170411-212505@2x.png)


**有问题可以邮件联系我，欢迎提Issue和Pre**
