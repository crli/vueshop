<template>
  <section class="pay">
    <headTop :noneHome="noneHome" :headTitle="titleName">
    </headTop>
    <div class="box">
      <div class="section1">
        <div class="item" v-for="item in data">
          <i class="iconfont icon-shangpinguanli"></i>
          <span class="ellipsis">{{item.Title}}</span>
          <span>×{{item.Quantity}}</span>
          <div class="item-m"><span>$</span>{{item.Price}}</div>
        </div>
        <div class="tax"><span>消费税</span><div><span>$</span><span>{{taxsum}}</span></div></div>
        <div class="totle">合计：<span>$</span><span>{{totle}}</span></div>
      </div>
      <div class="section2">
        <div class="title">
          <div class="ub">使用<span>{{uBdeduction}}</span>U币抵扣<span><span>$</span>{{deduction}}</span><i class="iconfont icon-wenhao" @click="totip"></i></div>
          <i class="iconfont icon-xuanzhong" :class="selectub?'active':''" @click="select"></i>
        </div>
        <div class="tip">提示：<span>小费</span>不包含在团购中，请在完成消费后根据商家服务质 量酌情支付小费！①准备适量现金支付；或②在个人中心→我 的订单中使用余</div>
      </div>
      <div class="section4">
        <div class="methods">
          <div class="item" v-if="BankCardList.length" v-for="value in BankCardList" >
            <label :for="value.Id"><img :src="handimg(value.Type)" alt="" />{{value.Card}}</label>
            <input type="radio" :id="value.Id" :value="value.Id" v-model="type">
          </div>
          <div class="item" v-if="ISWEIXIN">
            <label for="WAPWxPay"><img src="../../assets/img/wx.png" alt="" />微信支付</label>
            <input type="radio" id="WAPWxPay" value="WAPWxPay" v-model="type">
          </div>
          <div class="item">
            <label for="WAPAliPay"><img src="../../assets/img/zfb.png" alt="" />支付宝支付</label>
            <input type="radio" id="WAPAliPay" value="WAPAliPay" v-model="type">
          </div>
          <div class="item">
            <label for="balance"><img src="../../assets/img/ye.png" alt="" />余额{{Money}} <span v-if="!canbalance" class="notip">(美元余额不足,不可使用)</span></label>
            <input type="radio" :disabled="!canbalance" id="balance" value="balance" v-model="type">
          </div>
          <div class="item" @click="$router.push('/bankCard')">
            <label><img src="../../assets/img/adds.png" alt="" /><span>使用新银行卡</span></label>
            <i class="iconfont icon-arrow-right"></i>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <span class="money">还需付：<span>$</span><span>{{lastmoney}}</span></span>
      <span class="paystart" @click="payto" v-if="paymsg">立即支付</span>
      <span class="paystart nopaystart"  v-else>支付中...</span>
    </div>
    <tip v-if="showtip"  @closeTip="close" tipmsg="U币使用规则：每一单团购，您的积分最多只能抵用总金额的10%！" color="#fb8a71"></tip>
    <alert v-if="showAlert"  @closeTip="closeAlert" :alertText="alertmsg" :suc="collectflag"></alert>
  </section>

</template>

<script>

import headTop from '@/components/commen/header/head'
import tip from '@/components/commen/tip/tip'
import alert from '@/components/commen/alert/alert'
import {GetOrdersByPackageid,OrderPay,getUser,WapWxPay,WapAliPay,getUserBankCardList} from '@/service/getData'
import {getCookie,setStore} from '@/config/mUtils'
import {mapState,mapMutations} from 'vuex'
import MasterCard from '@/assets/img/MasterCard.png'
import ivisa from '@/assets/img/visa.png'
import DISCOVER from '@/assets/img/DISCOVER.png'
import JCB from '@/assets/img/JCB.png'
export default {
  name: 'pay',
  data () {
    return {
      titleName:'支付订单',
      noneHome:true,
      PackageId:null,//订单id
      showtip:false,
      selectub:false,//选择Ub
      balance:true,//选择余额
      data:null,//订单中商品数据
      taxsum:0,//总消费税
      totle:0,//总值
      Score:null,
      deduction:null,//Ub抵扣钱数
      uBdeduction:null,//使用Ub个数
      Money:null,//美元余额
      type:'',
      lastmoney:null,//结账时最终费用
      alertmsg:"",
      showAlert:false,
      collectflag:false,

      jsApiParameters:{},
      BankCardList:[],
      CardId:'',
      wxparam:{},
      ISWEIXIN:true,
      canbalance:true,
      paymsg:true
    }
  },
  beforeMount(){
    this.PackageId = this.$route.query.id;

  },
  async mounted(){

    let response = await getUser(getCookie("USERToken"));
    this.RECORD_USERINFO(response.data);
    setStore("UWUSER",response.data)

    response = await GetOrdersByPackageid(getCookie("USERToken"),this.PackageId)

    this.data = response.data.List;
    response.data.List.forEach((ele)=>{
      this.taxsum += parseFloat(ele.Tax);
      this.totle += parseFloat(ele.Money);
    })
    this.taxsum = this.taxsum.retoFixed(2);
    this.totle = this.totle.retoFixed(2);
    // Ub多已总额为基准,总额/10,
    if(parseFloat(this.Score/100) >= parseFloat(this.totle/10)){
      this.uBdeduction = parseFloat(this.totle*10).retoFixed(0);
      this.deduction = parseFloat(this.uBdeduction/100).retoFixed(2);
    }
    // Ub少已Ub为基准
    else{
      this.uBdeduction = parseFloat(this.Score).retoFixed(0);
      this.deduction = parseFloat(this.uBdeduction/100).retoFixed(2);
    }
    this.lastmoney = parseFloat(this.totle - this.deduction).retoFixed(2);

    if(!this.isWeiXin()){
      this.ISWEIXIN = false;
    }
    response = await getUserBankCardList(getCookie("USERToken"))
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
    }else if(Payment == "account"&&(this.deduction+this.Money)>this.totle){
      this.type = 'balance'
    }else if(!isNaN(Payment)){
      this.type = Payment
    }else{
      this.type = this.BankCardList[0].Id
    }
    this.select()
  },
  methods:{
    ...mapMutations([
        'RECORD_USERINFO'
    ]),
    // //判断是否微信登陆
    isWeiXin() {
      var ua = window.navigator.userAgent.toLowerCase();
      if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        return true;
      } else {
        return false;
      }
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
    totip(){
      this.showtip = true
    },
    close(){
      this.showtip = false
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
    /**
     * [ 选择Ub]
     * @return {[type]} [description]
     */
    select(){
      this.selectub = !this.selectub;
      if(this.selectub){//选择u币
        let num = (this.totle - this.deduction - this.Money).retoFixed(2);
        if(num<0){
          this.canbalance = true;
          if(this.type=="balance"){//选择余额
            this.lastmoney = 0
          }else{
            this.lastmoney = (this.totle - this.deduction).retoFixed(2);
          }
        }else{
          this.canbalance = false;
          this.lastmoney = (this.totle - this.deduction).retoFixed(2);
        }

      }else{
        let num = (this.totle - this.Money).retoFixed(2);
        if(num<0){
          this.canbalance = true;
          if(this.type=="balance"){//选择余额
            this.lastmoney = 0;
          }else{
            this.lastmoney = (this.totle).retoFixed(2);
          }
        }else{
          this.canbalance = false;
          this.lastmoney = (this.totle).retoFixed(2);
        }

      }
    },
    /**
     * [payto 支付]
     * @return {[type]} [description]
     */
    payto(){
      this.paymsg = false;
      let PointPay = true == this.selectub?'Y':'N';
      let type = "";
      if(!isNaN(this.type)){
        this.CardId = this.type
        type = "WAPVisa"
      }else if(this.type == "balance"){
        this.CardId = '';
        type = "WAPAccount"
      }else{
        this.CardId = '';
        type = this.type
      }
      OrderPay(getCookie("USERToken"),this.PackageId,PointPay,type,this.CardId)
      .then((response)=>{
        console.log(response.data)
        if(response.data.Ret == 0){
          this.alertmsg = "支付成功";
          this.showAlert = true;
          this.collectflag = true;
        }else if(response.data.Ret == -1){
          switch (type) {
            case 'WAPWxPay':
              this.wxparam = response.data.WxSign;
              this.callpay();
              break;
            case 'WAPAliPay':
              window.location.href = response.data.Url
              break;
          }
        }
      }).catch((e)=>{
        setTimeout(()=>{
          this.paymsg = true;
        },1200)
      })
    },


    closeAlert(){
      this.showAlert = false
      if(this.collectflag){
        this.$router.push("/order?status=1")
      }else{
        this.$router.push('/cart')
      }
    }
  },

  computed:{
    ...mapState([
      'userInfo'
    ])
  },
  watch: {
    userInfo: function (value) {
      if (value&&value.ID) {
        this.Score = value.Score||0;
        this.Money = value.Money||0;

      }
    },
    type:function (value) {
      if(value=="balance"){//选择余额
        if(this.selectub){//选择u币
          this.lastmoney = (this.totle - this.deduction - this.Money).retoFixed(2);
        }else{
          this.lastmoney = (this.totle - this.Money).retoFixed(2);
        }
        if(this.lastmoney<0){
          this.lastmoney = 0
        }
      }else{
        if(this.selectub){
          this.lastmoney = (this.totle - this.deduction).retoFixed(2);
        }else{
          this.lastmoney = (this.totle).retoFixed(2);
        }
      }
    }
  },
  components:{headTop,tip,alert}
}
</script>

<style scoped lang="scss">
@import '../../style/mixin';
.box{
  padding-top: 1.093333rem;
}
.addCard{
  width:50%;
  margin:.4rem auto 0;
  background-color: $ic;
  color:#fff;
  padding: .2rem 0;
  border: 1px;
  border-radius: 0.15rem;
  text-align: center;
  @include font-dpr(14px);
}
.section1{
  padding:0 0.266667rem;
  background:#fff;
  .item{
    line-height: 1.04rem;
    display:flex;
    border-bottom: 1px solid #eee;
    span{
      @include font-dpr(13px);
    }
    i{
      margin-right: 0.266667rem;
      @include font-dpr(12px);
      color:$ic
    }
    .ellipsis{
      width:5.733333rem;
      margin-right: 0.266667rem;
    }
    .item-m{
      flex:1;
      text-align: right;
    }

  }
  .tax{
    display: flex;
    justify-content:space-between;
    line-height: 1.04rem;
    border-bottom: 1px solid #eee;
    @include font-dpr(13px)
  }
  .totle{
    text-align: right;
    line-height: 1.04rem;
    @include font-dpr(13px)
  }
}
.section2{
  padding:0 0.266667rem;
  margin: 0.373333rem 0;
  background:#fff;
  .ub i{
    @include font-dpr(16px)
  }
  .title{
    display:flex;
    justify-content:space-between;
    line-height: 1.2rem;
    border-bottom:1px solid #eee;
    @include font-dpr(13px);
    i{color:#999}
    i.active{
      color:$ic
    }
  }
  .tip{
    padding:0.333333rem 0;
    line-height: 0.506667rem;
    @include font-dpr(12px)
    span{
      color:$ic;
      @include font-dpr(15px)
    }
  }
}
.section3{
  margin: 0.373333rem 0;
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
        @include font-dpr(13px)
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
}
.section4{
  margin-bottom: 1.253333rem;
  .methods{
    background:#fff;
    .item{
      height:1.333333rem;
      display:flex;
      align-items:center;
      justify-content:space-between;
      padding:.2rem 0;
      margin:0 .266667rem;
      border-bottom: 1px solid #eee;
      label{@include font-dpr(13px);}
      img{@include wh(0.933333rem,0.933333rem);vertical-align: middle;padding-right: 0.266667rem}
      input{margin-right: 0.4rem;height:100%}
      .notip{
        @include font-dpr(10px);
        color:#666
      }
      .icon-arrow-right{
        padding-right: 0.266667rem;
        color:#666
      }
    }
  }
}
.footer{
  position:fixed;
  bottom:0;
  @include wh(100%,1.253333rem);
  display:flex;
  justify-content:space-between;
  line-height: 1.253333rem;
  .paystart{
    @include wh(3.52rem,100%);
    text-align: center;
    color:#fff;
    background:$ic
  }
  .nopaystart{
    background:#fb6a71;
    color:#f2f2f2
  }
  span{
    color:#fff
  }
  .money{
    flex:1;
    padding:0 0 0 0.266667rem;
    height:100%;
    color:#fff;
    background:#666;
  }
}
</style>
