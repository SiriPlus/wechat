//引入xml2js包，并调用parseString方法
const {parseString} = require('xml2js');
module.exports = {

    //用异步的方法来处理用户发来的消息
    dealUserDataAsync(req) {
        return new Promise((resolve, reject) => {
            let xmlData = '';

            req.on('data',data => {
                xmlData += data.toString();
            })

            req.on('end',() => {
                resolve(xmlData);
            })
        })
    },

    //将xml数据转换为js对象
    userDataToJsObj(xmlData){

        //将上面的数据转为js对象，先引入xml2js包
        let dataObj = null;
        parseString(xmlData, {trim: true}, (err, result) => {
            if(!err){
                dataObj = result;
            }else{
                dataObj = {};
            }
        })

        return dataObj;
    },

    //格式化js对象
    formatJsObj(dataObj){
        const {xml} = dataObj;
        let userData = {};
        for (let item in xml){
            const value = xml[item];
            userData[item] = value[0];
        }
        return userData;
    }

}