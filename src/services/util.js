module.exports = {
    each(arr, callback) {
        if (!arr) return;
        for (var i = 0; i < arr.length; i++) {
            callback(arr[i]);
        }
    },
    //作为正则表达式的字符串的转义
    regexStrEscape(str) {
        if (!str) return "";
        return str.replace(/([*.?+$^[\](){}|\\/])/g, "\\$1");
    },
    getLastKeyStr(str, key) {
        if (!str) return "";
        return str.substring(str.lastIndexOf(key) + 1, str.length);
    },
    getLastChineseWord(str) {
        str = (str || "").split("").reverse().join("");
        var res = str.match(/[\u4e00-\u9fa5]/);
        return res && res[0];
    },
    //将特殊字符转换成HTML编码
    htmlSpecialChars(str) {
        if (!str) return str;
        str = str.replace(/&/g, '&amp;');
        str = str.replace(/</g, '&lt;');
        str = str.replace(/>/g, '&gt;');
        str = str.replace(/[ ]{2}/g, ' &nbsp;');
        str = str.replace(/\n/g, '<br />');
        return str;
    },
    guid() {
        return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + this.s4() + this.s4();
    },
    s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    },
    isEmpty(val) {
        // null or undefined
        if (val == null) return true;

        if (typeof val === 'boolean') return false;

        if (typeof val === 'number') return !val;

        if (val instanceof Error) return val.message === '';

        switch (Object.prototype.toString.call(val)) {
            // String or Array
            case '[object String]':
            case '[object Array]':
                return !val.length;

            // Map or Set or File
            case '[object File]':
            case '[object Map]':
            case '[object Set]': {
                return !val.size;
            }
            // Plain Object
            case '[object Object]': {
                return !Object.keys(val).length;
            }
        }

        return false;
    }
}