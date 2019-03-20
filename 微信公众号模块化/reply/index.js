const sha1 = require('sha1');
const {dealUserDataAsync, userDataToJsObj, formatJsObj} = require('../utils/tools');
const tools = require('../utils/tools');
const template = require('./template');
/*中间件函数模块*/
module.exports = () => {
    return async (req, res) => {

        const {signature, echostr, timestamp, nonce} = req.query;
        const token = 'atDate1314';

        //1）将token、timestamp、nonce三个参数进行字典序排序
        // 2）将三个参数字符串拼接成一个字符串进行sha1加密
        const sha1Str = sha1([token, timestamp, nonce].sort().join(''));

        // 3）开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
        /*
            如果请求方式是get，那么是微信服务器发来的消息
            如果请求方式是post,那么是客户端发来的消息
        */
        if (req.method === 'GET') {
            if (sha1Str === signature) {
                res.end(echostr);
            } else {
                res.send('error');
            }
        } else if (req.method === 'POST') {

            //如果不是微信服务器发来的消息就不再执行后面的代码
            if (sha1Str !== signature) {
                res.send('error');
                return;
            }
            //用异步的方法来处理用户发来的消息,函数返回一个promise对象
            const xmlData = await dealUserDataAsync(req);

            //将上面的数据转为js对象，先引入xml2js包
            const dataObj = userDataToJsObj(xmlData);

            //格式化js对象
            const userData = formatJsObj(dataObj);

            let options = {
                toUserName: userData.FromUserName,
                fromUserName: userData.ToUserName,
                createTime: Date.now(),
                type: 'text',
                content: '请说人话'
            }
            //返回消息给用户
            if (userData.Content === '1') {
                options.content = '你要和我玩游戏吗？';
            } else if (userData.Content && userData.Content.indexOf('2') !== -1) {
                //indexOf：字符串中含有参数就返回参数的下标，不含有就返回-1
                options.content = '你要和我聊天吗？';
            }
            //返回消息给用户
            if (userData.Content === '1') {
                options.content = '你要和我玩游戏吗？';
            } else if (userData.Content && userData.Content.indexOf('2') !== -1) {
                //indexOf：字符串中含有参数就返回参数的下标，不含有就返回-1
                options.content = '你要和我聊天吗？';
            }

            //返回的数据必须是xml格式
            if(userData.MsgType === 'image'){
                options.mediaId = userData.MediaId
                options.type = 'image';
            }

            const replayMsg = template(options);
            res.send(replayMsg);
        } else {
            res.send('error');
        }


    }

}

