<template>
  <div class="wrap">
    <headTop :noneHome="noneHome" :headTitle="titleName"></headTop>
    <div class="box">
      <form class="loginForm" >
        <section class="container phone-number">
          <input type="text" placeholder="新手机号" name="phone" maxlength="11" v-model="phoneNumber" @input="inputPhone">
          <button @click.prevent="getVerifyCode" :class="{rightnumber:rightPhone}" v-show="!endTime">获取验证码</button>
          <button  @click.prevent v-show="endTime">已发送({{endTime}}s)</button>
        </section>
        <section class="container">
          <input type="text" placeholder="验证码" name="mobileCode" maxlength="6" v-model="phoneVerifyCode">
        </section>
        <section class="container">
          <input type="passWord" :placeholder="tip" name="passWord"  v-model="passWord">
        </section>
      </form>
      <div class="login-to" id="login-to" @click="mobileChange">确定</div>
    </div>

    <alert v-if="showAlert"  @closeTip="close" :alertText="alertText"></alert>
    <transition name="router-slid">
        <router-view></router-view>
    </transition>

  </div>
</template>

<script>
import headTop from '@/components/commen/header/head'
import alert from '@/components/commen/alert/alert'
import {mapState,mapMutations} from 'vuex'
import {getCookie} from '@/config/mUtils'

import {getVerCode,modifyMobile} from '@/service/getData'
export default {
  name: 'retel',
  data () {
    return {
      titleName:'更换手机号',
      noneHome:true,
      rightPhone:false,
      phoneNumber:null,
      phoneVerifyCode:null,
      endTime: 0,
      showAlert:false,//提示信息
      alertText:null,//提示内容
      suc:false,//设置成功
      tip:'',
      passWord:''
    }
  },

  methods: {
    ...mapMutations([
      'OUT_LOGIN'
    ]),
    inputPhone(){
        if(/^\d{10}$/.test(this.phoneNumber)||/^\d{11}$/.test(this.phoneNumber)){
            this.rightPhone = true;
        }else{
            this.rightPhone = false;
        }
    },
    getVerifyCode(){
      if (this.rightPhone) {
        this.endTime = 30;
        this.timer = setInterval(() => {
          this.endTime --;
          if (this.endTime == 0) {
            clearInterval(this.timer)
          }
        }, 1000)
        getVerCode(this.phoneNumber,'ModifyMobile').then((response) => {
          if (response.data.msg) {
            this.showAlert = true;
            this.alertText = response.data.msg;
            return
          }
        })
      }
    },
    mobileChange(){
      if (!this.phoneNumber) {
        this.showAlert = true;
        this.alertText = '请输入新手机号';
        return
      }else if(!this.phoneVerifyCode){
        this.showAlert = true;
        this.alertText = '请输入验证码';
        return
      }else if(!this.passWord){
        this.showAlert = true;
        this.alertText = this.tip;
        return
      }else{
        modifyMobile(getCookie("USERToken"),this.phoneNumber,this.phoneVerifyCode,this.passWord).then((response)=>{
          if(response.data.Ret==0){
            this.suc = true;
            this.showAlert = true;
            this.alertText = '设置成功';
            return
          }else {
            this.showAlert = true;
            this.alertText = response.data.Msg;
            return
          }
        })
      }
    },
    close(){
      this.showAlert = false;
      if(this.suc){
        this.OUT_LOGIN();
        this.$router.push('/login')
      }
    }
  },
  computed:{
    ...mapState([
      "userInfo"
    ])
  },
  watch:{
    userInfo:function (value) {
      if(value.Psw==1){
        this.tip = "请输入您的登录密码"
      }else{
        this.tip = "请设置您的登录密码"
      }
    }
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
  z-index: 3;
  background:#eee;
  overflow: auto;
  .box{
    width:100%;
    height:100%;
    padding-top:1.093333rem;
  }
  .loginForm{
    background-color: #fff;
    width:100%;
    .container{
      display: flex;
      justify-content: space-between;
      padding: .2rem 0rem;
      border-bottom: 1px solid #f1f1f1;
      width:100%;
      position:relative;
      height:1.333333rem;
      input{
          @include font-dpr(14px);
          padding: .2rem .3rem;
      }
      button{
          @include font-dpr(14px);
          color:#fff;
          padding: .2rem .3rem;
          margin:0 .3rem;
          border: 1px;
          border-radius: 0.15rem;
          background:#ccc
      }
      .rightnumber{
          background-color: #4cd964;
      }
    }
  }
}

.login-to{
    width:86%;
    margin:1rem auto ;
    background-color: $ic;
    color:#fff;
    padding: .2rem 0;
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
