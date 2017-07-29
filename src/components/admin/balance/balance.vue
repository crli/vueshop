<template>
  <div class="wrap">
    <headTop :noneHome="noneHome" :headTitle="titleName">
      <router-link to="/balance/explain" slot="edit" class="explain">使用说明</router-link>
    </headTop>
    <div class="box">
      <div class="box-wrap">
        <p class="nm">我的余额</p>
        <p><span>$<span>{{aMoney}}</span></span></p>
        <router-link to="/balance/recharge" class="recharge" tag="div">充值</router-link>
      </div>
      <router-link to="/balance/detail" class="item" tag="div">
        <div class="left">余额明细</div>
        <div class="right"><i class="iconfont icon-arrow-right"></i></div>
      </router-link>
    </div>
    <transition name="router-slid">
        <router-view></router-view>
    </transition>
  </div>

</template>

<script>
import headTop from '@/components/commen/header/head'
import {mapState} from 'vuex'
export default {
  name: 'balance',
  data () {
    return {
      titleName:'余额',
      noneHome:true,
      cMoney:0,
      aMoney:0
    }
  },

  mounted(){
    document.body.scrollTop = 0
    document.documentElement.scrollTop = 0
  },
  methods:{
    recharge(){

    }
  },
  computed:{
    ...mapState([
      'userInfo'
    ]),
  },
  watch: {
      userInfo: function (value) {
          if (value && value.ID) {
              this.cMoney = value.Money_RMB;
              this.aMoney = value.Money;
          }
      }
  },
  components:{headTop}
}
</script>
<style scoped lang="scss">
@import '../../../style/mixin';
.head-other{
  z-index: 0!important
}
  .wrap{
    .box{
      padding-top: 1.093333rem;
      .box-wrap{
        margin:0.4rem 0 0;
        background:#fff;
        text-align: center;
        padding-bottom: 0.8rem
      }
      p{padding-top: 1.013333rem;color: $ic}
      span{
        color:$ic;
        @include font-dpr(15px);
      }
      .nm{@include font-dpr(15px);color: #666}
      .item{
        margin-top: 0.4rem;
        position: relative;
        height: 1.2rem;
        background:#fff;
        line-height: 1.2rem;
        padding:0 0.266667rem;
        display: flex;
        justify-content:space-between;
        border-bottom: 1px solid #eee;@include font-dpr(14px);
        .left{color: #666}
        i{
          margin-left: 0.266667rem;
          @include font-dpr(12px);color: #666
        }
      }
    }
    .explain{
      position:absolute;
      z-index: 300;
      color:#333;
      @include font-dpr(14px);
      right:0.266667rem;
      top:0
    }
  }
  .recharge{
    width:66%;
    margin:1rem auto ;
    background-color: $ic;
    color:#fff;
    padding: .26rem 0;
    border: 1px;
    border-radius: 0.15rem;
    text-align: center;
    @include font-dpr(14px);
  }
  .router-slid-enter-active, .router-slid-leave-active {
      transition: all .4s;
  }
  .router-slid-enter, .router-slid-leave-active {
      transform: translateX(100%);
  }
</style>
