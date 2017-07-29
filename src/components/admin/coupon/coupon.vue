<template>
  <section class="coupon">
    <headTop noneHome=true headTitle="优惠券">
    </headTop>
    <div class="coupon-box">
      <div class="tip">
        <img src="../../../assets/img/none.png" alt="" />
        <p>暂无相关优惠券</p>
      </div>
    </div>
  </section>
</template>

<script>

import headTop from '@/components/commen/header/head'

export default {
  name: 'coupon',
  data () {
    return {
    }
  },
  created(){
    document.body.setAttribute("class","hid");
  },
  destroyed(){
    document.body.removeAttribute("class","hid");
  },
  methods:{

  },

  components:{headTop}
}
</script>

<style scoped lang="scss">
  @import '../../../style/mixin';
  .coupon{
    position: fixed;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    z-index: 0;
    background:#fff;
    overflow: auto;
    .coupon-box{
      width:100%;
      height:100%;
      padding-top:1.093333rem;
    }
  }
  .tip{
    text-align: center;
    margin-top: 2.666667rem;
    img{@include wh(7.013333rem,4.773333rem);}
    p{
      margin-top: 0.4rem;
      @include font-dpr(15px);
    }
  }
</style>
