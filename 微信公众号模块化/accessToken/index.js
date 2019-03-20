//引入模块
const rp = require('request-promise-native');
const fetchAccessToken = require('./getAccessToken');

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
    const url = `https://api.weixin.qq.com/cgi-bin/menu/create?access_token=${access_token}`;

    //发送请求,rp函数返回的是一个promise对象
   const result = await rp( {method: 'POST', url, json: true, body: menu} );

   return result;
}

//删除自定义菜单
async function deleteMenu() {
    //获取access_token
    const { access_token } = await fetchAccessToken();
    //定义url
    const url = `https://api.weixin.qq.com/cgi-bin/menu/delete?access_token=${access_token}`;

    //发送请求,rp函数返回的是一个promise对象
    const result = await rp( {method: 'GET', url, json: true} );

    return result;

}

(async () =>{
 console.log(await deleteMenu());
 console.log(await creatMenu());
})()
