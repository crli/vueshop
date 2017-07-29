<template>
  <div class="wrap">
    <headTop :noneHome="noneHome" :headTitle="titleName"></headTop>
    <div class="box">
        <p>1、账户余额是UWorld由我自有的支付工具，您在提交订单的时候，可以选择账户余额进行支付。</p>
        <p>2、账户余额可充值，暂不可提现。</p>
        <p>3、使用账户余额进行支付，可以省去跳转支付或输入信用卡信息的步骤，省时省力；</p>
        <p>4、如退款时选择“退至账户余额”，则可享受“极速退款”服务，钱款即时退至账户余额，无需等待审核。</p>
        <p>5、若账户余额不足以支付订单总金额，则应通过其他付款方式补全价款，或先行充值后下单付款。</p>
        <p>6、人民币/美元账户余额的充值及在支付过程中补全价款等，只能通过同币种进行充值/支付，不可用美元信用卡/储蓄卡充值/支付人民币，或通过支付宝、微信充值/支付美元。</p>
    </div>
  </div>
</template>

<script>
import headTop from '@/components/commen/header/head'
export default {
  name: 'explain',
  data () {
    return {
      titleName:'使用说明',
      noneHome:true
    }
  },
  components:{headTop}
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
    z-index: 3;
    background:#fff;
    overflow: auto;
    .box{
      padding-top: 1.093333rem;
      width:100%;
      height:100%;
      p{padding:0.066667rem 0.266667rem;
        line-height: 0.613333rem;
        @include font-dpr(14px)
      }
    }
  }

</style>
