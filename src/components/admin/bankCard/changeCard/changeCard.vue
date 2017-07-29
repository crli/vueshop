<template>
  <div class="wrap" @touchmove.prevent>
    <headTop :noneHome="noneHome" :headTitle="titleName"></headTop>
    <div class="box">
      <!-- <div class="item">
        <div class="nm">银行卡类型</div>
        <input type="radio" id="visa" value="visa" v-model="parameter.Type">
        <label for="visa" class="mr">VISA</label>
        <input type="radio" id="jcb" value="jcb" v-model="parameter.Type">
        <label for="jcb" class="mr">JCB</label>
        <input type="radio" id="mastercard" value="mastercard" v-model="parameter.Type">
        <label for="mastercard"class="mr">MasterCard</label>
        <input type="radio" id="discover" value="discover" v-model="parameter.Type">
        <label for="discover">Discover</label>
      </div> -->
      <div class="item">
        <div class="nm">姓名</div>
        <input v-model="parameter.Name" placeholder="请输入您的姓名">
      </div>
      <div class="item">
        <div class="nm">卡号</div>
        <input v-model="parameter.Card" placeholder="请输入16位卡号" maxlength="16">
      </div>
      <div class="item">
        <div class="nm">月</div>
        <input v-model="parameter.Month" placeholder="月" maxlength="2">
      </div>
      <div class="item">
        <div class="nm">年</div>
        <input v-model="parameter.Year" placeholder="2位年份" maxlength="2">
      </div>
      <div class="item">
        <div class="nm">安全码</div>
        <input v-model="parameter.Cvv" placeholder="请输入安全码" maxlength="3">
      </div>
      <div class="item">
        <div class="nm">邮编</div>
        <input v-model="parameter.Zip" placeholder="请输入邮编" maxlength="5">
      </div>
      <div class="addCardTo" id="addCardTo" @click="changeCardTo">保存</div>
    </div>
    <alert v-if="showAlert"  @closeTip="close" :alertText="alertText"></alert>

  </div>
</template>

<script>
import headTop from '@/components/commen/header/head'
import alert from '@/components/commen/alert/alert'
import {mapState} from 'vuex'
import {delBankCard,addBankCard} from '@/service/getData'
import {getCookie} from '@/config/mUtils'
export default {
  name: 'changeCard',
  data () {
    return {
      titleName:'添加银行卡',
      noneHome:true,
      showAlert:false,
      Id:null,//修改的卡id
      parameter:{
        Token:null,
        Name:null,
        Card:null,
        Year:null,
        Month:null,
        Cvv:null,
        Zip:null,
        Id:0,
      }
    }
  },
  created(){
    this.Id = this.$route.query.Id;
    this.parameter.Id = this.Id;
    this.parameter = Object.assign(this.parameter,this.bancard.filter((ele,index)=>{
      return ele.Id == parseInt(this.Id)
    })[0])
  },
  methods:{
    changeCardTo(){
      if(!this.parameter.Name){
        this.showAlert = true;
        this.alertText = '姓名不能为空';
        return false
      }else if(!/^\d{16}$/.test(this.parameter.Card)){
        this.showAlert = true;
        this.alertText = '银行卡号错误，请重新输入';
        return false
      }else if(!/^0?[1-9]$|^1[0-2]$/.test(this.parameter.Month)){
        this.showAlert = true;
        this.alertText = '请输入正确月份';
        return false
      }else if(!/^\d{2}$/.test(this.parameter.Year)){
        this.showAlert = true;
        this.alertText = '请输入正确年份';
        return false
      }else if(!/^\d{3}$/.test(this.parameter.Cvv)){
        this.showAlert = true;
        this.alertText = '请输入正确安全码';
        return false
      }else if(!/^\d{5}$/.test(this.parameter.Zip)){
        this.showAlert = true;
        this.alertText = '请输入正确邮政编码';
        return false
      }else{
        this.parameter.Token = getCookie("USERToken");
        var parameter = JSON.parse(JSON.stringify(this.parameter))
        delete this.parameter.Type;

        addBankCard(this.parameter).then((response)=>{
          if(!response.data.Ret==0){
            for(let i=0;i<this.bancard.length; i++){
              if(this.bancard[i].Id == parseInt(this.parameter.Id)){
                // parameter.Card = parameter.Card.replace(/(.{4})(.{8})(.{4})/,'$1********$3');
                this.bancard = this.bancard.splice(i,1,parameter)
              }
            }
            this.$router.go(-1)
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
      'bancard'
    ])
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
      align-items:center;
      border-bottom: 1px solid #eee;
      .mr{margin-right: 0.266667rem}
      .nm{
        width:3rem;
        text-align: left;
        padding-left: 0.266667rem;
        @include font-dpr(14px);
        line-height: .8rem;
      }
      label{line-height: 1.2rem}
      input{@include font-dpr(14px);}
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
