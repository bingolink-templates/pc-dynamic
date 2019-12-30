<template>
    <img v-if="showImg" class="avatarImg" :src="imgSrc" @error="setErrorImg($event)" />
    <span v-else class="wordAvatar" :style="{background: themeColor}">{{lastWord}}</span>
</template>
<script>
import Avatar from 'ser/avater'
import util from 'ser/util'
export default {
    props: ['type', 'id', 'name'],
    data() {
        var imgSrc
        switch (this.type) {
            default:
                imgSrc = this.getImgSrc(this.id, this.type);
        }
        return {
            errorAvatar: Avatar.defaultAvatar,
            imgSrc: imgSrc,
            showImg: true,
            lastWord: '',
            themeColor: window.env.themeColor
        }
    },
    created() {
    },
    methods: {
        getImgSrc(id, type, incre) {
            return Avatar.getFormatAvatarPath(id, type, incre);
        },
        setErrorImg(e) {
            var word = util.getLastChineseWord(this.name);
            if (word && this.type == 1) {
                this.showImg = false;
                this.lastWord = word;
            } else {
                this.imgSrc = Avatar.getDefaultAvatar(this.type);
            }
        },
    }
}
</script>
