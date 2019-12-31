import dtUtil from 'ser/util'
import Face from 'ser/face'
import Avatar from 'ser/avater'
import ywdtSer from 'ser/ywdt'

var URL_PATTERN = /((http(s)?:\/\/|www\.|WWW\.)([/\w-./@?_!~$%&=:#;+\-()]*)?)/g;

function formatContent(blog) {
    var content = blog.blogInfo.content;
    content = simpleFormatContent(content);
    blog.files = blog.files || [];
    blog.linkslinks = blog.links || [];
    blog.apps = blog.apps || [];
    blog.videos = blog.videos || [];
    blog.photos = blog.photos || [];
    blog.labelList = blog.labelList || [];
    blog.praiseList = blog.praiseList || [];
    //话题高亮，再取
    blog.topicList = blog.topicList || [];
    if (blog.topicList.length > 0) {
        dtUtil.each(blog.topicList, function (topic) {
            var tp = dtUtil.htmlSpecialChars("#" + topic.title + "#");
            var topicRegExp = new RegExp(dtUtil.regexStrEscape(tp) + "+?", "g");
            content = content.replace(topicRegExp, '<a href="javascript:void(0);" class="topicA">' + tp + '</a>');
        });
    }
    if (content.indexOf('static/emoji/36x36') != -1) {
        try {
            content = content.replace(/static\/emoji\/36x36/g, app.fs.specialPath().DIR_WEBAPP + '/html/static/emoji/36x36')
        } catch (error) {
        }
    }

    if (content.indexOf('static/face') != -1) {
        try {
            content = content.replace(/static\/face/g, app.fs.specialPath().DIR_WEBAPP + '/html/static/face')
        } catch (error) {
        }
    }

    blog.blogInfo.ct = content;
    blog.blogInfo.accountType = accountTypeTrans[blog.blogInfo.accountType];
    if (blog.blogInfo.accountEcode) {
        blog.isOtherCompany = localStorage['CurrentECode'] != blog.blogInfo.accountEcode;
        blog.blogInfo.accountDesc = (blog.isOtherCompany ?
            blog.blogInfo.accountEnterprise : blog.blogInfo.accountOrgName)
            || blog.blogInfo.accountEnterprise
            || '';
    }
}

var accountTypeTrans = {
    '0': 1,
    '1': 2,
    '3': 5,
    '4': 13
}

function formatAttach(resourceUrl) {
    var regxUrl = /(store:\/\/)/g,
        resourceAtUrl = '';
    var storeFileId
    if (resourceUrl.match(regxUrl)) {
        if (resourceUrl.length > 20) {
            storeFileId = resourceUrl.replace(regxUrl, "");
            resourceAtUrl = window.env.storeUri + '/' + storeFileId;
        }
    } else {
        storeFileId = resourceUrl.replace(/(^.+fileId=)/g, "");
        resourceAtUrl = window.env.storeUri + '/' + storeFileId;
    }
    return {
        resourceAtUrl,
        storeFileId
    };
}

function openHomePage(user) {
    return '<a href="javascript:;">@' + user.name + '</a>';
}

function formatAt(content) {
    //@高亮
    var users = content.match(new RegExp("@{[^}]*}", "g"));
    if (users != null && users.length > 0) {
        $.each(users, function (index, user) {
            var vt = user.substr(1);
            try {
                var vJson = JSON.parse(vt);
                if (vJson.id == 'all') {
                    content = content.replace(user, '@' + vJson.name);
                } else {
                    content = content.replace(user, openHomePage(vJson));
                }
            } catch (e) {
                console.log('@协议格式错误:', vt);
            }
        });
    }
    return content;
}

//图片
function getFileId(resourceUrl) {
    if (!resourceUrl) return '';
    var regxUrl = /(store:\/\/)/g;
    var RegExp_Url = /((http(s)?:\/\/|www\.|WWW\.)([/\w-./@?_!~$%&=:#;+\-()]*)?)/g;
    var resourceId;
    if (resourceUrl.match(regxUrl)) {
        if (resourceUrl.length > 20) {
            resourceId = resourceUrl.replace(regxUrl, "");
        } else {
            return;
        }
    } else if (resourceUrl.match(RegExp_Url)) {
        resourceId = resourceUrl;
    } else {
        resourceId = resourceUrl.replace(/(^.+fileId=)/g, "");
    }
    return resourceId;
}

function formatResource(blog) {
    var links = [],
        files = [],
        photos = [],
        videos = [],
        apps = [],
        resourceDelStatus = {};
    dtUtil.each(blog.resourceList, function (resource) {
        resourceDelStatus[resource.resourceId] = resource.isDeleted;
        switch (resource.resourceType) {
            //图片
            case 0:
                var ext = dtUtil.getLastKeyStr(resource.resourceDescription, ".");
                var fResource = formatAttach(resource.resourceUrl);
                photos.push($.extend(resource, {
                    title: resource.resourceDescription,
                    fileId: fResource.storeFileId || fResource.resourceAtUrl,
                    ext
                }));
                break;
            //视频
            case 1:
                var fResource = formatAttach(resource.resourceUrl);
                videos.push($.extend(resource, {
                    thumbId: getFileId(resource.resourceThumb),
                    url: fResource.resourceAtUrl,
                    ext: 'png'
                }));
                break;
            //存储服务文件、云盘文件
            case 3:
                var ext = dtUtil.getLastKeyStr(resource.resourceDescription, ".");
                var fResource = formatAttach(resource.resourceUrl);
                files.push($.extend(resource, {
                    icon: Avatar.getFileImages(ext),
                    title: resource.resourceDescription,
                    // url: fResource.resourceAtUrl,
                    storeFileId: fResource.storeFileId,
                    // diskFileUrl: fResource.diskFileUrl
                }));
                break;
            //链接
            case 4:
                links.push($.extend(resource, {
                    title: resource.resourceDescription,
                    url: resource.resourceUrl
                }));
                break;
            //应用
            case 5:
                var url = resource.resourceUrl || '';
                var project,
                    icon;
                if (url.startsWith('[OpenApp]')) {
                    project = ywdtSer.getProjectByActionParams(url, 'fromNoTitlebarWin');
                }
                if (resource.resourceThumb) {
                    icon = window.env.uamUri + '/ui/download?filepath=' + resource.resourceThumb;
                }
                apps.push({
                    icon: icon,
                    title: resource.resourceDescription,
                    project: project
                });
                break;
            //任务
            case 6:
                var url = resource.resourceUrl || '',
                    icon;
                if (typeof url === 'string') url = JSON.parse(url);
                if (url.pc) url = JSON.parse(url.pc);
                if (resource.resourceThumb) {
                    icon = window.env.uamUri + '/ui/download?filepath=' + resource.resourceThumb.split('||')[0]
                }
                apps.push({
                    icon: icon,
                    title: resource.resourceDescription,
                    url: url.urlParams
                });
                break;
        }
    });
    blog.links = links;
    blog.files = files;
    blog.photos = photos;
    blog.videos = videos;
    blog.apps = apps;
    blog.onlyWord = false
    if (!blog.baseBlog && blog.links.length == 0 && blog.files.length == 0 && blog.photos.length == 0 && blog.videos.length == 0 && blog.apps.length == 0)
        blog.onlyWord = true
    blog.resourceDelStatus = resourceDelStatus;
}

function simpleFormatContent(content) {
    if (!content) content = '';
    //转义字符
    content = dtUtil.htmlSpecialChars(content);

    //url
    content = content.replace(URL_PATTERN, function (forres) {
        // return "<a href='javascript:void(0);' onclick=\"app.system.openUri('" + encodeURI(forres) + "')\">" + forres + "</a>";
        return "<a href='javascript:void(0);'>" + forres + "</a>";
    });
    //@
    content = formatAt(content);
    //表情显示
    content = Face.parseEmoji(content);
    content = content.replace(dtUtil.Regexp_Emoji, '<i class="emoji">$1</i>'); //在parseEmoji解析不到后，支持Mac上显示，但Windows就看不到。
    content = Face.replaceToIcon(content);
    return content;
}


module.exports = {
    formatBlogs(res) {
        var fblogs = [];
        dtUtil.each(res, function (blog) {
            try {
                blog.jsonStr = JSON.stringify(blog);
                if (blog.baseBlog) {
                    blog.baseBlog.content = simpleFormatContent(blog.baseBlog.content);
                    blog.baseBlog.preContent = '@' + blog.baseBlog.accountName + '<br/>';
                }
                formatContent(blog);
                formatResource(blog);
                blog.blogScopeType = blog.blogInfo.blogScopeType;
                fblogs.push(blog);
            } catch (e) {
                console.log('动态解析失败:', e, blog);
            }
        });
        return fblogs;
    }
}