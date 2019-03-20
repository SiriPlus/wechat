const express = require('express');
const sha1 = require('sha1');
//引入xml2js包，并调用parseString方法
const {parseString} = require('xml2js');
const app = express();

app.use(async (req,res) => {
    //req.query：微信发送过来的请求参数
    /*
    { signature: 'ccbcc35fb9738cf3fc5098e6effbe21bf46abb06',
      echostr: '6792175310584781206',
      timestamp: '1552979986',
      nonce: '1280665302' }
     */
    // console.log(req.query);
    //
    const {signature, echostr, timestamp, nonce} = req.query;
    const token = 'atDate1314';

    //1）将token、timestamp、nonce三个参数进行字典序排序
    const sortedArr = [token, timestamp, nonce].sort();

    // 2）将三个参数字符串拼接成一个字符串进行sha1加密
    const sha1Str = sha1(sortedArr.join(''));
    /*sha1Str:cbcc35fb9738cf3fc5098e6effbe21bf46abb06*/
    // console.log(sha1Str);

    // 3）开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
    /*
        如果请求方式是get，那么是微信服务器发来的消息
        如果请求方式是post,那么是客户端发来的消息
    */
    if(req.method === 'GET'){
        if(sha1Str === signature){
            //来自微信服务器发送的消息
            res.end(echostr);
        }else{
            //不是来自微信服务器发送的消息
            res.send('error');
        }
    }else if(req.method === 'POST'){
        /*客户端发来的消息*/
       const xmlDatas = await new Promise((resolve,reject) => {
            let xmlData = '';
            //使用读取文件流的方式来读取用户发来的消息,结果是一个buffer串
            req.on('data',data => {
                //将buffer串转为字符串
                xmlData += data.toString();
                // console.log(xmlData)
                /*
                     <xml><ToUserName><![CDATA[gh_edf86c358be0]]></ToUserName>
                     <FromUserName><![CDATA[oX5pJ6C5PvjqJyF98b9A3RpybhvE]]></FromUserName>
                     <CreateTime>1552982287</CreateTime>
                     <MsgType><![CDATA[text]]></MsgType>
                     <Content><![CDATA[1]]></Content>
                     <MsgId>22233360206016634</MsgId>
                     </xml>
                 */
            })

            req.on('end',() => {
                //数据接收完毕
                resolve(xmlData);
            })
        })

        //将上面的数据转为js对象，先引入xml2js包
        let dataObj = null;
        parseString(xmlDatas, {trim: true}, (err, result) => {
            if(!err){
                dataObj = result;
            }else{
                dataObj = {};
            }
        })
        // console.log(dataObj);
        /*
        { xml:
        { ToUserName: [ 'gh_edf86c358be0' ],
            FromUserName: [ 'oX5pJ6C5PvjqJyF98b9A3RpybhvE' ],
            CreateTime: [ '1552990560' ],
            MsgType: [ 'text' ],
            Content: [ '1' ],
            MsgId: [ '22233478305140621' ] } }
            */
        //格式化js对象
        const {xml} = dataObj;
        let userData = {};
        for (let item in xml){
            const value = xml[item];
            userData[item] = value[0];
        }
        // console.log(userData)
        /*
        { ToUserName: 'gh_edf86c358be0',
            FromUserName: 'oX5pJ6C5PvjqJyF98b9A3RpybhvE',
            CreateTime: '1552991876',
            MsgType: 'text',
            Content: '1',
            MsgId: '22233497110886585' }
            */

        //返回消息给用户
        let replayContent = '请说人话';
        if(userData.Content === '1'){
            console.log(11)
            replayContent = '你要和我玩游戏吗？';
        }else if(userData.Content && userData.Content.indexOf('2') !== -1){
            //indexOf：字符串中含有参数就返回参数的下标，不含有就返回-1
            replayContent = '你要和我聊天吗？';
        }

        //返回的数据必须是xml格式
        let replayMsg = `<xml>
                             <ToUserName><![CDATA[${userData.FromUserName}]]></ToUserName>
                             <FromUserName><![CDATA[${userData.ToUserName}]]></FromUserName>
                             <CreateTime>${Date.now()}</CreateTime>
                             <MsgType><![CDATA[text]]></MsgType>
                             <Content><![CDATA[${replayContent}]]></Content>
                        </xml>`
        res.send(replayMsg);
    }else {
        res.send('error');
    }

})

app.listen(3000,err => {
    if(!err){
    console.log('服务器启动成功');
    }else{
    console.log(err);
    }
})