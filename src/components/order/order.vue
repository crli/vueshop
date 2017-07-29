<template>
  <div class="wrap">
    <headTop :noneHome="noneHome" :headTitle="titleName"></headTop>
    <div class="box">
      <div class="head">
        <div @click="select(index)" v-for="(tab,index) in tabs" class="item" :class="{active:active==index}">{{tab}}</div>
      </div>
      <div class="list" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
        <section v-for="(item,index) in dataArr" class="list-item" v-if="!item.Team">
          <div class="wrap">
            <div class="title">
              <div class="left"><i class="iconfont icon-quan"></i>团购券</div>
              <div class="right"><i v-if="item.type=='nopay'" class="iconfont icon-shanchu" @click="delStart(index,item.orderid)"></i>{{item.state}}</div>
            </div>
            <div class="box"@click="routerpush(item.orderid,item.teamid,item.partnerid,item.type)">
              <div class="img"><img :src="item.img" /></div>
              <div class="cont">
                <div class="cont-title">{{item.title}}</div>
              <!--   <div class="expiretime">订单时间：{{item.consumetime}}</div> -->
                <div class="expiretime">有效期：{{item.expiretime}}</div>
              </div>
            </div>
            <div class="num">
              <div class="num-box">
                <div class="num-item">实付<span>{{item.currency=="RMB"?"￥":"$"}}{{item.money}}</span></div>
                <div class="num-item">数量{{item.quantity}}</div>
              </div>
              <orderby :orderby="item.type" class="orderby" :items="item" @nopayclick="nopayclick" @againclick="againclick" @backclick="backclick" @commentclick="commentclick" @seeclick="seeclick"></orderby>
            </div>
          </div>
        </section>
        <footer class="loader-more" id="none-load"v-show="!loadernone" :class="{opacitytext:!flag&&showflag}">正在加载更多...</footer>
        <footer class="loader-none"  v-show="loadernone">已经全部加载完毕</footer>
        <div class="tip" v-if="!flag&&showflag">
          <img src="../../assets/img/none.png" alt="" />
          <p>暂无相关订单</p>
        </div>
      </div>
    </div>
    <alert v-if="showAlert"  @closeTip="closeAlert" :alertText="alertText" :suc="collectflag"></alert>
    <message v-if="showMsg"  @close="close" @del="delend"></message>
    <transition name="router-slid">
        <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import headTop from '@/components/commen/header/head'
import infiniteScroll from 'vue-infinite-scroll'
import alert from '@/components/commen/alert/alert'
import message from '@/components/commen/message/message'
import {getUserOrders,delUserNoPayOrders,TeamToOrder} from '@/service/getData'
import orderby from '@/components/commen/orderby/orderby'
import {mapState} from 'vuex'
import {getCookie} from '@/config/mUtils'
export default {
  name:'order',
  data(){
    return{
      titleName:'订单',
      noneHome:true,
      tabs:['全部','待付款','待消费','待评价','退款'],
      busy: false,
      loadernone:false,//没有数据提示
      active:0,
      flag:true,//第一次加载
      showflag:true,
      dataArr:[],
      parameter:{
        Token:null,
        Type:'all',
        PageSize:10,
        Page:1
      },
      showMsg:false,//弹出
      orderIndex:null,//dataArr中索引
      PackageIds:null,
      showAlert:false,
      alertText:null,
      collectflag:false
    }
  },
  mounted(){
    switch (this.$route.query.status) {
      case '1':
        this.active = 1;
        this.parameter = {Token:null,Type:'nopay',PageSize:10,Page:1};
        this.loadMore();
        break;
      case '2':
        this.active = 2;
        this.parameter = {Token:null,Type:'nouse',PageSize:10,Page:1};
        this.loadMore();
        break;
      case '3':
        this.active = 3;
        this.parameter = {Token:null,Type:'nocomment',PageSize:10,Page:1};
        this.loadMore();
        break;
      case '4':
        this.active = 4;
        this.parameter = {Token:null,Type:'refund',PageSize:10,Page:1};
        this.loadMore();
        break;
      default:
        this.active = 0;
        this.parameter = {Token:null,Type:'all',PageSize:10,Page:1};
        this.loadMore();
    }
    document.body.scrollTop = 0
    document.documentElement.scrollTop = 0
  },
  methods:{
    /**
     * [select 横向切换初始化]
     * @param  {[type]} index [description]
     * @return {[type]}       [description]
     */
    select(index){
      this.dataArr = [];
      this.flag = true;
      this.showflag = true;
      switch (index) {
        case 1:
          this.active = 1;
          this.parameter = {Token:null,Type:'nopay',PageSize:10,Page:1};
          this.loadMore();
          break;
        case 2:
          this.active = 2;
          this.parameter = {Token:null,Type:'nouse',PageSize:10,Page:1};
          this.loadMore();
          break;
        case 3:
          this.active = 3;
          this.parameter = {Token:null,Type:'nocomment',PageSize:10,Page:1};
          this.loadMore();
          break;
        case 4:
          this.active = 4;
          this.parameter = {Token:null,Type:'refund',PageSize:10,Page:1};
          this.loadMore();
          break;
        default:
          this.active = 0;
          this.parameter = {Token:null,Type:'all',PageSize:10,Page:1};
          this.loadMore();
          break;
      }
    },
    /**
     * [delStart 删除订单数据初始化]
     * @param  {[type]} index     [description]
     * @param  {[type]} PackageId [description]
     * @return {[type]}           [description]
     */
    delStart(index,PackageId){
      this.orderIndex = index;
      this.PackageIds = PackageId;
      this.showMsg = true;
    },
    /**
     * [delend 删除结束]
     * @return {[type]} [description]
     */
    delend(){
      delUserNoPayOrders(getCookie("USERToken"),this.PackageIds).then((response)=>{
        if(response.data.Ret==0){
          this.dataArr.splice(this.orderIndex, 1)
        }
        this.close()
      })
    },
    close(){
      this.showMsg = false
    },
    /**
     * [loadMore 无限加载]
     * @return {[type]} [description]
     */
    loadMore() {
      //防止重复请求
      this.busy = true;
      this.loadernone = false;
      if(!this.parameter.Token){
        this.parameter.Token = getCookie("USERToken")
      }
      getUserOrders(this.parameter).then((response)=>{
        if(response.data.List.length){
          this.showflag = false;
          this.flag = false;
          this.initStart(response.data.List)

          if (response.data.List.length < 10) {
            this.busy = true;
            this.loadernone = true;
            return
          }
        }else{
          // 如果没数据展示图片
          if(this.flag){
            this.flag = false;
          }else{
            this.loadernone = true;
          }
          this.busy = true;
          return
        }
        this.busy = false;
      })
    },
    /**
     * [initStart 数据转文字]
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    initStart(data){
      data.forEach( function(element, index) {
        switch (element.type) {
          case 'nocomment':
            element.state = '待评价'
            break;
          case 'nopay':
            element.state = '待付款'
            break;
          case 'nouse':
            element.state = '待消费'
            break;
          case 'refund':
            element.state = '退款'
            break;
          case 'submitted':
            element.state = '退款正在处理'
            break;
          case 'refunded':
            element.state = '已退款'
            break;
          case 'rejected':
            element.state = '退款被拒绝'
            break;
          case 'expire':
            element.state = '已过期'
            break;
          default:
            element.state = '已评价'
            break;
        }
      });
      this.dataArr = [...this.dataArr,...data]
      this.parameter.Page++;
    },
    nopayclick(items){
      this.$router.push('/pay?id='+items.orderid)
    },
    /**
     * [againclick 再来一单]
     * @param  {[type]} items [description]
     * @return {[type]}       [description]
     */
    againclick(items){
      TeamToOrder(getCookie("USERToken"),items.teamid,1).then((response)=>{
        if(response.data.PackageId){
          this.$router.push('/pay?id='+response.data.PackageId)
        }else{
          this.showAlert = true;
          this.alertText = response.data.Msg;
        }
      })
    },
    /**
     * [backclick 退款]
     * @param  {[type]} items [description]
     * @return {[type]}       [description]
     */
    backclick(items){
      let id = items.orderid;
      this.$router.push("/order/orderRefund?orderid="+id)
    },
    /**
     * [commentclick 评价]
     * @param  {[type]} items [description]
     * @return {[type]}       [description]
     */
    commentclick(items){
      let id = items.orderid;
      let partner = items.partner;
      let partnerid = items.partnerid;
      this.$router.push("/order/comment?orderid="+id+"&partnerid="+partnerid+"&partner="+partner)
    },
    seeclick(items){
      this.$router.push("/admin/ticket?orderid="+items.orderid)
    },
    closeAlert(){
      this.showAlert = false;
      this.alertText = "";
    },
    /**
     * [routerpush 订单详情]
     * @param  {[type]} orderid[description]
     * @param  {[type]} teamid [description]
     * @param  {[type]} partnerid [description]
     * @param  {[type]} type [description]
     * @return {[type]}        [description]
     */
    routerpush(orderid,teamid,partnerid ,type){
      this.$router.push("/order/orderDetail?orderid="+orderid+"&teamid="+teamid+"&partnerid="+partnerid+"&type="+type)
    }
  },
  computed: {

  },

  directives: {infiniteScroll},
  components:{headTop,orderby,message,alert},
  watch:{
    '$route' (to, from) {
      if((from.path=='/order/orderDetail/orderProgress'&&to.path=='/order')||
        (from.path=='/order/orderDetail/comment')){
        this.select(0)
      }
    }
  }
}

</script>

<style lang="scss" scoped>
  @import '../../style/mixin';
  .head-other{
    z-index: 0!important;
  }
  .box{
   padding-top:1.093333rem;
  }
  .opacitytext{opacity: 0}
  .head{
    display: flex;
    height:1.333333rem;
    line-height: 1.333333rem;
    background:#fff;
    .item{
      text-align: center;
      @include wh(25%,1.333333rem);
      @include font-dpr(15px);
      &.active{
        border-bottom: 1px solid $ic
      }
    }
  }
  .list-item{
    margin-top: 0.4rem;
    .title{
      height:1.146667rem;line-height: 1.146667rem;
      background:#fff;padding: 0 0.266667rem;
      display:flex;
      justify-content:space-between;
      @include font-dpr(15px);
      i{margin-right: 0.266667rem;@include font-dpr(16px);}
    }
    .box{
      background:#f9f9f9;
      padding: 0 0.266667rem;
      height:2.746667rem;
      display:flex;
      align-items:center;
      .img{
        margin-right: 0.4rem;@include wh(2.266667rem,2.133333rem);
        img{@include wh(2.266667rem,2.133333rem);}
      }
      .cont-title{
        @include ellipsis(3);
        @include font-dpr(13px);
      }
      .expiretime{
        @include font-dpr(13px);
      }
    }
    .num{
      padding: 0 0.266667rem;background:#fff;
      .num-box{
        display:flex;
        flex-direction:row-reverse;
        height:1.066667rem;
        line-height: 1.066667rem;
        border-bottom: 1px solid #f5f5f5;
        .num-item{margin-left: 0.266667rem;@include font-dpr(14px);span{color:$ic}}
      }
      .orderby{
        height:1.066667rem;
        line-height: 1.066667rem;
        padding-top: 0.173334rem;
      }
    }
  }
  .tip{
    text-align: center;
    img{@include wh(7.013333rem,4.773333rem);}
    p{
      margin-top: 0.4rem;
      @include font-dpr(15px);
    }
  }
  .loader-more,.loader-none{ width: 100%; height:1.28rem;text-align: center;line-height: 1.28rem}
  .router-slid-enter-active, .router-slid-leave-active {
      transition: all .4s;
  }
  .router-slid-enter, .router-slid-leave-active {
      transform: translateX(100%);
  }
  .wrap-nopay{
    background:#fff;
    .box{
      background:#f9f9f9;
      margin-bottom: 0.266667rem;
    }
  }
</style>
