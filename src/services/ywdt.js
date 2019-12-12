import dtUtil from 'ser/util'
module.exports = {
    getProjectByActionParams(actionParams, fromSource) {
        var us = (actionParams || '').split('\n');
        var params = {};
        dtUtil.each(us, function (u) {
            if (u.indexOf('=') > -1) {
                u = u.trim();
                var um = u.split('=');
                params[um[0].trim()] = um[1].trim();
            }
        });
        var url = params.pcHomeUrl,
            projectId = params.id;
        if (!fromSource) fromSource = 'fromYWDT'; //是从业务大厅打开的，给项目主页显示头用。
        if (url) {
            url = url.replace("{web}/", path.webBaseUrl);
            url = url.replace("{id}", projectId);
            url = url.replace("{sourceId}", projectId);
            for (var key in params) {
                if (['appUrl', 'appCode', 'param', 'pcHomeUrl'].indexOf(key) == -1) {
                    url = url.replace('{' + key + '}', params[key]);
                    url = $.UrlAddParam(url, key, params[key]);
                }
            }
            url = $.UrlAddParam(url, fromSource, 1);
            url = $.UrlAddParam(url, 'pcCloseCode', 'ywdt,' + projectId);
        }
        return {
            projectId: projectId,
            projectPage: url
        }
    }
}