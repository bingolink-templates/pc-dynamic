<template>
    <div v-bind:guid="guid">
        <img class="gallery-pic" :src="imgSrc" :name="name" :_uid="uid" :_uname="uname" :_utype="utype" :_sname="sname" @load="loaded()" @error="setError()" v-show="loadType=='pic'" />
        <img class="load-pic" :src="defaultLoadingSrc" v-show="loadType=='load'" />
        <img class="error-pic" @click="reload()" v-show="loadType=='error'" :src="loadFailImg" title="图片加载失败，请点击重试" />
        <div class="error-bg" @click="reload()" v-show="loadType=='errorbg'"></div>
    </div>
</template>
<script>
import storeImg from 'ser/store'
import util from 'ser/util'

export default {
    props: ['fileId', 'size', 'ext', 'autoSize', 'name', 'uid', 'uname', 'utype', 'sname', 'errshow'],
    data() {
        var imgSrc = this.fileId;
        if (imgSrc && !imgSrc.startsWith('http')) {
            imgSrc = window.env.storeUri + '/store/getFile?fileId=' + this.fileId + (this.ext == 'gif' ? '' : '&size=0x' + 718);
        }
        imgSrc = $.UrlAddParam(imgSrc, 'access_token', window.token)
        return {
            loadType: 'load',
            guid: util.guid(),
            defaultLoadingSrc: storeImg.getLoadingPic(),
            loadFailImg: storeImg.picLoadFail,
            imgSrc: imgSrc
        }
    },
    created() {
    },
    methods: {
        loaded(e) {
            this.loadType = 'pic';
        },
        setError() {
            if (this.errshow == 'graybg') {
                this.loadType = 'errorbg';
                return;
            }
            this.loadType = 'error';
        },
        reload() {
            this.loadType = 'load';
            this.imgSrc = this.imgSrc + '&t=' + new Date().getTime();
        }
    }
}
</script>
<style lang="scss" scoped>
.gallery-pic {
    width: 48px;
    height: 48px;
}
.error-pic {
    cursor: pointer;
}
</style>

