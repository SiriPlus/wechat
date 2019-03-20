/*定义6种回复用户消息的模板*/

module.exports = (options) => {

    let replayMsg = `<xml>
                      <ToUserName><![CDATA[${options.toUserName}]]></ToUserName>
                      <FromUserName><![CDATA[${options.fromUserName}]]></FromUserName>
                      <CreateTime>${options.createTime}</CreateTime>
                      <MsgType><![CDATA[${options.type}]]></MsgType>`

    if(options.type === 'text'){
        replayMsg += ` <Content><![CDATA[${options.content}]]></Content>`
    }else if(options.type === 'image'){
        replayMsg += `<Image>
                       <MediaId><![CDATA[${options.mediaId}]]></MediaId>
                      </Image>`
    }else if(options.type === 'voice'){
        replayMsg += `<Voice>
                      <MediaId><![CDATA[${options.mediaId}]]></MediaId>
                      </Voice>`
    }else if(options.type === 'video'){
        replayMsg += `<Video>
                        <MediaId><![CDATA[${options.mediaId}]]></MediaId>
                        <Title><![CDATA[${options.title}]]></Title>
                        <Description><![CDATA[${options.description}]]></Description>
                      </Video>`
    }else if(options.type === 'music'){
        replayMsg += `<Music>
                        <Title><![CDATA[${options.title}]]></Title>
                        <Description><![CDATA[${options.description}]]></Description>
                        <MusicUrl><![CDATA[${options.musicUrl}]]></MusicUrl>
                        <HQMusicUrl><![CDATA[${options.hqMusicUrl}]]></HQMusicUrl>
                        <ThumbMediaId><![CDATA[${options.thumbMediaId}]]></ThumbMediaId>
                      </Music>`
    }else if(options.type === 'news'){
        replayMsg += `<ArticleCount>${options.content.length}</ArticleCount>
                      <Articles>`

        replayMsg += options.content.reduce((pre,cur) => {
            return pre + `<item>
                          <Title><![CDATA[${cur.title}]]></Title>
                          <Description><![CDATA[${cur.direction}]]></Description>
                          <PicUrl><![CDATA[${cur.picUrl}]]></PicUrl>
                          <Url><![CDATA[${cur.url}]]></Url>
                        </item>`

        },'');

        replayMsg += `</Articles>`
    }

    replayMsg += `</xml>`

    return replayMsg;
}


