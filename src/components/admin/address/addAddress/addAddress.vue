<template>
  <div class="wrap" @touchmove.prevent>
    <headTop :noneHome="noneHome" :headTitle="titleName"></headTop>
    <div class="box">
      <div class="item">
        <div class="nm">名字</div>
        <input v-model="parameter.FirstName" placeholder="First Name">
      </div>
      <div class="item">
        <div class="nm">姓氏</div>
        <input v-model="parameter.LastName" placeholder="Last Name">
      </div>
      <div class="item">
        <div class="nm">所在州</div>
        <input v-model="parameter.State" placeholder="state">
      </div>
      <div class="item">
        <div class="nm">所在城市</div>
        <input v-model="parameter.City" placeholder="city">
      </div>
      <div class="item">
        <div class="nm">街道地址</div>
        <input v-model="parameter.Street" placeholder="Street address">
      </div>
      <div class="item">
        <div class="nm">邮政编码</div>
        <input v-model="parameter.ZipCode" placeholder="zip code" maxlength="5">
      </div>
      <div class="item">
        <div class="nm">手机号码</div>
        <input v-model="parameter.Mobile" placeholder="phone number" maxlength="10">
      </div>
      <div class="item check">
        <div class="nm">设为默认地址</div>
        <input type="checkbox"  value="Y" v-model="check">
      </div>
      <div class="addCardTo" id="addCardTo" @click="addressTo">保存</div>
    </div>
    <alert v-if="showAlert"  @closeTip="close" :alertText="alertText"></alert>

  </div>
</template>

<script>
import headTop from '@/components/commen/header/head'
import alert from '@/components/commen/alert/alert'
import {mapState,mapMutations,mapActions} from 'vuex'
import {addNewAddress} from '@/service/getData'
import {getCookie} from '@/config/mUtils'
export default {
  name: 'addAddress',
  data () {
    return {
      titleName:'新增收货地址',
      noneHome:true,
      showAlert:false,
      alertText:'',
      check:[],
      parameter:{
        Token:null,
        FirstName:null,
        LastName:null,
        Mobile:null,
        State:null,
        City:null,
        Street:null,
        ZipCode:null,
        Id:0,
        Default:'N'
      }
    }
  },
  created(){

  },
  methods:{
    ...mapMutations([
      'ADD_ADDRESS'
    ]),

    addressTo(){
      if(!this.parameter.FirstName){
        this.showAlert = true;
        this.alertText = '名字不能为空';
        return false
      }else if(!this.parameter.LastName){
        this.showAlert = true;
        this.alertText = '姓氏不能为空';
        return false
      }
      else if(!this.parameter.State){
        this.showAlert = true;
        this.alertText = '请添加所在州';
        return false
      }
      else if(!this.parameter.City){
        this.showAlert = true;
        this.alertText = '请添加所在城市';
        return false
      }
      else if(!this.parameter.Street){
        this.showAlert = true;
        this.alertText = '请添加所在街道';
        return false
      }
      else if(!this.parameter.ZipCode){
        this.showAlert = true;
        this.alertText = '请添加邮政编码';
        return false
      }
      else if(!/^\d{5}$/.test(this.parameter.ZipCode)){
        this.showAlert = true;
        this.alertText = '邮政编码错误，请重新输入';
        return false
      }
      else if(!/^\d{10}$/.test(this.parameter.Mobile)){
        this.showAlert = true;
        this.alertText = '手机号码格式不正确，请重新输入';
        return false
      }
      else{
        this.parameter.Token = getCookie("USERToken");
        addNewAddress(this.parameter).then((response)=>{
          if(!response.data.res){
            this.ADD_ADDRESS({
              Zipcode:this.parameter.ZipCode,
              Id:this.parameter.Id,
              Default:this.parameter.Default,
              City:this.parameter.City,
              FirstName:this.parameter.FirstName,
              LastName:this.parameter.LastName,
              Mobile:this.parameter.Mobile,
              State:this.parameter.State,
              Street:this.parameter.Street
            });
            this.$router.go(-1);
          }
        })
      }
    },
    close(){
      this.showAlert = false
    }
  },
  computed:{
    ...mapState([
      'userInfo','address'
    ])
  },
  watch:{
    check:function (value) {
      this.parameter.Default = value[0]||"N"
    }
  },
  components:{headTop,alert}
}
</script>
<style scoped lang="scss">
@import '../../../../style/mixin';
.tip{font-size: 86px}
  .wrap{
    position: fixed;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    z-index: 0;
    background:#fff;
    overflow: auto;
    .box{
      padding-top: 1.093333rem;
      width:100%;
      height:100%;
    }
    .item{
      display:flex;
      height: 1.2rem;
      padding:0.2rem 0;
      border-bottom: 1px solid #eee;
      .nm{
        width:3rem;
        text-align: left;
        padding-left: 0.266667rem;
        @include font-dpr(14px);
        line-height: .8rem;
      }
      input{@include font-dpr(14px);}
    }
    .check{
      align-items:center;
      input{
        margin-left: 0.8rem
      }
    }
    .addCardTo{
      width:86%;
      margin:1rem auto ;
      background-color: $ic;
      color:#fff;
      padding: .26rem 0;
      border: 1px;
      border-radius: 0.15rem;
      text-align: center;
      @include font-dpr(14px);
    }
  }
  .router-slid-enter-active, .router-slid-leave-active {
      transition: all .4s;
  }
  .router-slid-enter, .router-slid-leave-active {
      transform: translateX(100%);
  }
</style>
