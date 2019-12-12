import util from 'ser/util'
import dtUtil from 'ser/index'


module.exports = {
    // 获取动态nav
    /*
    1、动态包含图片（小视频）和文字，显示动态第一张图片或视频第一桢，和文字内容第3行，超出部分不显示用...结尾；
    2、只有文字没有图片，显示默认图片和文字；
    3、只有图片没有文字，只显示图片，文字为空；
    4、只有链接，显示链接图标和链接标题；
    5、只有文件，显示文件图标和文件名称；
    6、如果都包含，按1～5的规则优先显示；
    */
    getNavId(success, error) {
        app.linkplugin.ajax({
            url: window.env.blogUri + '/v1/navigation/list',
            success: function (res) {
                var datas = res.data;
                if (datas.length > 0)
                    success(datas);
                else
                    error(i18n.ErrorData);
            },
            error: function (err) {
                var m = '';
                try {
                    m = JSON.parse(err.responseText).message;
                } catch (e) { }
                error(m || i18n.ErrorLoadData);
            }
        })
    },
    // 获取动态列表
    getBlog(nav, success, error) {
        app.linkplugin.ajax({
            url: window.env.blogUri + '/v1/blog/list/navigation',
            data: {
                navigationId: nav,
                limit: 10,
                forwardNum: 5,
                commentNum: 5,
                praiseNum: 10
            },
            success: function (res) {
                var datas = dtUtil.formatBlogs(res.data);
                if (datas.length > 0)
                    success(datas);
                else
                    error(i18n.ErrorData);
            },
            error: function (err) {
                var m = '';
                try {
                    m = JSON.parse(err.responseText).message;
                } catch (e) { }
                error(m || i18n.ErrorLoadData);
            }
        })
    }
}
