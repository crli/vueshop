<template>
  <div class="searchlist">
    <headTop :noneHome="noneHome" :headTitle="titleName">
    </headTop>
    <div class="title ftitle"v-if="teamlist.length">搜索到的商家列表</div>
    <div class="discover-list">
      <section class="list-item" v-for="item in teamlist">
        <div class="top" @click ="routerpushPart(item.Pid)">
          <div class="img">
            <img :src="item.Img" :alt="item.Title" />
          </div>
          <div class="cont ellipsis">
            <p class="title ellipsis">{{item.Title}}</p>
            <p><span class="star-pic">
              <i :style="'width:' + item.Star*20 + '%'"></i>
            </span></p>
            <p class="ellipsis">{{item.Category}}</p>
            <p class="money">
              <span>$<span>{{changedollor(item.Percapita)}}</span>/人</span>
              <span>{{item.Distance}}</span>
            </p>
          </div>
        </div>
        <div class="center"></div>
        <div class="bot">
          <div class="item ellipsis" v-for="value in item.Team" @click="routerpush(value.TeamId)">{{value.Title}}</div>
        </div>
      </section>
    </div>
    <div class="title" v-if="Newlist.length" :class="{ftitle:teamlist.length==0}">搜索到的新闻列表</div>
    <section class="new" v-for="news in Newlist" @click="strateto(news.Id)">
      <div class="left"><i class="iconfont icon-chazhao"></i>{{news.Title}}</div>
      <div class="right">[{{news.CataName}}]</div>
    </section>
  </div>
</template>

<script>

import headTop from '@/components/commen/header/head'
import {getCookie} from '@/config/mUtils'
import {mapState,mapMutations} from 'vuex'
import {GetNewsList,getPartnerTeamList} from '@/service/getData'
export default {
  name: 'searchlist',
  data () {
    return {
      titleName:'搜素结果',
      noneHome:true,
      teamlist:[],//总团单数据
      Newlist:[],
      parameter:{
        longitude:'',
        latitude:'',
        page:1,//默认1页
        pagesize:10,
        keyword:''
      }
    }
  },

  created(){
    document.body.removeAttribute("class","hid");
    //没坐标获得坐标
    if(!this.longitude){
      this.getLocation()
    }else{
      this.parameter.longitude = this.longitude;
      this.parameter.latitude = this.latitude;
      this.init()
    }
  },
  beforeMount(){
    this.parameter.keyword = this.$route.query.search
  },
  mounted(){

  },
  methods:{
    ...mapMutations([
      'SET_LOG_AND_LAT'
    ]),
    strateto(id){
      this.$router.push("/strategy/strategydetail?id="+id)
    },
    init(){
      getPartnerTeamList(this.parameter).then((response)=>{
        this.teamlist = response.data
      }).then(()=>{
        GetNewsList(getCookie("USERToken"),0,10,1,this.parameter.keyword,0).then((response)=>{
          this.Newlist = response.data
        })
      })
    },
    /**
     * [getLocation 获得经纬度存入vuex]
     * @return {[type]} [description]
     */
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
    /**
     * [routerpush 去商品详情页]
     * @param  {[type]} id [团单id]
     * @return {[type]}    [description]
     */
    routerpush(id){
      this.$router.push("/team?id="+id)
    },
    /**
     * [routerpushPart 去商家详情页]
     * @param  {[type]} pid [商家pid]
     * @return {[type]}    [description]
     */
    routerpushPart(pid){
      this.$router.push("/partner?id="+pid)
    },
  },
  computed:{
    ...mapState([
      'longitude','latitude'
    ])
  },

  components:{headTop}
}
</script>

<style scoped lang="scss">
  @import '../../style/mixin';
  .title{
    line-height: 1.066667rem;
    @include font-dpr(14px);
    padding-left: 0.266667rem;
    padding-right: 0.266667rem;
  }
  .ftitle{
    padding-top:1.09333rem;
  }
  .discover-list{
    position: relative;
    width:100%;
    height:auto;
    z-index: 0;
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
    .list-item{
      background:#fff;
      padding:0.266667rem 0.266667rem 0;
      margin-bottom:0.426667rem;
      &:last-child{
        margin-bottom: 0;
      }
      .top{
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
          p.title{
            @include font-dpr(15px);
          }
          p.money{
            display:flex;
            justify-content:space-between;
          }
        }
      }
      .center{
        height:0.773333rem;
        line-height: 0.773333rem;
        border-bottom: 1px solid #eee;
        @include font-dpr(13px);
        color:$ic;
      }
      .bot{
        .item{
          height: 0.906667rem;
          line-height: 0.906667rem;
          margin-left:3.06667rem;
          position: relative;
          padding-left: 0.666667rem;
          @include font-dpr(13px);
          &:before{
            content:'';
            position: absolute;
            background:url('../../assets/img/tuan.png');
            background-size: 100%,100%;
            @include wh( 0.373333rem,0.373333rem);
            top:0.25rem;
            left:0
          }
        }
      }
    }

  }
  .new{
    background:#fff;
    line-height: 1.066667rem;
    display: flex;
    padding:0 0.266667rem;
    justify-content:space-between;
    i{
      @include font-dpr(12px);
      padding-right: 0.266667rem;
    }
  }
</style>
