//引入xml2js包，并调用parseString方法
const {parseString} = require('xml2js');
const { writeFile, readFile } = require('fs');
const {resolve} = require('path');
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
    },

    //写入access_token和ticket到文件中
    writeFile(filePath, data){
        filePath = resolve(__dirname, '../accessToken', filePath);
       return new Promise( (resolve, reject) => {
            writeFile(filePath,JSON.stringify(data), err => {
                if (!err) resolve();
                else reject(err);
            })
        } )
    },

    //读取access_token和ticket文件中的内容
    readFile(filePath){
        filePath = resolve(__dirname, '../accessToken', filePath);
        return new Promise((resolve, reject) => {
            readFile(filePath, (err, data) => {
                if(!err){
                    resolve(JSON.parse(data.toString()));
                }else{
                    reject(err);
                }
            })
        })

    }

}