var faceStr = "微笑,呲牙,害羞,色,苦笑,酷,发怒,飞吻,大舌头,抠鼻,偷笑,嘘,得意,享受,生病,顽皮,鄙视,难过,怒,惊呆了,委屈,流泪,哭泣,馋嘴,疑问,嘟嘴,眨眼,努力,吐舌,糟糕,不爽,傲慢,困,打瞌睡,不开心,好吧,呆,咧嘴,恶魔,晕,坏笑,打哈欠,可怜,吐,勾引,ok,握手,抱拳,点赞,胜利,奋斗,鼓掌,祈祷,握拳,手掌,no,爱心,心碎,拥抱,礼花,玫瑰,礼物,奖杯,红旗,高铁,地铁,单车,步行,飞机,互联网,公告,电脑,电话,公文包,钢笔,满分,对,错,感叹,警告,问号,top,结束,向上,向下,向左,向右,拳头,不要,不要不要,不赞,吻,睡觉,太阳,便便,爆筋,白天,夜晚,多云,彩虹,下雨,闪电,中国,蛋糕,炸弹,邮箱,刀,高跟鞋,唱歌,钓鱼,画画,酒杯,咖啡,麻将,射箭,足球,放大镜,录像,南瓜,圣诞老人,沙漏,手表,西瓜,回形针,枪,小狗,小猪,音乐,上,下,雪人,会议";
var faceArr = faceStr.split(',');
var faceWords = {};
for (var i = 0; i < faceArr.length; i++) {
    var imgUrl = '<img src="static/face/' + (i) + '.png" />',
        imgWordRegExp = "\\[" + faceArr[i] + "\\]";
    faceWords[imgWordRegExp] = imgUrl;
}
window.faceWords = faceWords;

module.exports = {
    Regexp_Emoji: /([\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[A9|AE]\u3030|\u3030)/ig,
    replaceToIcon(str) {
        for (var attr in window.faceWords) {
            str = str.replace(new RegExp(attr, "g"), faceWords[attr]);
        }
        return str;
    },
    //将emoji更换成本地图片
    parseEmoji(str) {
        return twemoji.parse(str, function (icon) {
            return 'static/emoji/36x36/' + icon + '.png';
        });
    }
}
