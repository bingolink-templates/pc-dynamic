var defaultAvatar = {
    link: 'static/avatar/l.png',
    user: 'static/avatar/user.png',
    group: 'static/avatar/group.png',
    organization: 'static/avatar/org.png',
    serviceno: 'static/avatar/serviceno.png',
    label: 'static/avatar/label.png'
}
function getFormatAvatarPath(id) {
    var path = window.env.uamUri + '/api/uam/getAvatarById'
    var img = path + '?id=' + id + '&type=1' + '&access_token=' + window.token + '&t=' + new Date().getTime();
    return img
}

var fileImageTypes = {
    'excel': ['xls', 'xlsx'],
    'music': ['mp3', 'wma', 'wav', 'mod', 'ogg', 'm4a'],
    'pdf': ['pdf'],
    'photo': ['bmp', 'gif', 'jpeg', 'jpg', 'svg', 'png', 'psd'],
    'ppt': ['ppt', 'pptx'],
    'txt': ['txt', 'key'],
    'video': ['rm', 'rmvb', 'wmv', 'avi', 'mp4', '3gp', 'mkv', 'flv', 'mov', 'mpg'],
    'word': ['doc', 'docx', 'wps'],
    'zip': ['zip', 'rar', '7z'],
    'unknow': ['file'],
    'folder2': ['folder'],
    'team': ['team']
}
var fileImages = {};
var fileTypeImages = {};
for (var fext in fileImageTypes) {
    fileImages[fext] = 'static/file/' + fext + '.png';
    var arr = fileImageTypes[fext];
    if (arr.length > 0) {
        for (var i = 0; i < arr.length; i++) {
            fileTypeImages[arr[i]] = fext;
        }
    }
}



module.exports = {
    getFormatAvatarPath: getFormatAvatarPath,
    getFileImages(ext) {
        var type = fileTypeImages[ext];
        if (type) {
            return fileImages[type];
        } else {
            return fileImages['unknow'];
        }
    },
    getDefaultAvatar(type) {
        if (type == 'local') return defaultAvatar.link;
        type = parseInt(type);
        switch (type) {
            case 1:
                return defaultAvatar.user;
            case 2:
                return defaultAvatar.group;
            case 4:
                return defaultAvatar.organization;
            case 5:
                return defaultAvatar.serviceno;
            case 13: //标签分组
                return defaultAvatar.label;
            case 14: //事务头像
                return 'static/avatar/project.png';
            default:
                return defaultAvatar.user;
        }
    }
}