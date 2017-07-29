<template>
  <div class="team" id="team">
    <headTop :noneHome="noneHome" v-show="this.$route.path=='/team'">
<!--       <div slot="collect" class="collect" @click="collect"><i class="iconfont icon-xin" :class="teaminfo.FavState"></i></div> -->
      <div slot="hack" class="hack"><span></span></div>
    </headTop>
    <div class="swip">
      <swiper :options="swiperOption" class="swiper-wrap">
        <swiper-slide v-for="(slide,index) in teaminfo.Img" :key="index">
          <img :src="slide.Src" alt="" />
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>
      <div class="text-box">
        <p>{{partnerInfo.Title}}</p>
        <p>{{teaminfo.Title}}</p>
      </div>
    </div>
    <section class="section1 pb" v-if="teaminfo.PartnerId">
      <div class="item">
        团购价<span class="price">{{dollorflag}}{{changedollor(teaminfo.Price)}}</span><span class="mprice">{{dollorflag}}{{changedollor(teaminfo.MPrice)}}</span>
      </div>
      <div class="item">
        已售<span>{{teaminfo.Number}}</span>
      </div>
    </section>
    <section class="section3 pb" v-if="tipbox.length">
      <div class="item" v-for="value in tipbox"><i class="iconfont icon-xuanze"></i>{{value}}</div>
    </section>
    <section class="section2 pb" v-if="partnerInfo.Partnerid">
      <div class="sec1"><span @click="routerpushPart(partnerInfo.Partnerid)">{{partnerInfo.Title}}</span><span>{{teaminfo.Distance}}</span></div>
      <div class="sec2">
        <div class="item">{{partnerInfo.Address}}</div>
        <a :href="'tel:'+partnerInfo.Tel" class="item"><i class="iconfont icon-phone"></i></a>
      </div>
      <div class="sec3" @click="otherpartner" v-show="teaminfo.PartnerNum>1"><div class="left">查看其他使用门店({{teaminfo.PartnerNum-1}}家)</div><div class="right"><i class="iconfont icon-arrow-right"></i></div></div>
    </section>

    <section class="section4" v-if="supporting.length">
      <div class="title">购物须知</div>
      <div class="box">
        <div class="item" v-for="value in supporting">
          <img :src="value.src" /><div>{{value.title}}</div>
        </div>
      </div>
      <section class="tip-box">
        <div class="item-t">有效期：</div>
        <p>{{teaminfo.Startdate}}至{{teaminfo.Expiredate}}</p>
      </section>
      <section class="tip-box" v-if="teaminfo.Nousedate">
        <div class="item-t">不可用时间：</div>
        <p>{{teaminfo.Nousedate}}</p>
      </section>
      <section class="tip-box" v-for="(value,key,index) in teaminfo.Notice">
        <div class="item-t">{{value.Title}}：</div>
        <p>{{value.Cont}}</p>
      </section>
    </section>
    <section @click="detailto" class="section5"v-if="teaminfo.PartnerId">
      <div class="left"><span>查看图文详情</span></div>
      <div class="right"><i class="iconfont icon-arrow-right"></i></div>
    </section>
    <section class="section6"v-if="teaminfo.PartnerId">
      <div class="head"@click="commentdetail">
        <div class="left"><span>评价({{commentbox.total}})</span></div>
        <div class="right">
          <span class="star-pic">
            <i :style="'width:' + commentbox.Star*20 + '%'"></i>
          </span>
          <span>{{commentbox.Star}}</span>
          <i class="iconfont icon-arrow-right" ></i>
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
    <cartFoot @addCart="addTocart" @tocollect="collect" @rightCart="topay" :buynum="teaminfo.CartNum==0?null:teaminfo.CartNum" :FavState="teaminfo.FavState"></cartFoot>
    <alert v-if="showAlert"  @closeTip="close" :alertText="alertText" :suc="collectflag"></alert>
    <transition name="router-slid">
        <router-view></router-view>
    </transition>
   <!--  <div class="show-wrap-bac" v-if="showwrap1&&showwrap2"></div> -->
  </div>

</template>

<script>
import headTop from '@/components/commen/header/head'
import likebox from '@/components/commen/likebox/likebox'
import cartFoot from '@/components/commen/cartFoot/cartFoot'
import alert from '@/components/commen/alert/alert'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import {getTeamInfo,getPartnerInfo,getTeamCommentList,getYouLike,AddToFavorites,DelFavorites,AddToUserCart,TeamToOrder,GetTeamOtherStore} from '@/service/getData'
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
import Eat from '@/assets/img/Eat.png'
import {mapState,mapMutations} from 'vuex'
import {setStore,getCookie} from '@/config/mUtils'
export default {
  name: 'team',
  data () {
    return {
      noneHome:true,
      TeamId:null,
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
      parameter:{
        Type:'t',
        Id:null,
        TagId:0,
        Page:1,
        PageSize:4
      },
      showAlert:false,
      alertText:null,
      collectflag:false,
      tipbox:[],//免预约...
      supporting:[],//支持项目有wifi...
      teaminfo:{},
      partnerInfo:{},
      commentList:{},
      commentbox:{
        'Comtags':'',
        'list':'',
        'total':'',
        'Star':''
      },
      Token:'',
      dollorflag:"$",
      tologin:false

    }
  },

  created(){
    this.dollorflag = this.changedollorflag()
    if(!this.longitude){
      this.getLocation()
    }else{
      this.init()
    }
    document.body.scrollTop = 0
    document.documentElement.scrollTop = 0
  },
  mounted(){
    // this.init()
  },
  methods:{
    ...mapMutations([
      'SET_LOG_AND_LAT','OUT_LOGIN'
    ]),
    /**
     * [addTocart 添加到购物车]
     */
    addTocart(){
      AddToUserCart(this.TeamId,1,this.Token).then((response)=>{
        if(response.data.Ret == 0){
          this.collectflag = true;
          this.showAlert = true;
          this.alertText = "添加成功";
          let num = this.teaminfo.CartNum;
          num++;
          this.teaminfo.CartNum = num.toString()
        }
        // else if(response.data.Ret == 1001){
        //   this.OUT_LOGIN();
        //   this.showAlert = true;
        //   this.alertText = "请重新登录";
        //   this.tologin = true;
        // }
        else{
          this.collectflag = false;
          this.showAlert = true;
          this.alertText = response.data.Msg
        }
      })
    },
    init(){
      this.tipbox = [];
      this.supporting = [];
      this.TeamId = this.$route.query.id;
      this.parameter.Id = this.TeamId;
      this.Token = getCookie("USERToken");

      this.$ajax.all([
        getTeamInfo(this.TeamId,getCookie("USERToken"),this.longitude,this.latitude),
        getTeamCommentList(this.parameter),
        ]).then(this.$ajax.spread((res1, res2)=> {
          this.teaminfo = res1.data;
          this.initData(this.teaminfo);
          this.initDatapart(this.teaminfo)
          getPartnerInfo(res1.data.PartnerId,getCookie("USERToken")).then((response)=>{
            this.partnerInfo = response.data;

            this.commentbox.Comtags = this.partnerInfo.Comtags;
            this.commentbox.Star = this.partnerInfo.Star;
            this.commentbox.Title = this.partnerInfo.Title;
          })
          this.commentList = res2.data;
          this.commentbox.list = this.commentList.list
          this.commentbox.total = this.commentList.total
          setStore('COMMENT_SAVE',this.commentbox)
      }));

    },
    /**
     * [initData 提示信息]
     * @param  {[type]} data [团单]
     * @return {[type]}      [description]
     */
    initData(data){
      if(data.AllowreFund == "Y"){
        this.tipbox.push("随便退")
      }
      if(data.Appointment){
        this.tipbox.push(data.Appointment)
      }
      if(data.WeekEnd == "Y"){
        this.tipbox.push("周末可用")
      }
      if(data.Holiday == "Y"){
        this.tipbox.push("节假日可用")
      }
    },
    /**
     * [initDatapart 处理支持业务]
     * @param  {[type]} data [商家详情]
     * @return {[type]}      [description]
     */
    initDatapart(data){
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
        if(element=="Eat"){
          this.supporting.push({"title":"堂食","src":Eat})
        }
      })
    },
    detailto(){
      this.$router.push("/team/teamdetail?id="+this.TeamId+"&pid="+this.partnerInfo.Partnerid)
    },
    commentdetail(){
      this.$router.push("/team/allcomment?id="+this.TeamId+"&type=t")
    },
    /**
     * [collect 收藏]
     * @return {[type]} [description]
     */
    collect(){
      if(this.teaminfo.FavState=="N"){
        AddToFavorites(getCookie("USERToken"),this.TeamId,'Team').then((response)=>{
          if(response.data.Ret == 0){
            this.showAlert = true;
            this.collectflag = true;
            this.alertText = "收藏成功";
            this.teaminfo.FavState = "Y";
          }
          // else if(response.data.Ret == 1001){
          //   this.showAlert = true;
          //   this.collectflag = false;
          //   this.alertText = "您还未登录";
          //   this.tologin = true;
          //}
          else{
            this.showAlert = true;
            this.collectflag = false;
            this.alertText = response.data.Msg;
          }
        })
      }else {
        DelFavorites(getCookie("USERToken"),this.TeamId,'Team').then((response)=>{
          if(response.data.Ret == 0){
            this.showAlert = true;
            this.collectflag = true;
            this.alertText = "取消收藏成功";
            this.teaminfo.FavState = "N"
          }
          else{
            this.showAlert = true;
            this.collectflag = false;
            this.alertText = response.data.Msg;
          }
        })
      }
    },
    /**
     * 直接购买
     * @return {[type]} [description]
     */
    topay(){
      TeamToOrder(getCookie("USERToken"),this.TeamId,1).then((response)=>{
        if(response.data.PackageId){
          this.$router.push('/pay?id='+response.data.PackageId)
        }
        // else if(response.data.ret == 1001){
        //   this.OUT_LOGIN();
        //   this.showAlert = true;
        //   this.alertText = "请重新登录"
        //   this.tologin = true;
        //}
        else{
          this.showAlert = true;
          this.alertText = response.data.Msg;
        }
      })
    },
    close(){
      if(this.tologin){
        this.$router.push('/login')
      }else{
        this.showAlert = false;
        this.alertText = "";

      }
    },
    getLocation(){
      if (navigator.geolocation){
        navigator.geolocation.getCurrentPosition((position)=>{
          let lat = position.coords.latitude.toFixed(7);
          let long = position.coords.longitude.toFixed(7);
          this.SET_LOG_AND_LAT({longitude:lat,latitude:long});
          this.parameter.longitude = this.longitude;
          this.parameter.latitude = this.latitude;
          this.init()
        },(error)=>{
          this.init()
        });
      }
    },
    otherpartner(){
      this.$router.push("/team/otherpartner?id="+this.TeamId)
    },
    /**
     * [routerpushPart 去商家]
     * @param  {[type]} id [description]
     * @return {[type]}    [description]
     */
    routerpushPart(id){
      this.$router.push("/partner?id="+id)
    }
  },
  watch:{
    '$route' (to, from) {
      if(from.path!="/team/allcomment"&&from.query.id!=to.query.id){
        this.init()
      }
    },
    // teaminfo: function (value){
    //   if (value.PartnerId) {
    //     this.showwrap1 = false;
    //   }
    // },
    // partnerInfo:function (value){
    //   if(value.PartnerId){
    //     this.showwrap2 = false;
    //   }
    // }
  },
  computed:{
    ...mapState([
      'longitude','latitude'
    ])
  },
  components:{headTop,swiper, swiperSlide,likebox,alert,cartFoot}
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
      img{@include wh(100% ,100%);border:none}
    }
    .text-box{
      @include center;
      @include wh(70%,outo);
      z-index: 3;
      text-align: center;
      p{color:#fff;@include font-dpr(16px);}
      p:last-child{
        @include font-dpr(15px);
      }
    }
  }
  .section1{
    display:flex;
    justify-content:space-between;
    line-height: 1.013333rem;
    .item{
      @include font-dpr(14px);
      span{@include font-dpr(13px);}
      .price{color:$ic;margin-left:0.3rem;}
      .mprice{text-decoration: line-through;margin-left:0.3rem;}
    }
  }
  .section2{
    margin-bottom: 0.373333rem;
    .sec1{
      display:flex;
      justify-content:space-between;
      line-height: 0.853333rem;
      span:first-child{
        @include font-dpr(16px)
      }
    }
    .sec2{
      display:flex;
      padding:0.346667rem 0;
      justify-content:space-between;
      border-bottom: 1px solid #eee;
      .item{
        position:relative;
        i{@include center;@include font-dpr(18px);}
      }
      .item:first-child{
        margin:0 0.6rem 0 0;
      }
      .item:last-child{
        margin:0 0.266667rem 0 0.8rem
      }
      .fujin{flex:1;@include ellipsis(2);}
      .icon-phone{color:$ic}
    }
    .sec3{
      display:flex;
      justify-content:space-between;
      line-height: 1.12rem;
      .left{
        @include font-dpr(14px);
        color: $ic
      }
      .right{
        i{@include font-dpr(14px);}
      }
    }
  }

  .section3{
    display:flex;
    flex-flow:wrap;
    margin-bottom: 0.373333rem;
    .item{
      margin-right: 0.533333rem;
      line-height: 1.2rem;
      @include font-dpr(13px);
    }
    i{
      margin-right: 0.266667rem;
      color:$ic;
      @include font-dpr(15px);
    }
  }
  .section4{
    background:#fff;
    .title{
      line-height: 0.906667rem;
      padding:0 0.266667rem;
      border-bottom: 1px solid #eee;@include font-dpr(14px);
    }
    .box{
      display:flex;
      flex-flow:wrap;
      margin-bottom: 0.266667rem;
      .item{
        width:25%;
        text-align: center;@include font-dpr(12px);
        img{margin-bottom: 0.133333rem;@include wh(0.613333rem,0.613333rem);}
        margin: 0.266667rem 0;
      }
    }
    .tip-box{
      padding:0 0.266667rem;
      .item-t{
        color:#666;@include font-dpr(14px);line-height: 0.8rem;
      }
      p{
        @include font-dpr(13px);
        position:relative;
        padding-left: 0.266667rem;
        line-height: 0.56rem;
        &:before{
          position:absolute;
          left:0;
          top:0.2rem;
          content:"";
          @include wh(0.133333rem,0.133333rem);
          border-radius: 50%;
          background:$ic
        }
      }
    }
  }
  .section5{
    background:#fff;
    line-height: 1.093333rem;
    padding:0 0.266667rem;
    margin:0.373333rem 0;
    display:flex;justify-content:space-between;
    span{
      color:$ic;
      @include font-dpr(14px);
    }
    .right{
      i{@include font-dpr(14px);}
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
