//引入模块
const rp = require('request-promise-native');
const fetchAccessToken = require('./getAccessToken');
const USER_PREFIX = 'https://api.weixin.qq.com/cgi-bin/';
//配置菜单项
const menu = {
    "button": [
    {
        "name": "租房社区🏩",
        "sub_button": [
            {
                "type": "scancode_waitmsg",
                "name": "进租房社区",
                "key": "renting_community",
            },
            {
                "type": "scancode_push",
                "name": "房源搜索",
                "key": "housing_search",
            },
            {
                "type": "scancode_push",
                "name": "打赏",
                "key": "play_tour",
            }
        ]
    },
    {
        "type":"view",
        "name": "加速租出😻",
        "url":"https://sz.lianjia.com/"
    },
    {
        "name": "杂货铺🍀",
        "sub_button": [
            {
                "type": "scancode_waitmsg",
                "name": "特惠门票",
                "key": "Preferential_tickets",
            },
            {
                "type": "scancode_push",
                "name": "名区黑名单",
                "key": "blacklist",
            },
            {
                "type": "scancode_push",
                "name": "进租房群",
                "key": "Rental_group_of",
            }
        ]
    }
]
}
//创建自定义菜单
async function creatMenu() {
    //获取access_token
    const { access_token } = await fetchAccessToken();
    //定义url
    const url = `${ USER_PREFIX }menu/create?access_token=${access_token}`;

    //发送请求,rp函数返回的是一个promise对象
   const result = await rp( {method: 'POST', url, json: true, body: menu} );

   return result;
}

//删除自定义菜单
async function deleteMenu() {
    //获取access_token
    const { access_token } = await fetchAccessToken();
    //定义url
    const url = `${ USER_PREFIX }menu/delete?access_token=${access_token}`;

    //发送请求,rp函数返回的是一个promise对象
    const result = await rp( {method: 'GET', url, json: true} );

    return result;

}

//创建标签
//函数的返回值为{ "tag" : { "name" : "tag" } }
async function createTag(name) {
    //获取access_token
    const {access_token} = await fetchAccessToken();
    //定义url
    const url = `${USER_PREFIX}tags/create?access_token=${access_token}`;
    //发送请求
   const result = await rp({ method: 'POST', url, json: true, body: { "tag" : {name}} });

   return result;
}


//获取标签下的粉丝列表
async function getFansList(tagid, next_openid) {
    //获取access_token
    const { access_token } = await fetchAccessToken();
    //定义url
    const url = `${USER_PREFIX}user/tag/get?access_token=${access_token}`;
    //发送请求
    //next_openid:一次只能拉取10000个粉丝列表，如果有超过10000个粉丝，那么得分批次获取粉丝列表，next_openid就是10000个粉丝列表的最后一个粉丝的id,下次拉取从这个id开始
    const result = await rp({ method: 'POST', url, json: true, body: { tagid, next_openid }});
    return result;
}

//批量为用户打标签
async function batchUserTags(openid_list, tagid) {
    //获取access_token
    const { access_token } = await fetchAccessToken();
    //定义url
    const url = `${USER_PREFIX}tags/members/batchtagging?access_token=${access_token}`;
    //发送请求
    const result = await rp({ method: 'POST', url, json: true, body: {openid_list , tagid}});
    return result;
}

//获取用户基本信息
async function userInfo(openid,lang) {
    //获取access_token
    const { access_token } = await fetchAccessToken();
    //定义url
    const url = `${USER_PREFIX}user/info?access_token=${access_token}&openid=${openid}&lang=${lang}`;
    //发送请求
    const result = await rp({ method: 'GET', url, json: true });
    return result;
}
(async () =>{
 await deleteMenu();
 await creatMenu();
 //createTag只能调用一次，不能创建同名的标签名
 let result = await createTag('tag11');
 console.log(result)
//createTag函数的返回值是一个JSON对象，所以要用对象.的方式来取得用户id
 let result2 = await batchUserTags(['oX5pJ6C5PvjqJyF98b9A3RpybhvE'],result.tag.id);
 console.log(result2);
 let result3 = await getFansList(result.tag.id);
 console.log(result3)
 let result4 = await userInfo('oX5pJ6C5PvjqJyF98b9A3RpybhvE','zh_CN');
 console.log(result4);

    /*{ subscribe: 1,
        openid: 'oX5pJ6C5PvjqJyF98b9A3RpybhvE',
        nickname: 'siri',
        sex: 1,
        language: 'zh_CN',
        city: '成都',
        province: '四川',
        country: '中国',
        headimgurl: 'http://thirdwx.qlogo.cn/mmopen/gWicbXPiajJn8bIhY2hbTOqdwQV1icgMibDmNCNoxEgmzgO1UM3ewHMWHp4eeI7cBlPciaV4nRrWric2f5iccpibRSg3cRQTLzyicQ4vj/132',
        subscribe_time: 1552981668,
        remark: '',
        groupid: 101,
        tagid_list: [ 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112 ],
        subscribe_scene: 'ADD_SCENE_QR_CODE',
        qr_scene: 0,
        qr_scene_str: '' }*/

})()
