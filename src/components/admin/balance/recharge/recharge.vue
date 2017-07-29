<template>
  <div class="wrap-re">
    <headTop :noneHome="noneHome" :headTitle="titleName"></headTop>
    <div class="box">
      <img src="../../../../assets/img/cc.jpg" alt="" class="img" />
      <div class="use">
        <div class="money">
          <div class="item" v-for="(value,index) in money" @click="selectmoney(value,index)" :class="{now:now==index}">
            <p class="color">$<span>{{value}}</span></p>
            <p>送{{value/10}}积分</p>
          </div>
        </div>
      </div>
      <div class="itembox">
        <span>金额：</span><input type="text" placeholder="请输入充值金额" v-model="value" @input="inputnum"/>
      </div>
      <div class="title">选择支付方式</div>
      <div class="methods">
        <div class="item" v-if="BankCardList.length" v-for="value in BankCardList" >
          <label :for="value.Id"><img :src="handimg(value.Type)"  alt="" />{{value.Card}}</label>
          <input type="radio" :id="value.Id" :value="value.Id" v-model="type">
        </div>
        <div class="item" v-if="ISWEIXIN">
          <label for="WAPWxPay"><img src="../../../../assets/img/wx.png" alt="" />微信支付</label>
          <input type="radio" id="WAPWxPay" value="WAPWxPay" v-model="type">
        </div>
        <div class="item">
          <label for="WAPAliPay"><img src="../../../../assets/img/zfb.png" alt="" />支付宝支付</label>
          <input type="radio" id="WAPAliPay" value="WAPAliPay" v-model="type">
        </div>
        <div class="item" @click="$router.push('/bankCard')">
          <label><img src="../../../../assets/img/adds.png" alt="" /><span>使用新银行卡</span></label>
          <i class="iconfont icon-arrow-right"></i>
        </div>
      </div>

      <div class="recharge-to" v-if="paymsg" @click="recharge">立即支付</div>
      <div class="recharge-to" v-else>支付中...</div>
    </div>
    <alert v-if="showAlert"  @closeTip="closeAlert" :alertText="alertText" :suc="collectflag"></alert>
  </div>

</template>

<script>
import headTop from '@/components/commen/header/head'
import alert from '@/components/commen/alert/alert'
import {mapState} from 'vuex'
import {UserRecharge,getUserBankCardList} from '@/service/getData'
import {getCookie,setStore} from '@/config/mUtils'
import MasterCard from '@/assets/img/MasterCard.png'
import ivisa from '@/assets/img/visa.png'
import DISCOVER from '@/assets/img/DISCOVER.png'
import JCB from '@/assets/img/JCB.png'
export default {
  name: 'recharge',
  data () {
    return {
      titleName:'充值',
      noneHome:true,
      money:[100,200,300,500,800,1000,2000],
      USD:true,//默认美元
      now:-1,//默认不选
      type:'',
      value:null,//选择钱数
      BankCardList:[],
      cardId:'',
      alertText:"",
      showAlert:false,
      collectflag:false,
      url:"",
      rightNum:true,

      ISWEIXIN:true,
      paymsg:true
    }
  },

  created(){
    document.body.setAttribute("class","hid");
  },
  async mounted(){
    if(!this.isWeiXin()){
      this.ISWEIXIN = false;
    }
    let response =  await getUserBankCardList(getCookie("USERToken"))
    this.BankCardList = response.data

    let Payment = this.userInfo.Payment;
    if(Payment=='wxpay'){
      if(this.ISWEIXIN){
        this.type = "WAPWxPay";
      }else{
        this.type = 'WAPAliPay'
      }
    }else if(Payment=='alipay'){
      this.type = 'WAPAliPay'
    }else if(!isNaN(Payment)){
      this.type = Payment
    }else{
      this.type = this.BankCardList[0].Id
    }
  },
  destroyed(){
    document.body.removeAttribute("class","hid");
  },
  methods:{
    // //判断是否微信登陆
    isWeiXin() {
      var ua = window.navigator.userAgent.toLowerCase();
      if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        return true;
      } else {
        return false;
      }
    },
    selectmoney(value,index){
      this.now = index;
      this.value = value;
      this.rightNum = true;
    },
    callpay(){
      if (typeof WeixinJSBridge == "undefined"){
        if( document.addEventListener ){
          document.addEventListener('WeixinJSBridgeReady', this.jsApiCall, false);
        }else if (document.attachEvent){
          document.attachEvent('WeixinJSBridgeReady', this.jsApiCall);
          document.attachEvent('onWeixinJSBridgeReady', this.jsApiCall);
        }
      }else{
        this.jsApiCall();
      }
    },
    jsApiCall(){
      WeixinJSBridge.invoke('getBrandWCPayRequest',this.wxparam,
          function(res){
              WeixinJSBridge.log(res.err_msg);
          }
      );
    },
    handimg(type){
      switch (type){
        case 'visa':
        return ivisa
          break;
        case 'jcb':
        return JCB
          break;
        case 'mastercard':
        return MasterCard
          break;
        case 'discover':
        return DISCOVER
          break;
      }
    },
    recharge(){
      this.paymsg = false;
      let type = "";
      if(!isNaN(this.type)){
        this.cardId = this.type
        type = "WAPVisa"
      }else{
        this.cardId = '';
        type = this.type
      }
      if(this.value&&this.rightNum){
        UserRecharge(getCookie("USERToken"),this.value,type,this.cardId)
        .then((response)=>{
          if(response.data.Ret == -1){
            switch (type) {
              case 'WAPWxPay':
                this.wxparam = response.data.WxSign;
                this.callpay();
                break;
              case 'WAPAliPay':
                window.location.href = response.data.Url
                break;
            }
          }else{
            this.alertText = response.data.Msg;
            this.showAlert = true;
          }
        })
        .catch((e)=>{
          setTimeout(()=>{
            this.paymsg = true;
          },1200)
        })
      }else{
        this.paymsg = true;
        this.alertText = "请输入正确金额";
        this.showAlert = true;
      }

    },
    inputnum(){
      this.now = -1;

      if(/^\d$/.test(parseInt(this.value))){
          this.rightNum = true;
      }else{
          this.rightNum = false;
      }
    },
    closeAlert(){
      this.showAlert = false;
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
              this.aMoney = value.Money;
          }
      }
  },
  components:{headTop,alert}
}
</script>
<style scoped lang="scss">
@import '../../../../style/mixin';
.addCard{
  width:50%;
  margin:0 auto;
  background-color: $ic;
  color:#fff;
  padding: .2rem 0;
  border: 1px;
  border-radius: 0.15rem;
  text-align: center;
  @include font-dpr(14px);
}
  .wrap-re{
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
    .img{
      width:100%;
      height:2.133333rem;
      margin-bottom: 0.4rem;
    }
    .use{
      background:#fff;
      .select{
        height:0.986667rem;
        line-height: 0.986667rem;
        display:flex;
        border-bottom: 1px solid #eee;
        span{
          width:50%;
          text-align: center;
          position:relative;
          &.active:before{
            position:absolute;
            content:"";
            width:50%;
            height:1px;
            background:$ic;
            bottom:0;
            left:25%
          }
        }
      }
    }
    .money{
      display:flex;
      flex-flow:wrap;
      justify-content:between;
      .item{
        width:20%;
        text-align:center;
        border:1px solid $ic;
        margin:4% 2.5%;
        padding:0.4rem 0;
        border-radius: 0.133333rem;
        p{color:#666}
        p.color{color:$ic;span{color:$ic;}}
        &.now{
          background:$ic;
          p{color:#fff;span{color:#fff;}}
        }
      }
    }
    .title{
      line-height: 0.933333rem;
      padding-left: 0.266667rem;
    }
    .methods{
      background:#fff;
      .item{
        height:1.333333rem;
        display:flex;
        align-items:center;
        justify-content:space-between;
        margin:0 .266667rem;
        border-bottom: 1px solid #eee;
        label{width:4.4rem;flex:1}
        img{@include wh(0.933333rem,0.933333rem);vertical-align: middle;padding-right: 0.266667rem}
        input{margin-right: 0.4rem;height:100%}
      }
    }
  }
  .recharge-to{
    width:66%;
    margin:1rem auto ;
    background-color: $ic;
    color:#fff;
    padding: .3rem 0;
    border: 1px;
    border-radius: 0.15rem;
    text-align: center;
    @include font-dpr(14px);
  }
  .itembox{
    height: 1.333333rem;
    line-height: 1.333333rem;
    background:#fff;
    margin-top: 0.4rem;
    padding:0 0.266667rem;
    @include font-dpr(14px);
    input{
      height:100%;
      padding-left: 0.4rem;
      @include font-dpr(14px);
    }
  }
  .icon-arrow-right{
    padding-right: 0.266667rem;
    color:#666
  }
</style>
