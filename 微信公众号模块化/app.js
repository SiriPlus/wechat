const express = require('express');
const app = express();
const replay = require('./reply/index');

app.use(replay());
app.listen(3000,err => {
    if(!err){
    console.log('服务器启动成功');
    }else{
    console.log(err);
    }
})