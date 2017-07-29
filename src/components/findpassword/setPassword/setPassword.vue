<template>
  <div class="wrap">
    <headTop :noneHome="noneHome" :headTitle="titleName"></headTop>
    <div class="box tip" v-if="!regtelephone">
      <p>请先验证手机号,再设置密码</p>
      <div class="confirm-to" @click="gotoRepass">验证手机号</div>
    </div>
    <div class="box" v-else>
      <div class="set">
        <p>请设置密码，设置密码后，可通过用户名/手机号和密码登录</p>
        <div class="nm">
          <span>密码</span>
          <input type="password" placeholder="6~16位中英文、数字和下划线组合" v-model="passWord"/>
        </div>
        <div class="confirm" id="confirm" @click="confirm">确定</div>
      </div>
    </div>
    <alert v-if="showAlert"  @closeTip="close" :alertText="alertText"></alert>
  </div>
</template>

<script>
import headTop from '@/components/commen/header/head'
import alert from '@/components/commen/alert/alert'
import {mapState,mapMutations} from 'vuex'
import {getVerCode,FindPassword} from '@/service/getData'
export default {
  name: 'setPassword',
  data () {
    return {
      titleName:'设置密码',
      noneHome:true,
      showAlert:false,//提示信息
      alertText:null,//提示内容
      passWord:null,//新密码
      suc:false,//设置成功
      telephone:''
    }
  },

  methods: {
    ...mapMutations([
      'SET_REGPHONE'
    ]),

    gotoRepass(){
      this.$router.push('/repassword')
    },
    confirm(){
      FindPassword(this.regtelephone,this.passWord).then((response)=>{
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
    },
    close(){
      this.showAlert = false;
      if(this.suc){
        this.SET_REGPHONE(null);
        this.$router.push('/login')
      }
    }
  },

  computed:{
    ...mapState([
      'userInfo','regtelephone'
    ])
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
  z-index: 103;
  background:#eee;
  overflow: auto;
  .tip{
    @include font-dpr(20px);
    text-align: center;
    margin-top: 2.666667rem;
    color:red
  }
  .box{
    width:100%;
    height:100%;
    padding-top:1.093333rem;
  }
  .set{
    padding:0 0.266667rem;
    p{
      line-height: 0.6rem;
      @include font-dpr(14px);
      margin:0.8rem 0;
      color:#666
    }
    .nm{
      background:#fff;
      height:1.2rem;
      line-height: 1.2rem;
      display:flex;
      span{margin:0 0.533333rem}
    }
    .confirm{
        margin:1rem auto ;
        background-color: $ic;
        color:#fff;
        padding: .2rem 0;
        border: 1px;
        border-radius: 0.15rem;
        text-align: center;
        @include font-dpr(14px);
      }
  }

}

.confirm-to{
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
