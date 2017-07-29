<template>
  <div class="home">
    <headTop :readonly="readonly" :class="this.$route.path!='/home'?'zhome':''"></headTop>
    <swiper :options="swiperOption" class="swiper-wrap" >
      <swiper-slide v-for="(slide,index) in homeData.Banner" :key="index">
        <router-link :to="geturl(slide.url)"><img :src="slide.img" alt="" /></router-link>
      </swiper-slide>
      <div class="swiper-pagination" slot="pagination" v-if="homeData.Banner"></div>
    </swiper>
    <section class="team-strategy" v-if="homeData.Menu">
      <section class="team">
        <ul>
          <li v-for="(team,index) in homeData.Menu">
            <router-link :to="{path: 'category', query:{pid:team.id}}">
            <img :src="team.img" alt="" /><span>{{team.title}}</span>
            </router-link>
          </li>
        </ul>
      </section>
      <section class="strategy">
        <div class="item" @click="tostrategy">
          <div class="title">
            <p>实用攻略</p>
            <p>海外享生活</p>
          </div>
          <div class="img">
            <img src="../../assets/img/gl.png" alt="" />
          </div>
        </div>
        <div class="item" @click="totranslate">
          <div class="title">
            <p>实时翻译</p>
            <p>面对面互译</p>
          </div>
          <div class="img">
            <img src="../../assets/img/hy.png" alt="" />
          </div>
        </div>
      </section>
    </section>

    <section class="column"v-if="homeData.Menu"><div class="column-i"><i class="iconfont icon-xin"></i>热门专题</div></section>
    <section class="hot">
      <div class="hot-cont">
        <div :class="'cont'+i" v-for="(v,i) in homeData.Hotsub" ><router-link :to="geturl(v.url)"><img :src="v.img" alt="" /></router-link></div>
      </div>
    </section>
    <section class="column"><div class="column-i"><i class="iconfont icon-xin"></i>猜你喜欢</div></section>
    <div class="project-list" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
      <section class="project" v-for="(item,index) in homeLike" @click ="routerpush(item.TeamId)">
        <div class="img">
          <img :src="item.Image" alt="" />
        </div>
        <div class="cont">
          <p class="Partner ellipsis">{{item.Partner}}</p>
          <p class="title">{{item.Title}}</p>
          <div class="money">
            <div class="money-box">
              <span class="n">{{dollorflag}}<b>{{changedollor(item.Price)}}</b></span>
              <span class="b">{{dollorflag}}<b>{{changedollor(item.Mprice)}}</b></span>
            </div>
            <div>已售<b class="s">{{item.Num}}</b><b>{{item.Star}}</b>分</div>
          </div>
        </div>
      </section>
    </div>
    <footer class="loader-more" v-show="!loadernone">正在加载更多...</footer>
    <footer class="loader-none" v-show="loadernone">已经全部加载完毕</footer>
    <div class="zhanwei"></div>
    <Foot v-show="this.$route.path=='/home'"></Foot>
    <transition name="backtop">
      <div class="to-top" @click="backTop" v-if="showBackStatus"></div>
    </transition>
    <transition name="router-slid">
      <router-view></router-view>
    </transition>
  </div>

</template>

<script>

import headTop from '@/components/commen/header/head'
import Foot from '@/components/commen/footer/foot'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import {mapState, mapActions,mapMutations} from 'vuex'
import infiniteScroll from 'vue-infinite-scroll'
import {showBack, animate,getStore, setStore,removeStore} from '@/config/mUtils'
import {baseUrl} from '@/config/env'
import {getHomeData,getHomeVersion,getYouLike,GetUserCountry} from '@/service/getData'
export default {
  name: 'home',
  data () {
    return {
      readonly:true,
      homeData:{},
      homeLike:[],
      page:1,
      busy: true,
      loadernone:false,//没有数据提示
      swiperOption: {
        pagination: '.swiper-pagination',
        paginationClickable: true,
        spaceBetween: 30,
        centeredSlides: true,
        autoplay: 3000,
        perspective:15,
        autoplayDisableOnInteraction: false,
        notNextTick: true
      },
      showBackStatus:false, //显示返回顶部按钮
      dollorflag:"$"
      // showLoading:true
    }
  },
  async created(){
    if(!getStore("DOLLORFLAG")){
      setStore("DOLLORFLAG","d");
    }
    this.dollorflag = this.changedollorflag();
    /**
     * [description]获得版本以及首页数据
     * @param  {[type]} ).then((response) [description]
     * @return {[type]}                   [description]
     */
    let response = await getHomeVersion();
    let getversion = getStore("HOMEVERSION");
    if(!isNaN(getversion)){
      this.version = JSON.parse(getStore("HOMEVERSION"));
    }
    // 版本不同清除缓存
    if(this.version != response.data.ver){
      setStore("HOMEVERSION",response.data.ver);
      removeStore("homeData");
      // removeStore("homeLike");
    }
    let getData = getStore("homeData");
    try {
      this.homeData = JSON.parse(getData)
      if(this.homeData.Exchangerate){
        setStore("EXCHANGERATE",this.homeData.Exchangerate);
      }else{
        this.handData()
      }
    }catch(e){
      this.handData()
    }

    this.loadMore();
    this.changedollor(1);

    response = await GetUserCountry();
    this.SET_COUNTRY(response.data.Country);

  },
  directives: {infiniteScroll},
  mounted(){
    /**
     * [显示返回按钮]
     * @param  {[type]} status [description]
     * @return {[type]}        [description]
     */
    showBack(status => {
      this.showBackStatus = status;
    })

  },
  computed: {
    ...mapState([
      'userInfo'
    ])
  },
  methods: {
    ...mapMutations([
      'SET_COUNTRY'
    ]),
    async handData(){
      let res = await getHomeData();
      this.homeData = res.data;
      setStore("homeData",this.homeData);
      setStore("EXCHANGERATE",this.homeData.Exchangerate);
    },
    totranslate(){
      this.$router.push("/translate")
    },
    tostrategy(){
      this.$router.push("/strategy")
    },
    /**
     * [loadMore 无限加载]
     * @return {[type]} [description]
     */
    async loadMore() {
      this.busy = true;
      this.loadernone = false;
      let response = await getYouLike(this.page++);
      this.homeLike = [...this.homeLike, ...response.data];
      if (response.data.length < 10) {
        this.loadernone = true;
        return
      }
      this.busy = false;
    },

    /**
     * [geturl 获得地址]
     * @param  {[type]} url [description]
     * @return {[type]}     [description]
     */
    geturl(url){
      let routerUrl = url.toLowerCase();
      if(routerUrl.indexOf("reg")>=0){
        return "login";
      }else if(routerUrl.indexOf("login")>=0){
        return "login";
      }else if(routerUrl.indexOf("partner")>=0){
        return "partner?id="+url.split('_')[1];
      }else if(routerUrl.indexOf("team")>=0){
        return "team?id="+url.split('_')[1];
      }else if(routerUrl.indexOf("news")>=0){
        if(routerUrl.indexOf("newslist")>=0){
          return "newslist?cateid="+url.split('_')[1];
        }else{
          return "news?id="+url.split('_')[1];
        }
      }else if(routerUrl.indexOf("near")>=0){
        return "discovery";
      }else if(routerUrl.indexOf("cart")>=0){
        return "cart";
      }else if(routerUrl.indexOf("orderlist")>=0){
        return "order";
      }else if(routerUrl.indexOf("my")>=0){
        return "admin";
      }else if(routerUrl.indexOf("edituserinfo")>=0){
        return "admin/setUp/personalData";
      }else if(routerUrl.indexOf("bank")>=0){
        return "bankCard";
      }else if(routerUrl.indexOf("address")>=0){
        return "address";
      }else if(routerUrl.indexOf("balance")>=0){
        return "balance";
      }else if(routerUrl.indexOf("accountsetup")>=0){
        return "admin/setUp";
      }else if(routerUrl.indexOf("balance")>=0){
        return "balance";
      }else if(routerUrl.indexOf("comment")>=0){
        if(url.split('_')[1]=='t'){
          return "team?id="+url.split('_')[2];
        }else{
          return "partner?id="+url.split('_')[2];
        }
      }else{
        return 'home'
      }
    },
    /**
     * [backTop 返回顶部]
     * @return {[type]} [description]
     */
    backTop(){
      animate(document.body, {scrollTop: '0'}, 400,'ease-out');
    },
    /**
     * [routerpush 去团单]
     * @param  {[type]} id [description]
     * @return {[type]}    [description]
     */
    routerpush(id){
      this.$router.push("/team?id="+id)
    }

  },

  components:{headTop,Foot,swiper, swiperSlide}
}
</script>

<style scoped lang="scss">
@import '../../style/mixin';
  .zhome{
    z-index: 0!important;
  }
  .home{position: absolute;width:100%;top:0}
  .swiper-wrap{
    height: 12.0rem;
    width: 100%;
    z-index: 0!important;
    img{width: 100%;height: 12.0rem}
  }
  .swiper-pagination{
    bottom:4.933333rem!important;
  }
  .team-strategy{
    position: absolute;
    @include wh(100%, auto)
    top:7rem;
    z-index: 0;
    .team{
      @include wh(100%, 1.773333rem);
      padding: 0.16rem 0.266667rem;
      ul{
        width: 100%;
        display: flex;
        justify-content:space-between;
        li{

          text-align: center;
          a{display: block;width: 100%;}
          img{@include wh(1.2rem,.9rem) text-align: center;}
          span{text-align: center;display: block;@include font-dpr(13px);color: #fff}
        }
      }
    }
    .strategy{
      width:100%;
      padding: 0 0.266667rem;
      display:flex;
      justify-content:space-between;
      .item{
        @include wh(4.4rem,2.4rem)
        border-radius: 0.266667rem;
        background:rgba(255,255,255,.2);
        display:flex;
        .title{
          @include wh(2.3rem,100%);
          text-align: left;
          padding:0.4rem 0 0.4rem 0.266667rem;
          p{
            line-height: 0.8rem;
            color:#fff;
            &:first-child{
              @include font-dpr(15px)
            }
            &:last-child{
              @include font-dpr(13px)
            }
          }
        }
        .img{
          @include wh(2.1rem,100%);
          padding:0.133333rem 0;
          img{
            @include wh(100%,100%)
          }
        }

      }
    }
  }

  .column{
    @include wh(100%, 0.96rem);
    text-align: center;
    line-height: 0.96rem;
    @include font-dpr(13px);
    .column-i{
      @include wh(2.666667rem, 0.96rem);
      margin: 0 auto;
      color:$ic;
      position: relative;
      @include font-dpr(13px);
      &:before{
        position: absolute;
        content:"";
        width:1.333333rem;
        height:0.013333rem;
        background:#b5b5b5;
        left:-1.2rem;
        top:0.48rem
      }
      &:after{
        position: absolute;
        content:"";
        width:1.333333rem;
        height:0.013333rem;
        background:#b5b5b5;
        right:-1.2rem;
        top:0.48rem
      }
    }
    i{color:$ic;margin-right: 0.266667rem;@include font-dpr(13px);}
  }
  .hot{
    height:6.973333rem;
    padding:0.373333rem 0.2rem 0;
    background:#fff;
    .hot-cont{
      padding-top:0.533333rem;
      position: relative;
      img{@include wh(100%, 100%);border-radius: 0.133333rem}
      .cont0{
        position: absolute;
        @include wh(3.52rem, 4.960001rem);
        border-radius: 0.133333rem
      }
      .cont1{
        position: absolute;
        @include wh(5.813333rem, 1.973333rem);
        left:3.78667rem;
      }
      .cont2{
        position: absolute;
        left:3.78667rem;
        top:2.773336rem;
        @include wh(2.7733315rem, 2.719998rem);
      }
      .cont3{
        position: absolute;
        left:6.8266715rem;
        top:2.773336rem;
        @include wh(2.7733315rem, 2.719998rem);
      }
    }
  }
  .project{
    @include wh(100%, auto);
    padding:0.266667rem;background:#fff;
    margin-bottom: 0.373333rem;
    display:flex;
    .img{
      @include wh(2.666667rem,2.373333rem);
      img{@include wh(2.666667rem,2.373333rem);}
      margin-right:0.4rem;
    }
    .cont{
      flex:1;
      display:flex;
      flex-direction:column;
      justify-content:space-between;
      p{line-height: 0.613333rem;@include font-dpr(13px);}
      p.Partner{
        @include font-dpr(15px);
      }
      p.title{
        @include ellipsis(2);
      }
      .money{
        display:flex;
        justify-content:space-between;
        span.n{
          @include font-dpr(14px);
          color:$fcolor;
          b{color:$fcolor}
        }
        span.b{
          @include font-dpr(10px)
        }
        b{color:#666}
        .s{margin-right:0.266667rem}
      }
    }

  }
  .loader-more,.loader-none{height:1rem;text-align: center;line-height: 1rem}
  .to-top{
    position: fixed;
    top: 80%;
    left: 90%;
    transform: translate(-80%, -90%);
    width:1rem;
    height:1rem;
    background:url('../../assets/img/top.png')no-repeat;
    background-size: 100% 100%;
    background-color: #fff;
    border-radius: 1rem;
  }
  .backtop-enter-active, .backtop-leave-active {
    transition: opacity .5s
  }
  .backtop-enter, .backtop-leave-active {
    opacity: 0
  }
  .zhanwei{height:1.28rem}
  .show-wrap-bac{background:url("../../assets/img/bh.jpg");background-size: 100% 100%}
</style>
