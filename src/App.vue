<template>
  <div class="app">
    <audio ref="audio" @canplay="musicCanPlay" @timeupdate="musicUpdate" @ended="musicNext"></audio>
    <v-header :user="userInfo"></v-header>
    <!--头部-->
    <side-bar :user="userInfo"></side-bar>
    <!--左侧栏-->
    <div class="tab">
      <div class="tab-item">
        <router-link to="/">
          <i class="fa fa-pagelines" aria-hidden="true"></i>首页
        </router-link>
      </div>
      <div class="tab-item">
        <router-link to="/rank">
          <i class="fa fa-paper-plane-o" aria-hidden="true"></i>排行榜
        </router-link>
      </div>
      <div class="tab-item">
        <router-link to="/search">
          <i class="fa fa-headphones" aria-hidden="true"></i>搜索
        </router-link>
      </div>
    </div>
    <router-view></router-view>
    <bottom-bar></bottom-bar>
    <!--底部音乐-->
    <music-list></music-list>
    <!--播放列表-->
    <music-detail></music-detail>
    <!--当前播放-->
    <song-list></song-list>
    <!--歌单详情-->
  </div>
</template>

<script>
  import header from '@/components/header'
  import sidebar from '@/components/sidebar'
  import bottombar from '@/components/bottombar'
  import musicList from '@/components/musicList'
  import musicDetail from '@/components/musicDetail'
  import songList from '@/components/songList'
  export default {
    name: 'app',
    data () {
      return {
        userInfo: {
          userName: '',
          userIcon: ''
        },
        isSideShow: false
      }
    },
    created () {
      this.$axios.get('/db/musicList/getList')
        .then((res) => {
          let list = res.data
          if (list.length > 0) {
            console.log('connect database')
            this.$store.dispatch('set_musicList', list)
            this.$store.dispatch('set_music', list[0])
            this.$refs.audio.setAttribute('src', list[0].url)
            this.$store.dispatch('set_audioElement', this.$refs.audio)
          } else {
            console.log('database is empty')
            list = this.$store.getters.getMusicList
            this.$store.dispatch('set_musicList', list)
            this.$store.dispatch('set_music', list[0])
            this.$refs.audio.setAttribute('src', list[0].url)
            this.$store.dispatch('set_audioElement', this.$refs.audio)
            this.$axios.post('/db/musicList/saveList', list)
              .then((res) => {
                if (res.status === 200) {
                  console.log('初始化数据成功')
                }
                if (res.status === 202) {
                  console.log('初始化失败')
                }
              })
              .catch((res) => {
                console.log('connect database music error')
              })
          }
        })
        .catch((res) => {
          console.log('connect database error')
          let list = this.$store.getters.getMusicList
          list = this.$store.getters.getMusicList
          this.$store.dispatch('set_musicList', list)
          this.$store.dispatch('set_music', list[0])
          this.$refs.audio.setAttribute('src', list[0].url)
          this.$store.dispatch('set_audioElement', this.$refs.audio)
        })
      this.$axios.get('../static/data.json')
        .then((res) => {
          this.userInfo = res.data.userInfo
        })
        .catch((res) => {
          console.log('can not connect user')
        })
//      if (window.localStorage.getItem('musicList') !== null) {
//        console.log(JSON.parse(window.localStorage.getItem('musicList')))
//        this.$store.state.audio.musicList = JSON.parse(window.localStorage.getItem('musicList'))
//      }
    },
    components: {
      'v-header': header,
      'side-bar': sidebar,
      'bottom-bar': bottombar,
      'music-list': musicList,
      'music-detail': musicDetail,
      'song-list': songList
    },
    methods: {
      musicCanPlay () {
        this.$store.dispatch('set_musicCurrentTime', this.$refs.audio)
        this.$store.dispatch('set_musicDurationTime', this.$refs.audio)
      },
      musicUpdate () {
        this.$store.dispatch('set_musicCurrentTime', this.$refs.audio)
      },
      musicNext () {
        this.$store.dispatch('play_nextMusic')
      }
    }
  }
</script>

<style>
html,body,div,span,
applet,object,iframe,
h1,h2,h3,h4,h5,h6,p,blockquote,pre,
a,abbr,acronym,address,big,cite,code,
del,dfn,em,font,img,ins,kbd,q,s,samp,
small,strike,strong,sub,sup,tt,var,
dd,dl,dt,li,ol,ul,
fieldset,form,label,legend,select,
table,caption,tbody,tfoot,thead,tr,th,td,input,button,i,span{
  margin:0;
  padding:0;
  border:0;
  box-sizing:border-box;
}
html,body{
  font-family: "Helvetica Neue", Helvetica, Arial, "PingFang SC", "Hiragino Sans GB", "WenQuanYi Micro Hei", "Microsoft Yahei", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  height:100%;
  font-size:12px;
}
input,button,textarea,td,th,select{
  font-family: "Helvetica Neue", Helvetica, Arial, "PingFang SC", "Hiragino Sans GB", "WenQuanYi Micro Hei", "Microsoft Yahei", sans-serif;
  outline:none;}
table {border-collapse:collapse;border-spacing:0;}
ol,ul{list-style: none;}
a{text-decoration:none;}
a:hover{text-decoration:none;cursor:pointer;}
.fl{float:left;}
.fr{float:right;}
.clearFloat:after{content:"";display:block;clear:both;}
.clearFloat{zoom:1;}
input[disabled], select[disabled]{
  background: #f9fafc !important;
  cursor: not-allowed !important;
}
.app{
  height:100%;
}
.app .tab{
  display:flex;
  position:relative;
  height:42px;
  line-height:40px;
  font-size:14px;
  font-weight:bold;
}
.app .tab-item{
  flex:1;
  text-align:center;
}
.app .tab-item a{
  display:inline-block;
  width:100%;
  color:#000;
  border-bottom:2px solid transparent;
  transition:border-color .4s;
}
.app .tab-item a .fa{
  margin-right:6px;
}
.app .tab-item a.router-link-exact-active{
  color:indianred;
  border-color:#dc0000;
}
</style>
