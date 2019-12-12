import Vue from 'vue'
import lang from 'ser/lang'
import App from './app.vue'
window.app = window.parent.app;
require('ser/twemoji.min.js');
require('ser/jquery.js');
require('ser/jquery.extend.js');

//组件按需加载
import {
    Carousel, //走马灯，效果不错。
    CarouselItem
} from 'element-ui'

Vue.use(Carousel);
Vue.use(CarouselItem);

app.linkplugin.getEnvVar(function (env) {
    app.linkplugin.getAccessToken((token) => {
        window.env = env;
        window.i18n = lang[env.language];
        window.token = token
        new Vue({
            el: '#app',
            render: h => h(App)
        })
    })
})
