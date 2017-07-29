<template>
  <section class="wrap">
    <headTop :noneHome="noneHome" :headTitle="titleName">
      <div class="sure" slot="edit" @click="sure">确定</div>
    </headTop>
    <div class="box">
      <div class="input-box">
        <span>用户名：</span><input type="text" v-model="AccountName"/><i class="iconfont icon-guanbi" v-if="AccountName" @click="clear"></i>
      </div>
    </div>
    <alert v-if="showAlert"  @closeTip="closeAlert" :alertText="alertText" :suc="flag"></alert>
  </section>
</template>

<script>
import headTop from '@/components/commen/header/head'
import alert from '@/components/commen/alert/alert'
import {getCookie} from '@/config/mUtils'
import {mapState,mapMutations} from 'vuex'
import {getUser,UpdateUserInfo} from '@/service/getData'
export default {
  name: 'changeName',
  data () {
    return {
      titleName:'修改用户名',
      noneHome:true,
      AccountName:'',
      alertText:"",
      showAlert:false,
      flag:false,
      newName:""
    }
  },

  methods: {
      ...mapMutations([
        'CHANGE_USERINFOR'
      ]),
      sure(){
        if(!this.AccountName){
          this.showAlert = true;
          this.alertText = "请输入用户名"
        }else if(this.newName == this.AccountName){
          this.$router.push("/admin/setUp/personalData")
        }else{
          UpdateUserInfo(getCookie("USERToken"),this.userInfo.BirthDay,this.userInfo.Gender,this.AccountName).then((response)=>{
            if(response.data.Ret == 0){
              this.CHANGE_USERINFOR({"AccountName":this.AccountName});
              this.$router.push("/admin/setUp/personalData")
            }
          })
        }

      },
      clear(){
        this.AccountName = "";
      },
      closeAlert(){
        this.showAlert = false;
        this.alertText = ""
      }
  },
  computed:{
    ...mapState([
      'userInfo'
    ])
  },
  watch:{
    userInfo:function (value) {
      if(value && value.ID){
        this.AccountName = value.AccountName;
        this.newName = value.AccountName;
      }
    }
  },
  components:{headTop,alert}
}
</script>

<style scoped lang="scss">
  @import '../../../../../style/mixin';
  .sure{
    position: absolute;
    right:0.266667rem;
    @include font-dpr(16px);
    color:#333;
    z-index:200
  }
  .wrap{
    position: fixed;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    z-index: 1100;
    background:#eee;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    .box{
      padding-top: 1.093333rem;
      width:100%;
      height:100%;
      overflow: auto;
      -webkit-overflow-scrolling: touch;text-align: center;

      .input-box{
        width:90%;
        margin:0.266667rem auto;
        height:1.04rem;
        background:#fff;
        display:flex;
        align-items:center;
        span{
          padding:0 0.266667rem;
          @include font-dpr(14px)
        }
        input{height:100%;flex:1;@include font-dpr(14px)}
        i{margin-right: 0.266667rem}
      }
    }

  }

</style>
