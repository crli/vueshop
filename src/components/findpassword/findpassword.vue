<template>
  <div class="wrap">
    <headTop :noneHome="noneHome" :headTitle="titleName"></headTop>
    <div class="box">
      <form class="loginForm" >
          <section class="container phone-number">
            <input type="text" placeholder="手机号" name="phone"  v-model="phoneNumber" @input="inputPhone" maxlength="11">
            <button @click.prevent="getVerifyCode" :class="{rightnumber:rightPhone}" v-show="!endTime">获取验证码</button>
            <button  @click.prevent v-show="endTime">已发送({{endTime}}s)</button>
          </section>
          <section class="container">
              <input type="text" placeholder="验证码" name="mobileCode" maxlength="6" v-model="phoneVerifyCode">
          </section>
      </form>
      <div class="confirm-to" id="confirm-to" ref="confirm"  @click="confirm">验证</div>
    </div>
    <transition name="router-slid">
        <router-view></router-view>
    </transition>
    <alert v-if="showAlert"  @closeTip="close" :alertText="alertText"></alert>
  </div>
</template>

<script>
import headTop from '@/components/commen/header/head'
import alert from '@/components/commen/alert/alert'
import {mapMutations} from 'vuex'
import {getVerCode,checkVerCode} from '@/service/getData'
export default {
  name: 'appeal',
  data () {
    return {
      titleName:'验证手机号',
      noneHome:true,
      showAlert:false,
      alertText:null,
      endTime:'',
      rightPhone:false,
      phoneNumber:null,
      phoneVerifyCode:null
    }
  },

  methods: {
    ...mapMutations([
        'SET_REGPHONE',
    ]),
    /**
     * [confirm 提交验证]
     * @return {[type]} [description]
     */
    confirm(){
      if (!this.rightPhone) {
        this.showAlert = true;
        this.alertText = '手机号码不正确';
        return
      }else if(!(/^\d{6}$/.test(this.phoneVerifyCode))){
        this.showAlert = true;
        this.alertText = '短信验证码不正确';
        return
      }else{
        this.$refs.confirm.innerHTML = "请稍后..."
        checkVerCode(this.phoneVerifyCode,this.phoneNumber).then((response) => {
          if(response.data.Ret==0){
            this.SET_REGPHONE(this.phoneNumber);
            this.$router.push("/findpassword/setPassword")
            return
          }else {
            this.showAlert = true;
            this.alertText = response.data.Msg;
            this.$refs.confirm.innerHTML.innerHTML = "验证"
            return
          }
        }).catch((response)=> {
          this.$refs.confirm.innerHTML.innerHTML = "验证"
        })
      }
    },
    /**
     * [inputPhone 测试号码正确与否]
     * @return {[type]} [description]
     */
    inputPhone(){
      if(/^\d{10}$/.test(this.phoneNumber)||/^\d{11}$/.test(this.phoneNumber)){
          this.rightPhone = true;
      }else{
          this.rightPhone = false;
      }
    },
    close(){
      this.showAlert = false;
    },
    /**
     * [getVerifyCode 获得验证码]
     * @return {[type]} [description]
     */
    getVerifyCode(){
      if (this.rightPhone) {

        getVerCode(this.phoneNumber,'FindPsw').then((response) => {
          if(response.data.Ret==0){
            this.endTime = 30;
            this.timer = setInterval(() => {
              this.endTime --;
              if (this.endTime == 0) {
                clearInterval(this.timer)
              }
            }, 1000)
          }else{
            this.showAlert = true;
          }
        })
      }
    }
  },
  components:{headTop,alert}
}
</script>
<style scoped lang="scss">
@import '../../style/mixin';

.wrap{
      position: fixed;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    z-index: 0;
    background:#eee;
  .box{
    width:100%;
    height:100%;
    padding-top:1.093333rem;
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
}

.confirm-to{
    width:86%;
    margin:1rem auto ;
    background-color: $ic;
    color:#fff;
    padding: .3rem 0;
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
