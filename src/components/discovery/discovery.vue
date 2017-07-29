<template>
  <div class="discovery">
    <search class="head">
      <div class="head-back"slot="headback" @click="routerto"><i class="iconfont icon-back"></i></div>
    </search>
    <header v-if="NearTitle.length">
      <div class="item" :class="{active:active==index}" v-for="(item,index) in NearTitle" @click="tagto(item.Id,index)">{{item.Name}}</div>
    </header>
    <div class="discover-list" v-infinite-scroll="loadMore" id="discover-list" infinite-scroll-disabled="busy" infinite-scroll-distance="20">
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
      <footer class="loader-more" v-show="!loadernone">正在加载更多...</footer>
      <footer class="loader-none" v-show="loadernone">已经全部加载完毕</footer>
    </div>
    <Foot></Foot>
  </div>
</template>

<script>

import search from '@/components/commen/search/search'
import Foot from '@/components/commen/footer/foot'
import infiniteScroll from 'vue-infinite-scroll'
import {mapState,mapMutations} from 'vuex'
import {getPartnerTeamList,getNearTitle} from '@/service/getData'
export default {
  name: 'discovery',
  data () {
    return {
      busy: true,
      loadernone:false,//没有数据提示
      teamlist:[],//总团单数据
      NearTitle:[],
      active:0,
      parameter:{//
        group_id:'210',
        longitude:'',
        latitude:'',
        page:1//默认1页
      },
    }
  },
  components:{search,Foot},

  async created(){
    // 获得头部数据
    let response =  await getNearTitle();
    this.NearTitle = response.data;
    //没坐标获得坐标
    if(!this.longitude){
      this.getLocation()
    }else{
      this.parameter.longitude = this.longitude;
      this.parameter.latitude = this.latitude;
      this.loadMore()
    }
  },
  beforeMount(){

  },
  mounted(){

  },
  directives: {infiniteScroll},
  methods:{
    ...mapMutations([
      'SET_LOG_AND_LAT'
    ]),
    /**
     * [loadMore 无限加载]
     * @return {[type]} [description]
     */
    async loadMore() {
      //防止重复请求
      this.busy = true;
      this.loadernone = false;
      let response = await getPartnerTeamList(this.parameter);
      if(response.data.length){
        this.initStart(response.data)
        if (response.data.length < 20) {
          this.loadernone = true;
          return
        }
      }else{
        this.loadernone = true;
        return
      }
      this.busy = false;
    },
    initStart(data){
      this.parameter.page++;
      this.teamlist = [...this.teamlist, ...data];
    },
    /**
     * [init 初始化]
     * @return {[type]} [description]
     */
    init(){
      this.parameter.page = 1;
      this.teamlist = [];
      this.parameter.longitude = this.longitude;
      this.parameter.latitude = this.latitude;
      this.loadernone = false;
      this.busy = true;
    },
    /**
     * [tagto 横向切换导航栏]
     * @param  {[type]} id    [横向值]
     * @param  {[type]} index [横向索引]
     * @return {[type]}       [description]
     */
    tagto(id,index){
      // this.showLoading = true;
      this.init()
      this.parameter.group_id = id;
      getPartnerTeamList(this.parameter).then((response)=>{
        this.active = index;
        this.initStart(response.data)
        if (response.data.length < 20) {
          this.loadernone = true;
          // this.showLoading = false;
          return
        }
        this.busy = false;
        // this.showLoading = false;
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
          this.loadMore()
        },(error)=>{
          this.loadMore()
        });
      }
    },
    /**
     * [routerpush 去商品详情页]
     * @param  {[type]} id [团单id]
     * @return {[type]}    [description]
     */
    routerpush(id){
      this.$router.push("/team?id="+id+"&type=t")
    },
    /**
     * [routerpushPart 去商家详情页]
     * @param  {[type]} pid [商家pid]
     * @return {[type]}    [description]
     */
    routerpushPart(pid){
      this.$router.push("/partner?id="+pid+"&type=p")
    },
    routerto(){
      this.$router.go(-1)
    },
  },
  computed:{
    ...mapState([
      'longitude','latitude'
    ])
  }
}
</script>

<style scoped lang="scss">
  @import '../../style/mixin';
  .head{position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width:100%
  }
  header{
    background:#fff;
    @include wh(100%,1.333333rem);
    display:flex;
    margin-top: 1.12rem;
    .item{
      @include wh(20%,1.333333rem);
      text-align: center;
      line-height: 1.333333rem;
      @include font-dpr(15px);
      box-sizing:border-box;
      &.active{
        border-bottom: 1px solid $ic
      }
    }
  }
  .discover-list{
    position: relative;
    width:100%;
    height:auto;
    z-index: 0;
    padding-bottom: 1.28rem;

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
      margin-top:0.426667rem;
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
  .loader-more,.loader-none{ width: 100%; height:1.28rem;text-align: center;line-height: 1.28rem}
</style>
