<template>
  <div class="wrap">
    <headTop :noneHome="noneHome" :headTitle="titleName"></headTop>
    <div class="box">
      <p class="title">有意见？有吐槽？都来告诉我吧</p>
      <textarea v-model="message" placeholder="请写下您的意见,如方便请留下联系方式" class="message"></textarea>
      <div class="login-to" @click="submit">提交</div>
     <!--  <div class="tip">
        <p class="title">联系方式</p>
        <div class="tip-contact">
          <p><span>客服电话：</span><a href="tel:1111111111111" class="value">11111111111</a></p>
          <p><span>电子邮箱：</span><a href="mailto:qqqqqqqqqqqq.com" class="value">qqqqqqqqqqq.com</a></p>
          <p><span>QQ群：</span><span class="value">1111111111111</span></p>
        </div>
      </div> -->
    </div>
    <alert v-if="showAlert"  @closeTip="close" :alertText="alertText" :suc="trueflag"></alert>
  </div>
</template>

<script>
import headTop from '@/components/commen/header/head'
import {PartnerIssues} from '@/service/getData'
import alert from '@/components/commen/alert/alert'
import {getCookie} from '@/config/mUtils'
export default {
  name: 'feedback',
  data () {
    return {
      titleName:'意见反馈',
      noneHome:true,
      message:null,
      showAlert:false,
      alertText:null,
      trueflag:false
    }
  },
  created(){
    document.body.setAttribute("class","hid");
  },
  destroyed(){
    document.body.removeAttribute("class","hid");
  },
  methods:{
    submit(){
      if(!this.message||this.message.length<15){
        this.showAlert = true;
        this.alertText = "意见少于15个字";
      }else{
        PartnerIssues(getCookie("USERToken"),0,'网站意见',this.message,0).then((response)=>{
          if(response.data.Ret == 0){
            this.trueflag = true;
            this.showAlert = true;
            this.alertText = "提交成功";
          }else{
            this.showAlert = true;
            this.alertText = response.data.Msg;
          }
        })
      }

    },
    close(){
      this.showAlert = false;
      this.alertText = "";
      if(this.trueflag){
        this.$router.push("/home")
      }
    }
  },

  components:{headTop,alert}
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
      width:100%;
      height:100%;
      overflow: auto;
      -webkit-overflow-scrolling: touch;
      padding: 1.093333rem 0.266667rem 0 0.266667rem;
      .title{
        line-height: 1.066667rem;color:#666;@include font-dpr(14px);
      }
      .message{
        @include wh(100%,6.0rem);@include font-dpr(15px);
      }
      .login-to{
        width:100%;
        margin:.2rem auto 0;
        background-color: $ict;
        color:#333;
        padding: .26rem 0;
        border: 1px;
        border-radius: 0.15rem;
        text-align: center;
        @include font-dpr(16px);
      }
      .tip-contact{
        p{
          line-height: 0.6rem;;@include font-dpr(14px);
          span{
            display:inline-block;
            width:2.5rem;
            color:#666;
            @include font-dpr(13px);
          }
          .value{
            color:#35f;
            @include font-dpr(13px);
          }
        }
      }
    }
  }

</style>
