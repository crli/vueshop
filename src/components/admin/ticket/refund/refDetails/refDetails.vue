<template>
  <div class="wrap">
    <headTop :noneHome="noneHome" :headTitle="titleName"></headTop>
    <div class="box">
      <div class="title">
        <p>退款金额<span>{{details.Currency=="RMB"?"￥":"$"}}{{details.Money}}</span></p>
        <p>退款账户<span :style="{color:'#b4b4b4'}">{{details.Way}}</span></p>
      </div>
      <div class="box-wrap">
        <div class="top">
          <div class="left">退款流程</div>
          <div class="right" @click="refDescription">退款说明<i class="iconfont icon-arrow-right"></i></div>
        </div>
        <div class="bottom">
          <div class="left" :style="{height: height+'px' }"><span></span></div>
          <div class="right"ref="right">
            <div class="item" >
              <div class="item-title">申请已提交</div>
              <p>您的退款申请已成功提交</p>
              <p>{{details.AddTime}}</p>
            </div>
            <div class="item" ref="item2">
              <div class="item-title">由我团处理中</div>
              <p>您的退款申请已受理，由我团会尽快完成审核，请您耐心等待。</p>
            </div>
            <div class="item" :class="details.Way=='本站帐户'?'':'item-no'" ref="item3">
              <div class="item-title">退款成功</div>
              <p v-if="details.Way=='本站帐户'">{{details.Currency=="RMB"?"￥":"$"}}{{details.Money}}已经退至您的{{details.Way}}</p>
              <p v-else>{{details.Currency=="RMB"?"￥":"$"}}{{details.Money}}退款会在3-5个工作日内退至您的{{details.Way}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <transition name="router-slid">
        <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import headTop from '@/components/commen/header/head'
import {mapMutations} from 'vuex'
import {GetRefundInfo} from '@/service/getData'
import {getCookie} from '@/config/mUtils'
export default {
  name: 'refDetails',
  data () {
    return {
      titleName:'退款详情',
      noneHome:true,
      refundId:null,
      details:{},
      height:0
    }
  },
  methods:{
    ...mapMutations([
      'OUT_LOGIN'
    ]),
    refDescription(){
      this.$router.push("/admin/ticket/refund/refDetails/refDescription")
    }
  },
  created(){
    document.body.setAttribute("class","hid");
    this.refundId = this.$route.query.refundId;
  },
  mounted(){
    //0.88 title/2+p
    this.height = this.$refs.right.clientHeight-parseFloat(document.documentElement.style.fontSize)*0.88
    GetRefundInfo(getCookie("USERToken"),this.refundId).then((response)=>{
      this.details = response.data
    })
  },
  computed:{

  },
  destroyed(){
  },
  components:{headTop,alert}
}
</script>
<style scoped lang="scss">
@import '../../../../../style/mixin';
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
  .title{
    background:#fff;
    padding:0.266667rem;
    p{line-height: 0.8rem;@include font-dpr(14px);}
    span{
      margin-left: 0.533333rem;
      color: $fcolor
    }
  }
  .box-wrap{
    margin-top: 0.373333rem;
    background:#fff;
  }
  .top{
    line-height: 0.986667rem;
    display:flex;
    padding:0 0.266667rem;
    justify-content:space-between;@include font-dpr(14px);
    border-bottom: 1px solid #eee;
    .right{color:#999;@include font-dpr(13px);}
    i{@include font-dpr(14px);}
  }
  .bottom{
    padding-top: 0.4rem;
    display:flex;
    .left{
      width:0.86rem;
      height:4.6rem;
      top:0.333333rem;
      position: relative;
      span{
        @include cl;
        display:block;
        height:100%;
        width:1px;
        background:#c5c5c5;
        z-index: 1000
      }
    }
    .right{
      .item{
        padding-bottom: 0.333333rem;
        position: relative;
        &:before{
          position: absolute;
          content:"";
          @include wh(0.24rem,0.24rem);
          background:$fcolor;
          border-radius: 50%;
          left:-0.55rem;
          top:0.2266665rem;
          z-index: 2000;
        }
        &.item-no{
          &:before{background:#c5c5c5}
          .item-title{
            color:#666
          }

        }
      }
      .item-title{
        line-height: 0.693333rem;
        color:$fcolor;
        @include font-dpr(15px);


      }
      p{
        line-height: 0.533333rem;
        @include font-dpr(13px)
      }
    }
  }
}

</style>
