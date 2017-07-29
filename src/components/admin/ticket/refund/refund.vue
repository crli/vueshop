<template>
  <div class="wrap">
    <headTop :noneHome="noneHome" :headTitle="titleName"></headTop>
    <div class="box">
      <section class="section1"v-if="txt=='CouponId'">
        <div><p><span><i class="iconfont icon-xuanzhong"></i>由我券：</span>：{{CouponId}}</p></div>
      </section>
      <section class="section" v-if="txt=='OrderId'">
        <img :src="OrderDetail.Img" alt="" />
        <div class="cont">
          <div class="cont-title">{{OrderDetail.PartnerName}}</div>
          <div class="cont-title-t">{{OrderDetail.Title}}</div>
          <div class="cont-time">有效期至{{OrderDetail.ExpireDate}}</div>
        </div>
        <div class="num">×{{OrderDetail.Quantity}}</div>
      </section>
      <section  class="section2">
        <div class="item">退款总额：<span>{{details.Currency=="Dollar"?'$':'￥'}}<b>{{details.Money}}</b></span></div>
        <div class="item"><div>U币抵扣金额：<span>{{details.Currency=="Dollar"?'$':'￥'}}<b>{{details.PointPay}}</b></span></div> <div class="tip">将退至您的U积分账户</div></div>
      </section>
      <section  class="section3">
        <div class="item">
          <label for="one">退至余额：<span>(即时到帐,推荐)</span></label>
          <input type="radio" id="one" value="One" v-model="checked">
        </div>
        <div class="item">
          <label for="two">原路退回：<span>(3-5个工作日退款到原支付方)</span></label>
          <input type="radio" id="two" value="Two" v-model="checked">
        </div>
      </section>
      <!-- <section  class="section4">
        <div class="title">退款原因<span>(至少选择一个)</span></div>
        <div class="reason-box">
          <div class="item" v-for="(item,key,index) in reason">
            <label :for="key">{{item}}</label><input type="checkbox" :id="key" :value="key" v-model="checkedbox">
          </div>
        </div>
      </section> -->
      <section  class="section5">
        <p class="title">有意见？来吐槽？</p>
        <textarea v-model="message" placeholder="意见不怕多，就怕你不说~" class="message"></textarea>
      </section>
      <div class="submit" @click="submit">申请退款</div>
    </div>
    <transition name="router-slid">
        <router-view></router-view>
    </transition>
    <alert v-if="showAlert"  @closeTip="close" :alertText="alertText" :suc="collectflag"></alert>
  </div>
</template>

<script>
import headTop from '@/components/commen/header/head'
import alert from '@/components/commen/alert/alert'
import {mapMutations,mapState} from 'vuex'
import {UserCouponRefund,GetRefundReason,GetCouponInfo,UserOrderRefund,GetOrderDetail} from '@/service/getData'
import {getCookie} from '@/config/mUtils'
export default {
  name: 'refund',
  data () {
    return {
      titleName:'退款原因',
      noneHome:true,
      showAlert:false,
      collectflag:false,
      alertText:null,
      reason:{},
      CouponId:null,
      details:{},
      checked:'One',
      checkedbox:[],
      message:null,
      txt:"",
      OrderId:'',
      OrderDetail:{},
      flag:'',
      index:'',
      refundId:''//退款Id
    }
  },
  methods:{
    ...mapMutations([
      'OUT_LOGIN'
    ]),

    close(){
      if(this.collectflag){
        this.$router.push("/admin/ticket/refund/refDetails?refundId="+this.refundId)

      }
      this.showAlert = false;
    },
    submit(){
      // if(this.checkedbox.length==0){
      //   this.showAlert = true;
      //   this.alertText = "请选择退款原因";
      // }else{
      //   let Way = this.checked=="One"?'site':'from';
      //   let Reason = this.checkedbox.join(",");
      //   if(this.txt == "CouponId"){
      //     UserCouponRefund(getCookie("USERToken"),this.CouponId,Reason,Way,this.message).then((response)=>{
      //       if(response.data.Ret == 0){
      //         this.refundId = response.data.Id;
      //         this.showAlert = true;
      //         this.alertText = "申请成功";
      //         this.collectflag = true;
      //         this.tickets[this.flag].forEach((ele,index)=>{
      //           ele.Coupon.forEach((element,i)=>{
      //             if(element.Id == this.CouponId){
      //               ele.Coupon.splice(i,1)
      //             }
      //           })
      //         })
      //       }else{
      //         this.showAlert = true;
      //         this.alertText = response.data.msg;
      //       }
      //     })
      //   }else{
      //     UserOrderRefund(getCookie("USERToken"),this.OrderId,Reason,Way,this.message).then((response)=>{
      //       if(response.data.Ret == 0){
      //         this.refundId = response.data.Id;
      //         this.showAlert = true;
      //         this.alertText = "申请成功";
      //         this.collectflag = true;
      //         this.tickets&&this.tickets[this.flag].splice(this.index,1)
      //       }else{
      //         this.showAlert = true;
      //         this.alertText = response.data.msg;
      //       }
      //     })
      //   }
      // }
      let Way = this.checked=="One"?'site':'from';
      let Reason = this.checkedbox.join(",");
      if(this.txt == "CouponId"){
        UserCouponRefund(getCookie("USERToken"),this.CouponId,Reason,Way,this.message).then((response)=>{
          if(response.data.Ret == 0){
            this.refundId = response.data.Id;
            this.showAlert = true;
            this.alertText = "申请成功";
            this.collectflag = true;
            this.tickets[this.flag].forEach((ele,index)=>{
              ele.Coupon.forEach((element,i)=>{
                if(element.Id == this.CouponId){
                  ele.Coupon.splice(i,1)
                }
              })
            })
          }else{
            this.showAlert = true;
            this.alertText = response.data.msg;
          }
        })
      }else{
        UserOrderRefund(getCookie("USERToken"),this.OrderId,Reason,Way,this.message).then((response)=>{
          if(response.data.Ret == 0){
            this.refundId = response.data.Id;
            this.showAlert = true;
            this.alertText = "申请成功";
            this.collectflag = true;
            this.tickets[this.flag].splice(this.index,1)
          }else{
            this.showAlert = true;
            this.alertText = response.data.msg;
          }
        })
      }
    }
  },

  created(){
    document.body.setAttribute("class","hid");
    this.flag = this.$route.query.flag;
    this.index = this.$route.query.index;
    if(this.$route.query.couponid){
      this.txt = "CouponId";
      this.CouponId = this.$route.query.couponid;
    }else{
      this.txt = "OrderId";
      this.OrderId = this.$route.query.OrderId;
    }

  },
  mounted(){
    // GetRefundReason(getCookie("USERToken")).then((response)=>{
    //   if(response.data.ret == 1001){
    //     this.OUT_LOGIN();
    //     this.$router.push('/')
    //   }else{
    //     this.reason = response.data;
    //     if(this.txt == "CouponId"){
    //       GetCouponInfo(this.CouponId,getCookie("USERToken")).then((res)=>{
    //         if(response.data.ret == 1001){
    //           this.OUT_LOGIN();
    //           this.$router.push('/')
    //         }else{
    //           this.details = res.data;
    //         }
    //       })
    //     }else{
    //       GetOrderDetail(getCookie("USERToken"),this.OrderId).then((res)=>{
    //         if(response.data.ret == 1001){
    //           this.OUT_LOGIN();
    //           this.$router.push('/')
    //         }else{
    //           this.OrderDetail = res.data;
    //           this.details = {
    //             'Currency':res.data.Currency,
    //             'Money':res.data.ActualPay,
    //             'PointPay':res.data.PointPay
    //           };
    //         }
    //       })
    //     }
    //   }
    // })
    if(this.txt == "CouponId"){
      GetCouponInfo(this.CouponId,getCookie("USERToken")).then((res)=>{
        if(res.data.ret == 1001){
          this.OUT_LOGIN();
          this.$router.push('/')
        }else{
          this.details = res.data;
        }
      })
    }else{
      GetOrderDetail(getCookie("USERToken"),this.OrderId).then((res)=>{
        if(res.data.ret == 1001){
          this.OUT_LOGIN();
          this.$router.push('/')
        }else{
          this.OrderDetail = res.data;
          this.details = {
            'Currency':res.data.Currency,
            'Money':res.data.ActualPay,
            'PointPay':res.data.PointPay
          };
        }
      })
    }
  },
  computed:{
    ...mapState([
      'tickets','userInfo'
    ])
  },
  destroyed(){
    if(this.$route.path == "/order"){
      document.body.removeAttribute("class","hid");
    }
  },
  components:{headTop,alert}
}
</script>
<style scoped lang="scss">
@import '../../../../style/mixin';
.wrap{
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  z-index: 1100;
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
  .section{
    display:flex;
    padding: 0.266667rem;
    background:#f9f9f9;
    position: relative;
    img{
      @include wh(2.4rem,2.2rem);
      margin:0 0.453333rem 0 0rem;
    }
    .cont{
     line-height: 0.506667rem;
      .cont-title{
        @include ellipsis(1)
        @include font-dpr(16px);
        line-height: 0.8rem;
        width:5rem
      }
      .cont-title-t{
        @include ellipsis(1);
        @include font-dpr(14px);
        line-height: 0.8rem
      }
      .cont-time{
        @include ellipsis(1);
        @include font-dpr(10px);
        line-height: 0.8rem
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
  .section1{
    p{line-height: 1.066667rem}
    background:#fff;
    padding:0 0.266667rem;
    i{color:$ic;margin:0 0.266667rem;}
    span{@include font-dpr(14px);}
  }
  .section2{
    padding:0 0.266667rem;
    background:#fff;
    margin-top:0.373333rem;
    .item{line-height: 1.2rem;@include font-dpr(14px);}
    span,b{color:$ic;@include font-dpr(14px);}
    .item:last-child{
      display:flex;
      justify-content:space-between;
      .tip{@include font-dpr(11px);color:#bbb}
    }
  }
  .section3{
    margin-top:0.373333rem;
    .item{
      padding:0 0.266667rem;
      background:#fff;
      line-height: 1.333333rem;
      height:1.333333rem;
      display:flex;
      justify-content:space-between;
      align-items:center;
      border-bottom: 1px solid #eee;
      label{@include font-dpr(14px);}
      span{color:$ic;@include font-dpr(11px);}
    }
  }
  .section4{
    margin-top:0.373333rem;
    background:#fff;
    .title{
      padding:0 0.266667rem;
      line-height: 1.333333rem;
      @include font-dpr(13px);
      span{@include font-dpr(10px);}
    }
    .item{
      padding:0 0.266667rem;
      line-height: 1.333333rem;
      display:flex;
      justify-content:space-between;
      align-items:center;
      border-bottom: 1px solid #eee;
      label{@include font-dpr(13px);}
    }
  }
  .section5{
    margin-top:0.373333rem;
    background:#fff;
    .title{
        line-height: 1.066667rem;color:#666;@include font-dpr(14px);border-bottom: 1px solid #eee;padding:0 0.266667rem;
      }
      .message{
        @include wh(100%,6.0rem);@include font-dpr(14px);padding:0 0.266667rem;
      }
  }
  .submit{
    width:88%;
    margin:0.373333rem auto;
    background-color: $ic;
    color:#fff;
    padding: .26rem 0;
    border: 1px;
    border-radius: 0.15rem;
    text-align: center;
    @include font-dpr(16px);
  }
}

</style>
