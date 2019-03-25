const express = require('express');
const sha1 = require('sha1');
const replay = require('./reply/index');
const fetchTicket = require('./accessToken/getTicket');
const {url, appId} = require('./config/config');
const app = express();


//设置模板 资源目录
app.set('views', 'views');
//设置模板引擎
app.set('view engine', 'ejs');
app.use(express.static('image'));
//设置路由
app.get('/search',async function (req,res) {
    /*
  1. 参与签名的字段包括noncestr（随机字符串）, 有效的jsapi_ticket, timestamp（时间戳）, url（当前网页的URL，不包含#及其后面部分）。
  2. 对所有待签名参数按照字段名的ASCII 码从小到大排序（字典序）后，使用URL键值对的格式（即key1=value1&key2=value2…）拼接成字符串string1。
  3. 这里需要注意的是所有参数名均为小写字符。对string1作sha1加密，字段名和字段值都采用原始值，不进行URL 转义。
*/
    //获取jsapi_ticket
    const {ticket} = await fetchTicket();
    //时间戳
    const timestamp = Math.floor(Date.now() / 1000);
    //noncestr
    const noncestr = Math.random().toString().slice(2);
    //定义数组
    const arr = [
        `noncestr=${noncestr}`,
        `jsapi_ticket=${ticket}`,
        `url=${url}/search`,
        `timestamp=${timestamp}`
    ]
    const signature = sha1(arr.sort().join('&'))
    res.render('search', {noncestr, timestamp, signature, appId, url})

})

//不能讲中间件放在路由的上面，因为中间件没有调用next()方法，就不会执行路由
app.use(replay());
app.listen(3000,err => {
    if(!err){
    console.log('服务器启动成功');
    }else{
    console.log(err);
    }
})