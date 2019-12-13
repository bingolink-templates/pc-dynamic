<template>
    <div class="blog" @mouseenter="enter()" @mouseleave="leave()">
        <div class="header">
            <span class="title">{{i18n.Blog}}</span>
            <span class="more" @click="toMore()">{{i18n.More}}</span>
        </div>
        <div v-if="blogs.length>0" class="blog_area" ref='blog_area'>
            <div v-for="(blog, index) in blogs" :key='index' class="blog_item" @click='detailBlog(blog.blogInfo.blogId)'>
                <!-- 发起者 -->
                <div class="blog_header_img_area">
                    <div class="blog_header_img">
                        <avatar :id="blog.blogInfo.accountId" :name="blog.blogInfo.accountName" :type="blog.blogInfo.accountType"></avatar>
                    </div>
                    <span class="blog_header_name">{{blog.blogInfo.accountName}}</span>
                </div>
                <!-- 内容 -->
                <div class="blog_content_area">
                    <!-- 纯文本 -->
                    <div v-if="blog.blogInfo.ct" style="height: 54px">
                        <div class="info" :class="[blog.onlyWord ? 'line4': 'line2']" v-html="blog.blogInfo.ct"></div>
                    </div>
                    <!-- 转发 -->
                    <div class="link-media" v-if="blog.baseBlog">
                        <!-- 转发-->
                        <div class="attach dyamic-attach">
                            <div class="img">
                                <img src="static/icon/shareblog.png" class="icon-img" alt="">
                            </div>
                            <div class="cont" v-html="blog.baseBlog.preContent + blog.baseBlog.content"></div>
                        </div>
                    </div>
                    <!-- 文件 -->
                    <div class="link-media" v-else-if="blog.files.length>0" v-for="(file,f) in blog.files" :key='f'>
                        <!-- 文件-->
                        <div class="attach dyamic-attach attach-file" v-bind:class="{noexist: file.isDeleted}" v-if='f == 0'>
                            <div class="img">
                                <img :src="file.icon" />
                            </div>
                            <div class="cont">{{file.title}}</div>
                            <img src="static/icon/download.svg" class="icon-img filedownload" alt="">
                        </div>
                    </div>
                    <!-- 链接 -->
                    <div class="link-media" v-else-if="blog.links.length>0" v-for="(link,l) in blog.links" :key='l'>
                        <!-- 链接-->
                        <!-- <div class="attach dyamic-attach" @click="openUrl(link)"> -->
                        <div class="attach dyamic-attach">
                            <div class="img">
                                <img src="static/icon/sharelink.png" class="icon-img" alt="">
                            </div>
                            <div class="cont">{{link.title}}</div>
                        </div>
                    </div>
                    <!-- 应用 -->
                    <div class="link-media" v-else-if="blog.apps.length>0" v-for="(app,a) in blog.apps" :key='a'>
                        <!-- 应用-->
                        <!-- <div class="attach dyamic-attach" @click="openApp(app)"> -->
                        <div class="attach dyamic-attach">
                            <div class="img">
                                <img v-if="app.icon" :src="app.icon" @error="appIconErr(app)" />
                                <img v-else src="static/icon/shareapp.png" class="icon-img" alt="">
                            </div>
                            <div class="cont">{{app.title}}</div>
                        </div>
                    </div>
                    <!-- 视频图片 -->
                    <div class="link-media" v-else-if="blog.videos.length + blog.photos.length > 0">
                        <ul class="link-photo clearfloat" v-bind:class="{one: isOnePhoto}">
                            <!--视频-->
                            <li v-for="(video,vi) in blog.videos" :key='vi'>
                                <img class="noexist" v-if="video.isDeleted" src="static/icon/dyvideo-noexist.png" />
                                <storeImg v-else :fileId="video.thumbId" :size="photoSize" :ext="video.ext" :errshow="'graybg'" />
                                <img v-if="!video.isDeleted" src="static/icon/play.png" class="icon-img" alt="">
                            </li>
                            <!--图片-->
                            <li v-for="(photo) in blog.photos" class="rs-li" :key='photo.fileId'>
                                <img class="noexist" v-if="photo.isDeleted" src="static/msg/dypic-noexist.png" />
                                <storeImg v-else :fileId="photo.fileId" :size="photoSize" :ext="photo.ext" :autoSize="isOnePhoto" :name="photo.resourceDescription" :uname="blog.blogInfo.accountName" :utype="blog.blogInfo.accountType" :uid="blog.blogInfo.accountId" :sname="blog.blogInfo.accountName" />
                            </li>
                        </ul>
                    </div>
                </div>
                <!-- 点赞数, 评论数 -->
                <div class="blog_footer">
                    <div>
                        <img src="static/icon/comment.png" alt="">
                        <span>{{blog.commentCount}}</span>
                    </div>
                    <div>
                        <img src="static/icon/yes.png" alt="">
                        <span>{{blog.praiseCount}}</span>
                    </div>
                </div>
            </div>
            <div class="blog_left_arrow" ref='left' @click="leftArrow">
                <i class="el-icon-arrow-left"></i>
            </div>
            <div class="blog_right_arrow" ref='right' @click="rightArrow">
                <i class="el-icon-arrow-right"></i>
            </div>
        </div>
        <div class="error-info" v-else>
            <img v-if="errMsg" src="static/icon/tea.svg" />
            <span @click="getDatas()">{{errMsg}}</span>
        </div>
    </div>
</template>
<script>
import apiSer from 'ser/api'
import avatar from './conmon/avater'
import storeImg from './conmon/storeImg'

import util from 'ser/util'

export default {
    data() {
        return {
            i18n: window.i18n,
            blogs: [],
            errMsg: '',
            isOnePhoto: false,
            index: 0,
            limitIndex: 8
        }
    },
    components: {
        avatar,
        storeImg
    },
    created() {
        this.getNavId();
        app.linkplugin.listenRefreshWidgetData(() => {
            this.getNavId();
        });
        this.listenWindow()
    },
    mounted() {
    },
    methods: {
        enter() {
            $('.blog_left_arrow').animate({ 'opacity': '1' }, 200)
            $('.blog_right_arrow').animate({ 'opacity': '1' }, 200)
        },
        leave() {
            $('.blog_left_arrow').animate({ 'opacity': '0' }, 200)
            $('.blog_right_arrow').animate({ 'opacity': '0' }, 200)
        },
        detailBlog(blogId) {
            app.linkplugin.openBlogDetail(blogId)
        },
        toMore() {
            app.trigger('JumpToTabView', ['DynamicView'])
        },
        listenWindow() {
            var that = this
            window.onresize = function () {
                if ($(window).width() >= 1490) {
                    that.limitIndex = 5;
                } else if ($(window).width() >= 1192) {
                    that.limitIndex = 6;
                } else if ($(window).width() >= 894) {
                    that.limitIndex = 7;
                } else if ($(window).width() >= 596) {
                    that.limitIndex = 8;
                } else {
                    that.limitIndex = 9;
                }
            }
            window.onresize()
        },
        getNavId() {
            apiSer.getNavId((datas) => {
                this.getData(datas[0].id)
                this.errMsg = '';
            }, (errMsg) => {
                this.errMsg = errMsg;
            });
        },
        getData(nav) {
            apiSer.getBlog(nav, (res) => {
                this.blogs = res
                this.errMsg = '';
            }, (errMsg) => {
                this.errMsg = errMsg;
            });
        },
        leftArrow() {
            if (this.index == 0) return
            this.index--
            console.log(this.index);
            $('.blog_area').animate({ 'scrollLeft': (298 * this.index) }, 400)
        },
        rightArrow() {
            if (this.index == this.limitIndex) return
            this.index++
            console.log(this.index);
            $('.blog_area').animate({ 'scrollLeft': (298 * this.index) }, 400)
        }
    }
}
</script>
<style lang="scss">
@import "~asset/common";
@import "~asset/app";
</style>
