//引入模块,用于node服务器向微信服务器发送请求
const rp = require('request-promise-native');
const fetchAccessToken = require('./getAccessToken');
//用写入数据的方式将access_token保存到一个文件中
// const { writeFile, readFile } = require('fs');
const {writeFile, readFile} = require('../utils/tools');
//定义一个获取ticket的函数，可以复用
async function getTicket(){
    //获取access_token
    const {access_token} = await fetchAccessToken();
    //请求地址
    const url  = `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${access_token}&type=jsapi`;

    //发送请求，请求方式是get
    const reqResult = await rp({method: 'GET', url, json: true});
    const result = {
        ticket: reqResult.ticket,
        expires_in: reqResult.expires_in
    }
    //计算ticket的过期时间，2小时更新一次，提前5分钟更新
    let expires_in = Date.now() + 7200000 - 300000

    //将ticket保存到一个文本文件中
    //son.stringify()：将json数据转换为字符串
    await writeFile('./ticket.txt', result);
    return result;
}

function fetchTicket(){
       return readFile('./ticket.txt')
        .then(res => {
            //判断ticket时间有没有过期
            if( expires_in < Data.now()){
                //ticket过期,调用getTicket方法重新获取
                return getTicket();
            }else{
                //ticket没有过期
                return res;
            }
        })
        .catch(err => {
            return getTicket();
        })

        console.log(result)
}
module.exports = fetchTicket;

(async ()=>{
  await fetchTicket();
})()

