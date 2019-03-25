//引入模块,用于node服务器向微信服务器发送请求
const rp = require('request-promise-native');
const {appId, appSecret} = require('../config/config');

//用写入数据的方式将access_token保存到一个文件中
const { writeFile, readFile } = require('fs');

//定义一个获取access_token的函数，可以复用
async function getAccessToken(){
    //请求地址
    const url  = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`;

    //发送请求，请求方式是get
    const reqResult = await rp({method: 'GET', url, json: true});
    //计算access_token的过期时间，2小时更新一次，提前5分钟更新
    const expires_in = Date.now() + 7200000 - 300000

    //将access_token保存到一个文本文件中
    //son.stringify()：将json数据转换为字符串
  await new Promise( (resolve, reject) => {
       writeFile('accessToken.txt',JSON.stringify(reqResult), err => {
           if (!err) resolve();
           else reject(err);

       })
   } )

    return reqResult;
}

//先读取access_token，判断有没有access_token
module.exports = function fetchAccessToken(){

  return new Promise((resolve, reject) => {
       readFile('./accessToken.txt', (err, data) => {
            if(!err){
                //有access_token
                resolve(JSON.parse(data.toString()));
            }else{
                //没有access_token
                reject(err);
            }
       })
   })

       .then(res => {
           //判断access_token时间有没有过期
           if( expires_in < Data.now()){
               //access_token过期,调用getAccessToken方法重新获取access_token
               return getAccessToken();
           }else{
               //access_token没有过期
               return res;
           }
       })
       .catch(err => {
           return getAccessToken();
       })
}

