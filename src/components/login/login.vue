<template>
  <section class="login">
    <headTop :noneHome="noneHome" :headTitle="loginWay? '登录':'注册'">
      <div slot="loginChange" class="login-change" @click="changeLoginWay">{{loginWay? "注册":"登录"}}</div>
    </headTop>
    <div class="zhanwei"></div>
    <transition name="fade">
      <div class="form" v-if="loginWay">
        <form class="loginForm">
          <section class="container">
              <input type="text" placeholder="手机号/邮箱/用户名" v-model.lazy.trim="userName">
          </section>
          <section class="container">
              <input v-if="!showPassword" type="password" placeholder="密码"  v-model.trim="passWord">
              <input v-else type="text" placeholder="密码"  v-model.trim="passWord">
              <div class="switch" :class="{totext: showPassword}">
                  <div class="circel-button" :class="{toright: showPassword}" @click="changePassWordType"></div>
                  <span v-show="showPassword">abc</span>
                  <span v-show="!showPassword">...</span>
              </div>
          </section>
        </form>
        <div class="login-to" @click="mobileLogin">{{loginWay? "登录":"注册"}}</div>
        <router-link to="/findpassword" tag="div" class="forget">忘记密码？</router-link>
      </div>
    </transition>
    <transition name="fade">
      <div class="form" v-if="!loginWay">
        <form class="loginForm" >
            <section class="container">
                <input type="email" placeholder="E-mail" name="email"  v-model.trim="email">
            </section>
            <section class="container phone-number">
              <input type="text" placeholder="手机号" name="phone" maxlength="11" v-model.trim="phoneNumber" @input="inputPhone">
              <button @click.prevent="getVerifyCode" :class="{rightnumber:rightPhone}" v-show="!endTime">获取验证码</button>
              <button  @click.prevent v-show="endTime">已发送({{endTime}}s)</button>
            </section>
            <section class="container">
                <input type="text" placeholder="验证码" name="mobileCode" maxlength="6" v-model.trim="phoneVerifyCode">
            </section>
            <section class="container">
                <input  type="text" placeholder="密码(6-32位字母数字结合)"  v-model.trim="regPassWord" @input="inputpass">
            </section>
        </form>
        <p class="login-tips">
            温馨提示：注册由我团账号时，则代表您已同意
            <span @click="toxieyi">《用户服务协议》</span>
        </p>
        <div class="login-to" id="login-to" ref="loginto" @click="mobileLogin">{{loginWay? "登录":"注册"}}</div>
      </div>
    </transition>
    <alert v-if="showAlert"  @closeTip="close" :alertText="alertText"></alert>
  </section>
</template>

<script>
import headTop from '@/components/commen/header/head'
import alert from '@/components/commen/alert/alert'
import {baseUrl} from '@/config/env'
import {setStore} from '@/config/mUtils'
import {mapMutations} from 'vuex'
import {getVerCode,userLogin,userRegistration,getUser} from '@/service/getData'
  export default {
    name: 'login',
    data () {
      return {
        noneHome:true,
        loginWay: true, //登录方式，默认短信登录
        phoneNumber: null, //电话号码
        rightPhone:false,//输入的手机号码是否符合要求
        endTime: 0, //倒数记时
        phoneVerifyCode:null,//短信验证码
        showAlert:false,//提示信息
        alertText:null,//提示内容
        userName: null, //用户名
        passWord: null, //密码
        showPassword: false, // 是否显示密码
        regPassWord:null,//注册密码
        regsuc:false,//注册成功
        email:'',
      }
    },
    components:{headTop,alert},
    methods:{
      ...mapMutations([
          'RECORD_USERINFO_Token',
          'RECORD_USERINFO'
      ]),
      changeLoginWay(){
        this.loginWay = !this.loginWay
      },
      inputPhone(){
          if(/^\d{10}$/.test(this.phoneNumber)||/^\d{11}$/.test(this.phoneNumber)){
              this.rightPhone = true;
          }else{
              this.rightPhone = false;
          }
      },
      inputpass(){
        this.regPassWord = this.regPassWord.replace(/\s+/g, '')
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
          getVerCode(this.phoneNumber,'Reg').then((response) => {
            if (response.data.msg) {
              this.showAlert = true;
              this.alertText = response.data.msg;
              return
            }
          })
        }
      },
      close(){
        this.showAlert = false;
        // 如果注册成功转到登录
        if(this.regsuc){
          this.loginWay = true;
          this.regsuc = false;
        }
      },
      changePassWordType(){
        this.showPassword = !this.showPassword;
      },
      pwdStrength(pwd){
        if(/[a-zA-Z]+/.test(pwd) && /[0-9]+/.test(pwd) && /\W+\D+/.test(pwd)) {
            return 3;
        }else if(/[a-zA-Z]+/.test(pwd) || /[0-9]+/.test(pwd) || /\W+\D+/.test(pwd)) {
            if(/[a-zA-Z]+/.test(pwd) && /[0-9]+/.test(pwd)) {
                return 2;
            }else if(/[a-zA-Z]+/.test(pwd) && /\W+\D+/.test(pwd)) {
                return 2;
            }else if(/[0-9]+/.test(pwd) && /\W+\D+/.test(pwd)) {
                return 2;
            }else{
                return 1;
            }
        }
      },
      mobileLogin(){
        if (this.loginWay) {
          if (!this.userName) {
            this.showAlert = true;
            this.alertText = '请输入手机号/邮箱/用户名';
            return
          }else if(!this.passWord){
            this.showAlert = true;
            this.alertText = '请输入密码';
            return
          }else{
            userLogin(this.userName,this.passWord).then((response) => {
              if(!response.data.Token){
                this.showAlert = true;
                this.alertText = response.data.Msg;
                return
              }else{
                getUser(response.data.Token).then((response)=>{
                  this.RECORD_USERINFO(response.data);
                  setStore("UWUSER",response.data)
                })
                this.RECORD_USERINFO_Token(response.data.Token);
                let routerObj = this.$route.query;
                let str = '';
                for(let i in routerObj){
                  if(i!=='redirect'){
                    str+='&'+i+'='+routerObj[i]
                  }
                }
                let routerStr = routerObj.redirect + str;
                if(routerObj.redirect&&routerStr){
                  this.$router.push(routerStr)
                }else{
                  this.$router.push('/')
                }
              }
            })
          }
        }else{
          if (!this.email||!/^[A-Z0-9a-z._-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/.test(this.email)){
            this.showAlert = true;
            this.alertText = 'Email不正确';
            return
          }
          if (!this.rightPhone) {
            this.showAlert = true;
            this.alertText = '手机号码不正确';
            return
          }else if(!(/^\d{6}$/.test(this.phoneVerifyCode))){
            this.showAlert = true;
            this.alertText = '短信验证码不正确';
            return
          }else if (!this.regPassWord||this.regPassWord.length<6||this.pwdStrength(this.regPassWord)==1) {
            this.showAlert = true;
            this.alertText = '密码格式不正确';
            return
          }else{
            document.getElementById("login-to").innerHTML = "请稍后..."
            userRegistration(this.phoneNumber,this.phoneVerifyCode,this.regPassWord,this.email).then((response) => {
              if(response.data.Ret == 0){
                this.regsuc = true;
                this.showAlert = true;
                this.alertText = '注册成功';
                return
              }else {
                this.showAlert = true;
                this.alertText = response.data.Msg;
                document.getElementById("login-to").innerHTML = "注册"
                return
              }
            }).catch(function(response) {
              document.getElementById("login-to").innerHTML = "注册"
            })
          }
        }
      },
      toxieyi(){
        this.$router.push("/strategy/strategydetail?id=76")
      }
    }
  }

</script>

<style lang="scss" scoped>
 @import '../../style/mixin';
  .login-change{
    position: absolute;
    right:0.266667rem;
    color:#fff;
    z-index: 20;
    @include font-dpr(15px);
  }
  .zhanwei{ @include wh(100%,1.09333rem);}
  .form{
    position: absolute;
    top:1.09333rem;
    width:100%;
    bottom:0;
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
            width:7rem;
        }
        button{
            @include font-dpr(14px);
            color:#fff;
            margin:0 .3rem;
            border: 1px;
            width: 2.6rem;
            border-radius: 0.15rem;
            background:#ccc
        }
        .rightnumber{
            background-color: #4cd964;
        }
        .switch{
            background-color: #ccc;
            @include wh(1.54rem, .7rem);
            border: 1px;
            border-radius: 0.56rem;
            position: relative;
            transition: all .3s;
            right: 0.3rem;
            @include ct;
            .circel-button{
                transition: all .3s;
                position:absolute;
                top:50%;
                margin-top: -0.28rem;
                z-index: 1;
                @include wh(0.56rem, 0.56rem);
                box-shadow: 0 0rem 0.56rem rgba(255,255,255,.5);
                background-color: #fff;
                border-radius: 50%;
                margin-left: 0.1rem;
            }
            .toright{

                transform: translateX(.8rem);
            }
            span{
              display:block;
              @include wh(100%,100%)
              @include font-dpr(14px);
              color:#fff;
              @include ct;
              line-height: 0.7rem;
              padding: 0 0.133333rem;
            }
            span:nth-of-type(1){
              text-align: left;
            }
            span:nth-of-type(2){
              text-align: right;
              padding-right:0.2rem;
              margin-top: -.1rem
            }
        }
        .totext{
            background-color: #4cd964;
        }
      }
    }
  }
  .forget{width:86%;margin:.2rem auto ;color:$ic}
  .login-tips{
      padding: 0rem .3rem;
      line-height: .6rem;
      margin:0.3rem 0;
      span{
          color: $ic;
      }
  }
  .login-to{
    width:86%;
    margin:1rem auto 0;
    background-color: $ic;
    color:#fff;
    padding: .3rem 0;
    border: 1px;
    border-radius: 0.15rem;
    text-align: center;
    @include font-dpr(14px);
  }


</style>
