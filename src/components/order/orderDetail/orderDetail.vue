<template>
  <section class="wrap">
    <headTop :noneHome="noneHome" :headTitle="titleName"></headTop>
    <div class="box">
      <div class="section1"@click="routerpush(details.TeamId)">
        <img :src="details.Img" alt="" />
        <div class="cont">
          <div class="cont-title">{{details.PartnerName}}</div>
          <div class="cont-title-t">{{details.Title}}</div>
          <div class="cont-money" ><span>$<b>{{details.Price}}</b>起</span><span>门市价$<b>{{details.Mprice}}</b></span></div>
        </div>
        <i class="iconfont icon-arrow-right"></i>
      </div>
      <div class="section2 pb">
        <div class="item" v-for="value in tipbox"><i class="iconfont icon-xuanze"></i>{{value}}</div>
      </div>
      <section class="section-com" v-if="type=='comment'" @click="commentclick">
          <div class="left">
            <span class="star-pic">
              <i :style="'width:' + details.Score*20 + '%'"></i>
            </span>

          </div>
          <div class="right">
            <span>{{details.Score||"暂无评"}}分<i v-if="details.Score" class="iconfont icon-arrow-right"></i></span>
          </div>
      </section>
      <section class="section3 pb">
        <div class="title">商家信息</div>
        <div class="cont">
          <div class="cont-left">
            <p>{{partnerInfo.Title}}</p>
            <p>{{partnerInfo.Address}}</p>
            <p><i class="iconfont icon-weizhi"></i>{{teaminfo.Distance}} <span>离我最近</span></p>
          </div>
          <div class="cont-right">
            <a :href="'tel:'+partnerInfo.Tel" class="item"><i class="iconfont icon-phone"></i></a>
          </div>
        </div>
        <div class="other" @click="otherpartner" v-show="teaminfo.PartnerNum>1"><div class="left">查看其他使用门店({{teaminfo.PartnerNum-1}}家)</div><div class="right"><i class="iconfont icon-arrow-right"></i></div></div>
      </section>
      <section class="section4">
        <div class="title">
          <p>团购券</p>
          <span>有效期至：{{details.ExpireDate}}</span>
          <!-- <div class="refund" @click="actionto()" v-if="state=='ToRefund'">{{txt}}</div> -->
        </div>
        <div class="couponbox">
          <div class="item" v-for="(item,index) in details.Coupon">
            <span>券码{{index+1}}：{{item.id}}</span>
            <span>{{type=='comment'||type=='nocomment'?"已使用":"待使用"}}</span>
          </div>
        </div>
      </section>
      <section class="section5" v-if="type=='refunded'||type=='askrefund'" v-for="value in details.refundlist">
        <div class="item-t" v-for="v in value.Coupon">
          <span >券码：{{v}}</span>
          <span>{{value.State}}</span>
        </div>
        <div class="item" @click="refundto(value.Id)">
          <div class="left"><span>查看退款详情</span></div>
          <div class="right"><i class="iconfont icon-arrow-right"></i></div>
        </div>
      </section>
      <section class="section-del">
        <div class="del-title">套餐内容</div>
        <div class="item" v-for="item in teaminfo.Package">
          <div class="title">{{item.name}}</div>
          <div class="item-box">
            <div class="list" v-for="value in item.item">
              <span>{{value.title}}</span><span>{{value.num}}</span><span>{{value.price}}</span>
            </div>
          </div>
        </div>

      </section>
      <section @click="detailto" class="section6">
        <div class="left"><span>查看图文详情</span></div>
        <div class="right"><i class="iconfont icon-arrow-right"></i></div>
      </section>
      <section class="section7">
        <div class="title"><span>订单详情</span></div>
        <div class="item"><span>订单编号：</span><span>{{details.OrderId}}</span></div>
        <div class="item"><span>付款时间：</span><span>{{details.Time}}</span></div>
        <div class="item"><span>购买手机号：</span><span>{{details.Mobile||"暂无"}}</span></div>
        <div class="item"><span>数量：</span><span>{{details.Quantity}}</span></div>
        <div class="item"><span>小计：</span><span>{{details.Currency=="RMB"?"￥":"$"}}<b>{{details.Subtotal}}</b></span></div>
        <div class="item"><span>消费税：</span><span>{{details.Currency=="RMB"?"￥":"$"}}<b>{{details.Tax}}</b></span></div>
        <div class="item"><span>U币抵扣：</span><span>{{details.Currency=="RMB"?"￥":"$"}}<b>{{details.PointPay||0}}</b></span></div>
        <div class="item"><span>总价：</span><span>{{details.Currency=="RMB"?"￥":"$"}}<b>{{details.ActualPay}}</b></span></div>
      </section>
    </div>
    <transition name="router-slid">
        <router-view></router-view>
    </transition>
  </section>
</template>

<script>

import headTop from '@/components/commen/header/head'
import {getTeamInfo,getPartnerInfo,GetOrderDetail} from '@/service/getData'
import {mapState,mapMutations} from 'vuex'
import {getCookie} from '@/config/mUtils'
export default {
  name: 'orderDetail',
  data () {
    return {
      titleName:'订单详情',
      noneHome:true,
      orderid:null,
      teamid:null,
      partnerid:null,
      details:{},
      Coupon:null,
      txt:null,
      tipbox:[],
      teaminfo:{},
      partnerInfo:{},
      state:'',
      index:'',
      type:''
    }
  },
  created(){
    document.body.setAttribute("class","hid");
    if(!this.longitude){
      this.getLocation()
    }else{
      this.init()
    }
  },
  mounted(){

  },
  methods:{
    ...mapMutations([
      'SET_LOG_AND_LAT'
    ]),
    init(){
      this.tipbox = [];
      this.orderid = this.$route.query.orderid;
      this.teamid = this.$route.query.teamid;
      this.partnerid = this.$route.query.partnerid;
      this.index = this.$route.query.index;
      this.type = this.$route.query.type;
      this.$ajax.all([
        getTeamInfo(this.teamid,getCookie("USERToken"),this.longitude,this.latitude),
        getPartnerInfo(this.partnerid,getCookie("USERToken")),
        GetOrderDetail(getCookie("USERToken"),this.orderid)
        ]).then(this.$ajax.spread((res1, res2,res3)=> {
          this.teaminfo = res1.data;
          this.initData(this.teaminfo);
          this.partnerInfo = res2.data;
          this.details = res3.data;
          this.state = this.details.ButtonState.Action;
          this.txt = this.details.ButtonState.Txt;

          let arr = [];
          this.details.Coupon.forEach((res,index)=>{
            arr.push(res.id)
          })
          this.Coupon = arr.join(",");
      }));
    },
    initData(data){
      if(data.AllowreFund == "Y"){
        this.tipbox.push("随便退")
      }
      if(data.Appointment == "Y"){
        this.tipbox.push("可预约")
      }
      if(data.WeekEnd == "Y"){
        this.tipbox.push("周末可用")
      }
      if(data.Holiday == "Y"){
        this.tipbox.push("节假日可用")
      }
    },
    routerpush(id){
      this.$router.push("/team?id="+id)
    },
    commentdetail(){
      this.$router.push("/order/orderDetail/allcomment?id="+this.teamid+"&type=t")
    },
    detailto(){
      this.$router.push("/order/orderDetail/teamdetail?id="+this.teamid+"&pid="+this.partnerid)
    },
    otherpartner(){
      this.$router.push("/team/otherpartner?id="+this.teamid)
    },
    refundto(id){
      this.$router.push("/order/orderDetail/orderProgress?refundId="+id)
    },
    commentclick(){
      this.$router.push("/order/comment?orderid="+this.orderid+"&partnerid="+this.partnerid+"&partner="+this.details.PartnerName)
    },
    actionto(){
      this.$router.push("/order/orderDetail/orderRefund?orderid="+this.orderid+"&teamid="+this.teamid+"&partnerid="+this.partnerid);
    },
    getLocation(){
      if (navigator.geolocation){
        navigator.geolocation.getCurrentPosition((position)=>{
          this.SET_LOG_AND_LAT({longitude:position.coords.latitude.toFixed(7),latitude:position.coords.longitude.toFixed(7)})
          this.init()
        },(error)=>{
          this.init()
        });
      }else{
        this.init()
      }
    },
  },

  destroyed(){
    document.body.removeAttribute("class","hid");
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
  @import '../../../style/mixin';
  .wrap{
    position: fixed;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    z-index: 0;
    background:#eee;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    .box{
      padding-top: 1.093333rem;
      width:100%;
      height:100%;
      overflow: auto;
      -webkit-overflow-scrolling: touch;
    }
    .star-pic{
      @include wh(2.173333rem, 0.346667rem);
      background: url('../../../assets/img/star0.png') no-repeat;
      background-size: 100% 100%;
      display: inline-block;
      vertical-align: middle;
      margin-right: 0.133333rem;
      i{
        background: url('../../../assets/img/star.png')no-repeat;
        display: inline-block;
        height: 0.346667rem;
        overflow: hidden;
        vertical-align: top;
        background-size: auto 100%;
      }
    }
    .section1{
      display:flex;
      padding: 0.266667rem;
      background:#f9f9f9;
      position: relative;
      img{
        @include wh(2.4rem,2.2rem);
        margin:0 0.453333rem 0 0rem;
      }
      .cont{
        width:4.8rem;line-height: 0.506667rem;
        .cont-title{
          @include ellipsis(1)
          @include font-dpr(16px);
          line-height: 0.8rem
        }
        .cont-title-t{
          @include ellipsis(1);
          @include font-dpr(14px);
          line-height: 0.8rem
        }
        .cont-money{
          line-height: 0.8rem;
          span:first-child{
            color:$ic;@include font-dpr(12px);margin-right: 0.133333rem;
            b{color:$ic;@include font-dpr(15px);}
          }
          span:last-child{
            color:#666;@include font-dpr(10px);
            b{@include font-dpr(10px);}
          }
        }
        .cont-how{
          line-height: 0.613333rem;@include font-dpr(12px);color:#666
        }
      }
      .num{
        position:absolute;
        top:0.2rem;
        right:0.266667rem;
        @include font-dpr(14px);
      }

      .icon-arrow-right{
        @include ct;
        right:0.266667rem; @include font-dpr(14px);
      }
    }
    .section2{
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
    .section-com{
      background:#fff;
      padding:0 0.266667rem;
      margin:0.373333rem 0;
      display:flex;justify-content:space-between;line-height: 1.093333rem;
      span{
        @include font-dpr(13px);
        color:$ic;
      }
      .right{
        .iconfont{@include font-dpr(14px);}
      }
    }
    .section-del{
      margin-top: 0.4rem;
      background:#fff;
      padding:0 0.266667rem;
      .del-title, .title{
        line-height: 1.333333rem;
        border-bottom: 1px solid #eee;
        @include font-dpr(13px)
      }
      .item-box{
        border-bottom: 1px solid #eee;
      }
      .list{
        line-height: 1.066667rem;
        display:flex;
        justify-content:space-between;@include font-dpr(13px)
      }
    }
    .section3{
      margin-bottom: 0.373333rem;
      .title{
        line-height: 1.333333rem;
        @include font-dpr(16px);
        border-bottom: 1px solid #eee;
      }
      .cont{
        display:flex;
        padding: 0.333333rem 0;
        .cont-left{
          flex:1;
          p{@include font-dpr(12px);}
          p:nth-child(1){
            line-height: 0.853333rem;
            @include font-dpr(17px)
          }
          p:nth-child(2){
            line-height: 0.8rem
          }
          p:nth-child(3){
            line-height: 0.746667rem
          }
          i{@include font-dpr(13px);margin-right: 0.266667rem;}
          span{color:$fcolor;margin-left: 0.266667rem;}
        }
        .cont-right{
          position: relative;
          width:1.706667rem;
          a{@include center;}
          i{@include font-dpr(28px);color:$fcolor}
        }
      }
      .other{
        display:flex;
        justify-content:space-between;
        line-height: 1.12rem;
        border-top: 1px solid #eee;
        .left{
          @include font-dpr(14px);
          color: $ic
        }
        .right{
          i{@include font-dpr(14px);}
        }
      }

    }
    .section4{
      background:#fff;
      .title{
        padding:0.133333rem 0.266667rem 0.266667rem;
        border-bottom: 1px solid #eee;
        position: relative;
        p{
          line-height: 0.8rem;
          @include font-dpr(16px);
        }
        span{line-height: 0.56rem;@include font-dpr(13px);}
        .refund{
          position: absolute;
          @include wh(2.213333rem,0.826667rem);
          background:$fcolor;
          color:#fff;
          line-height: 0.826667rem;
          text-align: center;
          border-radius: 0.133333rem;
          right:0.32rem;
          top:0.453333rem;
        }
      }
      .couponbox{
        padding:0 0.266667rem;
        .item{
          display:flex;
          justify-content:space-between;
          @include font-dpr(15px);
          line-height: 1.173333rem;
        }
      }
    }
    .section5{
      background:#fff;
      line-height: 1.093333rem;
      padding:0 0.266667rem;
      margin:0.373333rem 0;
      .item{
        display:flex;justify-content:space-between;
        border-top: 1px solid #eee;
        span{
          color:$ic;
          @include font-dpr(14px);
        }
        .right{
          i{@include font-dpr(14px);}
        }
      }
      .item-t{
        display:flex;
        justify-content:space-between;
        @include font-dpr(15px);
        line-height: 1.173333rem;
      }
    }
    .section6{
      background:#fff;
      line-height: 1.093333rem;
      padding:0 0.266667rem;
      margin:0.373333rem 0;display:flex;justify-content:space-between;
      span{
        color:$ic;
        @include font-dpr(14px);
      }
      .right{
        i{@include font-dpr(14px);}
      }
    }
    .section7{
      background:#fff;
      padding:0 0.266667rem;
      .title{
        border-bottom: 1px solid #eee;
        line-height: 1.28rem;
        @include font-dpr(16px);
      }
      .item{
        line-height: 1.173333rem;
        @include font-dpr(14px);
        border-bottom: 1px solid #eee;
        span:first-child{
          display:inline-block;
          width:2.533333rem;
        }
      }
    }
  }
</style>
