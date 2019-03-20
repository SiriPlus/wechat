
module.exports = (userData) => {
    let options = {
        toUserName: userData.FromUserName,
        fromUserName: userData.ToUserName,
        createTime: Date.now(),
        type: 'text',
        content: '请说人话'
    }

//返回消息给用户
    if(userData.MsgType === 'text'){
        if (userData.Content === '1') {
            options.content = '你要和我玩游戏吗？';

        } else if (userData.Content && userData.Content.indexOf('2') !== -1) {
            //indexOf：字符串中含有参数就返回参数的下标，不含有就返回-1
            options.content = '你要和我聊天吗？';
        }
        }else if(userData.MsgType === 'voice'){
            //语音识别功能
            options.content = userData.Recognition;

        }else if(userData.MsgType === 'location'){
            options.content = `地理位置纬度：${userData.Location_X}
                               \n地理位置经度：${userData.Location_Y}
                              \n地图缩放大小：${userData.Scale}
                              \n地理位置信息：${userData.Label}`

        }else if(userData.MsgType === 'event'){
            if(userData.Event === 'subscribe'){
                options.content = '欢迎关注公众号~';

                if(userData.EventKey){
                    options.content = '欢迎扫描二维码关注~';
                }

            }else if(userData.Event === 'unsubscribe'){
                options.content = '无情取关';
                console.log('取关');

            }else if(userData.Event === 'CLICK'){
                options.content = '用户点击了菜单';
            }
        }
    return options;
}



