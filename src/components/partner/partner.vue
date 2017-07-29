<template>
  <div class="partner">
    <headTop :noneHome="noneHome"v-show="this.$route.path=='/partner'">
      <div slot="collect" class="collect" @click="collect"><i class="iconfont icon-xin" :class="partnerInfo.FavState"></i></div>
      <div slot="hack" class="hack"><span></span></div>
    </headTop>
    <div class="swip">
      <swiper :options="swiperOption" class="swiper-wrap">
        <swiper-slide v-for="(slide,index) in partnerInfo.Img" :key="index">
          <img :src="slide.src" alt="" />
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>
      <div class="text-box">
        <p>{{partnerInfo.Title}}</p>
      </div>
    </div>
    <section class="section1 "v-if="partnerInfo.Partnerid">
      <div class="itme">
        <p>{{partnerInfo.Title}}</p>
        <p>
          <span class="star-pic">
            <i :style="'width:' + partnerInfo.Star*20 + '%'"></i>
          </span>
          <span>人均：${{changedollor(partnerInfo.Percapita)}}</span>
        </p>
      </div>
    </section>
    <section class="section2 pb"v-if="partnerInfo.Partnerid">
      <div class="item" @click="mapto">
        <i class="iconfont icon-fujin"></i>
      </div>
      <div class="fujin item" @click="mapto">
        {{partnerInfo.Address}}
      </div>
      <a :href="'tel:'+partnerInfo.Tel" class="item"><i class="iconfont icon-phone"></i></a>
    </section>
    <section class="section3" v-if="partnerInfo.Partnerid">
      <div class="title">商家介绍</div>
      <p class="p1" v-if="partnerInfo.Introduce">商家简介：{{partnerInfo.Introduce}}</p>
      <p class="p2" v-if="partnerInfo.Opentime">开放时间：{{partnerInfo.Opentime}}</p>

      <div class="box">
        <div class="item" v-for="value in supporting">
          <img :src="value.src" /><div>{{value.title}}</div>
        </div>
      </div>
    </section>
    <section class="section4" v-if="shoupartnerTeams.length">
      <div class="title">商品列表</div>
      <div class="box" >
        <div class="tuan">
          <div class="item" v-for="(value,index) in shoupartnerTeams" @click="teamto(value.TeamId)" :class="value.Type=='t'?'t':'k'">
            <div class="left">
              <img :src="value.Image" alt="" />
              <div class="cont">
                <p class="ellipsis">{{value.Title}}</p>
                <p><span class="ic money">{{dollorflag}}<b class="ic">{{changedollor(value.Price)}}</b></span><span class="mprice">{{dollorflag}}{{changedollor(value.Mprice)}}</span></p>
              </div>
            </div>
            <div class="right"><span>已售{{value.Num}}</span><i class="iconfont icon-arrow-right"></i></div>
          </div>
        </div>
        <div class="tip" @click="showlist" v-if="partnerTeams.length>3&&flag">其他{{partnerTeams.length-3}}个团购<i class="iconfont icon-xiala"></i></div>
      </div>
    </section>
    <section class="section5" v-if="partnerItems.length">
      <div class="title">推荐菜</div>
      <div class="slide-box">
        <swiper :options="swiperOption1" class="swiper-wrap">
          <swiper-slide v-for="(slide,index) in partnerItems" :key="index">
            <img :src="slide.Img" alt="" />
            <p>{{slide.Title}}</p>
          </swiper-slide>
        </swiper>
        <p class="p2" v-if="partnerInfo.Serviceitem">{{partnerInfo.Serviceitem}}</p>
      </div>
    </section>
    <section class="section6" v-if="commentbox.total">
      <div class="head" @click="commentdetail">
        <div class="left"><span>评价({{commentbox.total}})</span></div>
        <div class="right">
          <span class="star-pic">
            <i :style="'width:' + commentbox.Star*20 + '%'"></i>
          </span>
          <span>{{commentbox.Star}}</span>
          <i class="iconfont icon-arrow-right"></i>
        </div>
      </div>
      <div class="tagbox" v-if="commentbox.Comtags.length>0">
        <span :class="value.Good" v-for="(value,index) in commentbox.Comtags">{{value.Txt}}({{value.Num}})</span>
      </div>
      <div class="comment-box">
        <section v-for="value in commentbox.list" class="comment-item">
          <div class="comment-t">
            <div class="img">
              <img :src="value.face" alt="" />
              <div class="name-box">
                <div class="name">{{value.name}}</div>
                <div class="time">{{value.time}}</div>
              </div>
            </div>
            <div class="star-pic">
              <i :style="'width:' + value.star*20 + '%'"></i>
            </div>
          </div>
          <div class="comment-c">
            <div class="cont-box">{{value.cont}}</div>
            <div class="img-box">
              <img :src="v" alt="" v-for="v in value.img"/>
            </div>
          </div>
          <div class="comment-b">消费评价-{{commentbox.Title}}</div>
        </section>
      </div>
      <section class="head" v-if="commentbox.list.length>4" @click="commentdetail">
        <div class="left"><span>查看全部评价</span></div>
        <div class="right"><i class="iconfont icon-arrow-right"></i></div>
      </section>
    </section>
    <likebox></likebox>
    <alert v-if="showAlert"  @closeTip="close" :alertText="alertText" :suc="collectflag"></alert>
    <transition name="router-slid">
        <router-view></router-view>
    </transition>
    <!-- <div class="show-wrap-bac" v-if="showwrap1"></div> -->
  </div>
</template>

<script>
import headTop from '@/components/commen/header/head'
import likebox from '@/components/commen/likebox/likebox'
import alert from '@/components/commen/alert/alert'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import {getPartnerInfo,getTeamCommentList,getPartnerItems,getPartnerTeams,AddToFavorites,DelFavorites} from '@/service/getData'
import {mapState,mapMutations} from 'vuex'
import Freeparking from '@/assets/img/Freeparking.png'
import ChargeParking from '@/assets/img/ChargeParking.png'
import Wifi from '@/assets/img/Wifi.png'
import Pack from '@/assets/img/Pack.png'
import Delivery from '@/assets/img/Delivery.png'
import Chinese from '@/assets/img/Chinese.png'
import Cash from '@/assets/img/Cash.png'
import Card from '@/assets/img/Card.png'
import NoAppointment from '@/assets/img/NoAppointment.png'
import MustAppointment from '@/assets/img/MustAppointment.png'
import PrivateRoom from '@/assets/img/PrivateRoom.png'
import {setStore,getCookie} from '@/config/mUtils'
export default {
  name: 'partner',
  data () {
    return {
      noneHome:true,
      PartnerId:null,
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
      swiperOption1: {
        slidesPerView: 4,
        paginationClickable: true,
        spaceBetween: 0,
        loop: true
      },
      showAlert:false,
      alertText:null,
      collectflag:false,
      parameter:{
        Type:'p',
        Id:null,
        TagId:0,
        Page:1,
        PageSize:4
      },
      partnerItems:'',
      partnerTeams:[],
      shoupartnerTeams:[],
      lastpartnerteams:[],
      flag:true,
      supporting:[],
      partnerInfo:{},
      commentList:{},
      commentbox:{
        'Comtags':'',
        'list':'',
        'total':'',
        'Star':''
      },
      // showwrap1:true,
      dollorflag:"$"
    }
  },
  created(){
    this.dollorflag = this.changedollorflag();
    document.body.scrollTop = 0
    document.documentElement.scrollTop = 0;
  },

  mounted(){

    this.init()
  },

  methods:{
    ...mapMutations([
      'COMMENT_SAVE'
    ]),

    init(){
      this.PartnerId = this.$route.query.id;
      this.parameter.Id = this.PartnerId;

      this.$ajax.all([
        getPartnerInfo(this.PartnerId,getCookie("USERToken")),
        getPartnerItems(this.PartnerId),
        getPartnerTeams(this.PartnerId),
        getTeamCommentList(this.parameter)
        ]).then(this.$ajax.spread((res1, res2, res3, res4)=> {
          this.partnerInfo = res1.data;
          this.partnerItems = res2.data;
          this.partnerTeams = res3.data;
          this.commentList = res4.data;
          this.commentbox.Comtags = this.partnerInfo.Comtags;
          this.commentbox.Star = this.partnerInfo.Star;
          this.commentbox.Title = this.partnerInfo.Title;
          this.initDatapart(this.partnerInfo)
          this.initpartData(this.partnerTeams)


          this.commentbox.list = this.commentList.list
          this.commentbox.total = this.commentList.total
          setStore('COMMENT_SAVE',this.commentbox)
      }));

    },
    /**
     * [initDatapart 处理支持业务]
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    initDatapart(data){
      this.supporting = [];

      data.Supporting.forEach((element,index)=>{
        if(element=="Freeparking"){
          this.supporting.push({"title":"免费停车","src":Freeparking})
        }
        if(element=="ChargeParking"){
          this.supporting.push({"title":"收费停车","src":ChargeParking})
        }
        if(element=="Wifi"){
          this.supporting.push({"title":"有wifi,","src":Wifi})
        }
        if(element=="Pack"){
          this.supporting.push({"title":"可以打包","src":Pack})
        }
        if(element=="Delivery"){
          this.supporting.push({"title":"可以外送","src":Delivery})
        }
        if(element=="Chinese"){
          this.supporting.push({"title":"中文服务","src":Chinese})
        }
        if(element=="Cash"){
          this.supporting.push({"title":"只支持现金","src":Cash})
        }
        if(element=="Card"){
          this.supporting.push({"title":"可以刷卡","src":Card})
        }
        if(element=="NoAppointment"){
          this.supporting.push({"title":"不支持预约","src":NoAppointment})
        }
        if(element=="MustAppointment"){
          this.supporting.push({"title":"必须预约","src":MustAppointment})
        }
        if(element=="PrivateRoom"){
          this.supporting.push({"title":"有包间","src":PrivateRoom})
        }
      })
    },
    commentdetail(){
      this.$router.push("/partner/allcomment?id="+this.PartnerId+"&type=p")
    },
    showlist(){
      this.shoupartnerTeams = [...this.shoupartnerTeams, ...this.lastpartnerteams]
      this.flag = false
    },
    /**
     * [initpartData 商品列表]
     * @param  {[type]} data [团单列表]
     * @return {[type]}      [description]
     */
    initpartData(data){
      if(data.length>3){
        this.shoupartnerTeams = [...data.slice(0,3)]
        this.lastpartnerteams = [...data.slice(3)]
      }else{
        this.shoupartnerTeams = data
      }
    },
    teamto(id){
      this.$router.push('/team?id=' + id)
    },
    /**
     * [collect 收藏商家]
     * @return {[type]} [description]
     */
    collect(){
      if(this.partnerInfo.FavState=="N"){
        AddToFavorites(getCookie("USERToken"),this.PartnerId,'Partner').then((response)=>{
          if(response.data.Ret == 0){
            this.showAlert = true;
            this.collectflag = true;
            this.alertText = "收藏成功";
            this.partnerInfo.FavState = "Y";
          }else if(response.data.Ret == 1001){
            this.showAlert = true;
            this.collectflag = false;
            this.alertText = "您还未登录";
          }else{
            this.showAlert = true;
            this.collectflag = false;
            this.alertText = response.data.Msg;
          }
        })
      }else {
        DelFavorites(getCookie("USERToken"),this.PartnerId,'Partner').then((response)=>{
          if(response.data.Ret == 0){
            this.showAlert = true;
            this.collectflag = true;
            this.alertText = "取消收藏成功";
            this.partnerInfo.FavState = "N"
          }else{
            this.showAlert = true;
            this.collectflag = false;
            this.alertText = response.data.Msg;
          }
        })
      }
    },
    close(){
      if(this.alertText == "您还未登录"){
        this.$router.push('/login')
      }else{
        this.showAlert = false;
        this.alertText = "";
      }
    },
    mapto(){
      if(this.country=='CN'){
        this.$router.push("/partner/baidumap?lng="+this.partnerInfo.lng+"&lat="+this.partnerInfo.lat)
      }else{
        this.$router.push("/partner/map?lng="+this.partnerInfo.lng+"&lat="+this.partnerInfo.lat)
      }
    }
  },
  watch:{
    '$route' (to, from) {
      if(from.path!="/partner/allcomment"&&from.query.id!=to.query.id&&to.path!="/partner/map"&&to.path!="/partner/baidumap"){
        this.init()
      }
    },

  },
  computed:{
    ...mapState([
      'country'
    ])
  },
  components:{headTop,swiper, swiperSlide,likebox,alert}
}
</script>

<style scoped lang="scss">
  @import '../../style/mixin';
  .head-other{
    background:transparent !important;
    .icon-back{
      color:#fff
    }
  }
  .collect{
    position:absolute;
    width: 1.09333rem;
    height: 1.09333rem;
    right:0;
    z-index: 1000;
    i{
      @include center;
      color:#fff;
      @include font-dpr(24px);
      &.Y{
        color:$ic
      }
    }
  }
  .hack{
    position:absolute;
    width: 1.09333rem;
    height: 1.09333rem;
    left:0;
    z-index: -1;
    span{
      @include center;
      display:block;
      @include wh(0.666667rem,0.666667rem)
      background:rgba(0,0,0,.3);
      border-radius: 50%;
    }
  }
  .swip{
    position:relative;z-index: 0;
    .swiper-wrap{
      @include wh(100%,4.8rem);
      img{@include wh(100% ,auto);border:none}
    }
    .text-box{
      @include center;
      @include wh(70%,outo);
      z-index: 3;
      text-align: center;
      p{color:#fff;@include font-dpr(16px);}
    }
  }
  .star-pic{
    @include wh(2.173333rem, 0.346667rem);
    background: url('../../assets/img/star0.png') no-repeat;
    background-size: 100% 100%;
    display: inline-block;
    vertical-align: middle;
    margin-right: 0.133333rem;
    i{
      background: url('../../assets/img/star.png')no-repeat;
      display: inline-block;
      height: 0.346667rem;
      overflow: hidden;
      vertical-align: top;
      background-size: auto 100%;}
  }
  .section1{
    display:flex;
    justify-content:space-between;
    height:1.653333rem;
    align-items:center;
    padding:0.16rem 0.266667rem 0 0.266667rem;
    background:#fff;
    border-bottom: 1px solid #eee;
    p{
      line-height: 0.666667rem;@include font-dpr(14px);
    }
    span{@include font-dpr(12px);}
    .buy{
      @include wh(1.6rem,0.613333rem);
      background:$ic;
      line-height: 0.613333rem;
      color:#fff;
      text-align: center;

    }
  }
  .section2{
    display:flex;
    padding:0.346667rem 0.266667rem;
    line-height: 0.533333rem;
    .item{
      position:relative;
      i{@include center;@include font-dpr(18px);}
    }
    .item:first-child{
      margin:0 0.6rem 0 0.133333rem
    }
    .item:last-child{
      margin:0 0.266667rem 0 0.8rem
    }
    .fujin{flex:1;@include ellipsis(2);}
    a .icon-phone{color:$ic;@include font-dpr(20px);}
  }
  .section3{
    background:#fff;
    margin-top: 0.4rem;
    .title{
      line-height: 0.96rem;
      color:$ic;
      @include font-dpr(14px);
      border-bottom: 1px solid #eee;padding:0 0.266667rem;
    }
    p{@include font-dpr(13px);}
    .p1{
      line-height: 0.56rem;border-bottom: 1px solid #eee;padding:0.266667rem;
    }
    .p2{line-height: 0.56rem;padding:0.266667rem;}
    .box{
      display:flex;
      flex-flow:wrap;
      margin-bottom: 0.266667rem;
      border-top: 1px solid #eee;
      .item{
        width:25%;
        text-align: center;@include font-dpr(12px);
        img{margin-bottom: 0.133333rem;@include wh(0.613333rem,0.613333rem);}
        margin: 0.266667rem 0;
      }
    }
  }
  .section4{
    background:#fff;
    .title{
      line-height: 0.96rem;
      color:$ic;
      @include font-dpr(14px);
      border-bottom: 1px solid #eee;padding:0 0.266667rem;
    }
    .box{
      .tip{
        text-align: center;
        border-top: 1px solid #eee;
        padding:0.266667rem 0;
        i{@include font-dpr(12px);}
      }
    }
    .tuan{
      margin-left: 0.666667rem;
      position:relative;

    }
    .item{
      display:flex;
      padding: 0.266667rem 0;
      align-items:center;
      justify-content:space-between;
      position:relative;
      &.t:before{
        position:absolute;
        content:'';
        @include wh(0.4rem,0.4rem);
        background:url('../../assets/img/tuan.png');
        background-size: 100%,100%;
        left:-0.5rem;
        top:.7rem;
      }
      &.k:before{
        position:absolute;
        content:'';
        @include wh(0.4rem,0.4rem);
        background:url('../../assets/img/zhu.png');
        background-size: 100%,100%;
        left:-0.5rem;
        top:.7rem;
      }
      .left{
        display:flex;
        p{line-height: 0.666667rem;@include font-dpr(12px);}
        .ic{color:$ic;@include font-dpr(12px);}
        .money{
          margin-right: 0.2rem;
        }
        .mprice{
          text-decoration: line-through
        }
      }
      .cont{width:4.4rem}
      .right{
        text-align: right;
        padding-right: 0.266667rem;
        span,i{display:inline-block;@include font-dpr(12px);}
      }
    }
    img{@include wh(1.68rem,1.44rem);margin-right: 0.266667rem;}
  }
  .section5{
    background:#fff;padding:0 0.266667rem;
    .title{
      line-height: 0.96rem;
      @include font-dpr(14px);
      border-bottom: 1px solid #eee;
      margin-bottom: 0.266667rem;
    }
    .swiper-wrap{
      text-align: center;
      img{
        @include wh(1.946667rem,1.733333rem)
      }
      p{@include font-dpr(12px);}
    }
    .p2{
      margin:0.32rem 0;
      border-top: 1px solid #eee;
      line-height: 0.693333rem;
    }
  }
  .section6{
    background:#fff;
    padding:0 0.266667rem;
    margin:0.373333rem 0;
    .head{
      display:flex;justify-content:space-between;line-height: 1.093333rem;
      span{
        @include font-dpr(14px);
      }
      .right{
        .iconfont{@include font-dpr(14px);}
      }
    }
    .tagbox{
      padding:0.2rem 0 0.4rem 0;
      border-bottom: 1px solid #eee;
      span{
        display: inline-block;
        padding: 0.05rem 0.2rem;
        margin: 0.2rem 0.2rem 0 0;
        @include font-dpr(12px);
        border:1px solid #ddd;
        color:#666;
        &.Y{
          color: $ic;
          border-color: $ic
        }
      }
    }
    .star-pic{
      @include wh(2.173333rem, 0.346667rem);
      background: url('../../assets/img/star0.png') no-repeat;
      background-size: 100% 100%;
      display: inline-block;
      vertical-align: middle;
      margin-right: 0.133333rem;
      i{
        background: url('../../assets/img/star.png')no-repeat;
        display: inline-block;
        height: 0.346667rem;
        overflow: hidden;
        vertical-align: top;
        background-size: auto 100%;}
    }
    .comment-item{
      border-bottom: 1px solid #eee;
      .comment-t{
        display:flex;
        justify-content:space-between;
        margin:0.266667rem 0;
        .img{
          display:flex;
        }
        img{
          @include wh(1.013333rem,1.013333rem);
          border-radius: 50%;
          margin-right: 0.4rem;
        }
        .name{@include font-dpr(14px);}
        .time{@include font-dpr(11px);}
      }
      .comment-c{
        line-height: 0.426667rem;
        margin-bottom: 0.266667rem;
        .cont-box{@include font-dpr(14px);}
        .img-box{
          margin:0.266667rem 0;
          img{
            width:2.0rem;height:1.5rem;margin-right: 0.266667rem;
          }
        }
      }
      .comment-b{
        margin-bottom: 0.266667rem;@include font-dpr(12px)
      }
    }
  }

  .router-slid-enter-active, .router-slid-leave-active {
      transition: all .4s;
  }
  .router-slid-enter, .router-slid-leave-active {
      transform: translateX(100%);
  }
</style>
