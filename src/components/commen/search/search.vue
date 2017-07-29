<template>
  	<div class="wrap">
    <section v-if="flag">
      <div class="search-wrap">
        <div class="zhanwei" v-show ="flag"></div>
        <slot name="headback"></slot>
        <form class="search-form" action="searchlist" @submit.prevent="submit">
          <div class="input-box">
            <input type="search" name="search" placeholder="请输入商家或美食名称" autocomplete="off"class="search-input" v-model="searchValue" @input="checkInput" >
          </div>
        </form>
        <div class="cancel" @click="$router.go(-1)">取消</div>
      </div>
      <section class="hot" v-if="hot.length">
        <div class="title">热门搜索</div>
        <div class="hot-box">
          <span v-for="value in hot" @click="hotchange(value)">{{value}}</span>
        </div>
      </section>
      <section class="time" v-if="showHistory">
        <div class="title">最近搜索</div>
        <div class="time-box">
          <div class="item" v-for="value in searchHistory" @click="teamto(value)"><i class="iconfont icon-zuijinsousuo"></i><span class="ellipsis">{{value.Title}}</span></div>
        </div>
        <div class="clear" @click="clearhistory">清除历史记录</div>
      </section>
      <section class="result" v-if="resultShow">
        <div class="item" v-for="value in searchList.List" @click="teamto(value)"><i class="iconfont icon-chazhao"></i><span class="ellipsis">{{value.Title}}</span></div>
      </section>
    </section>
    <section v-if="!flag">
      <div class="search-wrap">
        <div class="zhanwei" v-show ="flag"></div>
        <slot name="headback"></slot>
        <form class="search-form" action="searchlist">
          <div class="input-box">
            <input type="text" placeholder="请输入商家或美食名称" class="search-input" @click="searchto" >
          </div>
        </form>
        <div class="cancel" @click="hometo">
          <i class="iconfont icon-zhuye"></i>
        </div>
      </div>
    </section>
    </div>
</template>

<script>
import headTop from '@/components/commen/header/head'
import {GetTeamListByKeyworld,getHotkeyWords} from '@/service/getData'
import {getStore, setStore,getCookie} from '@/config/mUtils'
import {mapState,mapMutations} from 'vuex'
export default {
  name:'search',
  data(){
  return {
      searchValue:null,
      hot:[],
      searchHistory:[],
      showHistory:false,
      searchList:[],
      resultShow:false,
      flag:true
    }
  },
  created(){
    document.body.removeAttribute("class","hid");
    if(this.$route.path=="/category"||this.$route.path=="/discovery"){
      this.flag = false;
    }
    getHotkeyWords(getCookie("USERToken")).then((response)=>{
      this.hot = response.data
    })
  },

  /**
   * [历史记录显示隐藏]
   * @return {[type]} [description]
   */
  mounted(){
    if (getStore('searchHistory')) {
      this.searchHistory = JSON.parse(getStore('searchHistory'));
      if(this.searchHistory.length){
        this.showHistory = true;
      }else{
        this.showHistory = false;
      }
    }

  },
  components:{headTop},
  methods:{
    ...mapMutations([
      'SET_LOG_AND_LAT'
    ]),
    submit(){
      this.$router.push("/searchlist?search="+this.searchValue)
    },
    /**
     * [hotchange 选择热门]
     * @param  {[type]} value [description]
     * @return {[type]}       [description]
     */
    hotchange(value){
      this.searchValue = value
      this.checkInput()
    },
    hometo(){
      this.$router.push("/home")
    },
    searchto(){
      this.$router.push("/search")
    },
    /**
     * [checkInput 搜索输入]
     * @return {[type]} [description]
     */
    checkInput(){
      if (this.searchValue) {
        this.showHistory = false;
        this.resultShow = true;
        if(!this.longitude){
          this.getLocation()
        }

      }else{
        this.resultShow = false;
        this.showHistory = true;
      }
    },
    getlist(){
      GetTeamListByKeyworld(getCookie("USERToken"),this.searchValue,this.longitude,this.latitude).then((response)=>{
        this.searchList = response.data;
      })
    },
    clearhistory(){
      setStore('searchHistory',[]);
      this.searchHistory = [];
      this.showHistory = false;
    },
    /**
     * [teamto 处理历史记录,去团单]
     * @param  {[type]} value [description]
     * @return {[type]}       [description]
     */
    teamto(value){
      let arrList = JSON.parse(getStore('searchHistory'))
      if(arrList&&arrList.length){
        // 检测是否重复
        let checkrepeat = false;
        this.searchHistory.forEach(item => {
          if (item == value) {
            checkrepeat = true;
          }
        })
        if (!checkrepeat) {
          this.searchHistory.push(value)
        }
      }else {
        this.searchHistory.push(value)
      }
      setStore('searchHistory',this.searchHistory)
      if(value.Type=="Partner"){
        this.$router.push("/partner?id="+value.PartnerId)
      }
      else if(value.Type=="News"){
        this.$router.push("/strategy/strategydetail?id="+value.NewsId)
      }
      else{
        this.$router.push("/team?id="+value.TeamId)
      }

    },
    /**
     * [blurto 失去焦点]
     * @return {[type]} [description]
     */
    blurto(){
      this.searchValue = null;
      this.resultShow = false;
      this.showHistory = false;
    },
    getLocation(){
      if (navigator.geolocation){
        navigator.geolocation.getCurrentPosition((position)=>{
          let lat = position.coords.latitude.toFixed(7);
          let lng = position.coords.longitude.toFixed(7);
          this.SET_LOG_AND_LAT({longitude:lat,latitude:lng});
          this.getlist()
        },(error)=>{
          this.getlist()
        });
      }
    }
  },
  computed:{
    ...mapState([
      'longitude','latitude'
    ])
  },
  watch:{
    '$route' (to, from) {
      if(to.path=="/category"&&from.path=="/category/subCategory"){
        this.flag = false;
      }
    }
  }
}

</script>

<style lang="scss" scoped>
  @import '../../../style/mixin';
  .search-wrap{display:flex;background:$ict;width:100%;}
  .head-back{
    position: relative;
    @include wh(1.093333rem, 1.093333rem);
    line-height: 1.093333rem;
    @include font-dpr(15px);
    text-align: center;
    i{
      color:#333;
      @include center;
      @include font-dpr(16px);
    }
  }
  .zhanwei{
    width:0.266667rem
  }
  .cancel{
    @include wh(1.3rem,1.093333rem);
    line-height: 1.093333rem;
    @include font-dpr(15px);
    text-align: center;
    padding:0 0.133333rem;
  }
  .search-form{;padding:0.24rem 0;flex:1;}
  .input-box{
    @include wh(100%,0.64rem);
    position:relative;
    .search-input{
      background:#fff;border-radius: .32rem;
      padding-left: 0.266667rem;

      @include wh(100%,100%);
      @include font-dpr(13px);
    }
    i{
      position:absolute;
      top:.1rem;
      right:.1rem;
    }
  }

.hot{
  .title{
    line-height: 0.853333rem;
    padding-left: 0.266667rem;
    color:#666
  }
  .hot-box{
    display:flex;
    flex-flow:wrap;
    background:#fff;
    span{
      @include wh(33.3333%,1rem);
      width:33.3333%;
      line-height: 1rem;
      text-align: center;
      border-bottom: 1px solid #eee;
    }
  }
}
.time{
  background:#fff;
  box-shadow:1px 2px 2px #ccc;
  .title{
    line-height: 0.853333rem;
    padding-left: 0.266667rem;
    color:#666;@include font-dpr(13px);
  }
  .time-box{
    background:#fff;
    .item{
      line-height: 1.253333rem;
      @include wh(100%,1.253333rem);
      border-bottom: 0.013333rem solid #eee;
      background:#fff;
      display:flex;
      span{@include font-dpr(13px);width:70%;}
      i{@include font-dpr(13px);margin:0 0.266667rem}
    }
  }
  .clear{
    background:#fff;
    line-height: 1.12rem;
    text-align: center;
    color:#666;@include font-dpr(13px);
  }
}
.result{
  position:absolute;
  z-index: 0;
  top:1.12rem;
  background:#eee;
  width:100%;
  box-shadow:1px 2px 2px #ccc;
  .item{
    line-height: 1.253333rem;
    @include wh(100%,1.253333rem);
    border-bottom: 0.013333rem solid #eee;
    background:#fff;
    display:flex;
    span{@include font-dpr(13px);width:70%;}
    i{@include font-dpr(13px);margin:0 0.266667rem}
  }
}
.icon-zhuye{@include font-dpr(20px);color: #666}
</style>
