<template>
  <div class="wrap">
    <headTop :noneHome="noneHome" :headTitle="titleName"></headTop>
    <div class="box">
      <form class="loginForm" >
        <section class="container">
          <input type="passWord" placeholder="原始密码" name="passWord"  v-model="OldPassword">
        </section>
        <section class="container">
          <input type="passWord" placeholder="新密码" name="passWord"  v-model="NewPassword">
        </section>
      </form>
      <div class="login-to" id="login-to" @click="mobileChange">确定</div>
    </div>

    <alert v-if="showAlert"  @closeTip="close" :alertText="alertText"></alert>
  </div>
</template>

<script>
import headTop from '@/components/commen/header/head'
import alert from '@/components/commen/alert/alert'
import {mapMutations} from 'vuex'
import {getCookie} from '@/config/mUtils'

import {ModifyPassword} from '@/service/getData'
export default {
  name: 'repassworld',
  data () {
    return {
      titleName:'修改密码',
      noneHome:true,
      showAlert:false,//提示信息
      alertText:null,//提示内容
      suc:false,//设置成功
      OldPassword:'',
      NewPassword:''
    }
  },

  methods: {
    ...mapMutations([
      'OUT_LOGIN'
    ]),

    mobileChange(){
      if (!this.OldPassword) {
        this.showAlert = true;
        this.alertText = '请输入原始密码';
        return
      }else if(!this.NewPassword){
        this.showAlert = true;
        this.alertText = '请输入新密码';
        return
      }else{
        ModifyPassword(getCookie("USERToken"),this.OldPassword,this.NewPassword).then((response)=>{
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
