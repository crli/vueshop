<template>
  <div class="wrap">
    <headTop :noneHome="noneHome" :headTitle="titleName"></headTop>
    <div class="box">
      <section class="item">
        <input type="file" class="upload" @change="upload" ref="upload">
        <span>头像</span>
        <div class="head-box">
            <img :src="headPhoto"v-if="headPhoto">
            <i class="iconfont icon-touxiang" v-else></i>
            <i class="iconfont icon-arrow-right"></i>
        </div>
      </section>
      <section class="item" @click="$router.push('/admin/setUp/personalData/changeName')">
        <span>帐户名</span>
        <div class="msg">{{AccountName||"未设置"}}<i class="iconfont icon-arrow-right"></i></div>
      </section>
      <section class="item">
        <span>性别</span>
        <div class="mf-box">
          <div class="mf-item" @change="fmselect">
            <input type="radio" value="M" id="M" v-model="Gender"/>
            <label for="M">男</label>
          </div>
          <div class="mf-item" @change="fmselect">
            <input type="radio" value="F" id="F" v-model="Gender"/>
            <label for="F">女</label>
          </div>
        </div>
      </section>
      <section class="item" @click="openPicker">
        <span>出生日期</span>
        <div class="msg">{{BirthDay}}<i class="iconfont icon-arrow-right"></i></div>

      </section>
       <div class="out-login" @click="outlogin">退出登录</div>
    </div>

    <transition name="router-slid">
        <router-view></router-view>
    </transition>
    <alert v-if="showAlert"  @closeTip="close" :alertText="alertText"></alert>
    <DatetimePicker ref="picker" v-model="time" type="date" :startDate="new Date(new Date().getFullYear() - 80, 0, 1)" @confirm="handleConfirm"></DatetimePicker>
    <message v-if="showMsg"   @del="returnto" @close="signout" message="是否退出登录" delmessage="再等等" cancelmessage="退出登录"></message>
  </div>
</template>

<script>
import headTop from '@/components/commen/header/head'
import alert from '@/components/commen/alert/alert'
import message from '@/components/commen/message/message'
import { DatetimePicker } from 'mint-ui';
import {mapState,mapMutations} from 'vuex'
import {userUploadAtt,getUser,UpdateUserInfo} from '@/service/getData'
import {getCookie,setStore} from '@/config/mUtils'
export default {
  name: 'personalData',
  data () {
    return {
      titleName:'个人资料',
      noneHome:true,
      headPhoto:'',
      AccountName:'',
      Gender:'',
      BirthDay:'',
      showAlert:false,
      alertText:'',
      showMsg:false,
      time:new Date(new Date().getTime())
    }
  },

  methods: {
      ...mapMutations([
        'RECORD_USERINFO','OUT_LOGIN','CHANGE_USERINFOR'
      ]),
      upload(){
        if (this.userInfo) {
          let input = this.$refs.upload
          let data = new FormData();
          data.append('file', input.files[0]);
          var tok = getCookie("USERToken");
          userUploadAtt(data,'avatar',tok,0, {headers: {'Content-Type': data.type}}).then((response)=>{
            this.headPhoto = response.data[0].msg.url;
            getUser(getCookie("USERToken")).then((response)=>{
              this.RECORD_USERINFO(response.data);
              setStore("UWUSER",response.data)
            })
          }).catch(()=>{
            this.showAlert = true;
            this.alertText = '上传失败';
          })
        }
      },
      openPicker() {
        this.$refs.picker.open();
      },
      handleConfirm(){

        let date = new Date(this.time);
        let localeDateString = date.toLocaleDateString();
        let y =  date.getFullYear();
        let m = date.getMonth()+1 ;
        let d = date.getDate();
        UpdateUserInfo(getCookie("USERToken"),localeDateString,this.Gender,this.AccountName).then((response)=>{
          if(response.data.Ret == 0){
            this.BirthDay = y+"-"+m+"-"+d;
            this.CHANGE_USERINFOR({"BirthDay":this.BirthDay});

          }
        })
      },
      fmselect(){
        UpdateUserInfo(getCookie("USERToken"),this.BirthDay,this.Gender,this.AccountName).then((response)=>{
          if(response.data.Ret == 0){
            this.CHANGE_USERINFOR({"Gender":this.Gender});

          }
        })
      },
      close(){
        this.showAlert = false;
      },
      signout(){
        this.OUT_LOGIN();
        this.$router.push('/')
      },
      outlogin(){
        this.showMsg = true;
      },
      returnto(){
        this.showMsg = false;
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
        this.headPhoto = value.headPhoto;
        this.AccountName = value.AccountName;
        this.Gender = value.Gender;
        this.BirthDay = value.BirthDay;
      }
    }
  },
  components:{headTop,DatetimePicker,message,alert}
}
</script>
<style scoped lang="scss">
@import '../../../../style/mixin';
.wrap{
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  z-index: 103;
  background:#fff;
  overflow: auto;
  .box{
    width:100%;
    height:100%;
    padding-top:1.093333rem;
  }
  .item{
    position:relative;
    @include wh(100%,1.2rem);
    padding:0 0.266667rem;
    display:flex;
    justify-content:space-between;
    align-items:center;
    border-bottom: 1px solid #eee;
    .upload{
      position:absolute;
      @include wh(100%,1.2rem)
      display:block;
      opacity: 0
    }
    span{
      @include font-dpr(14px);
    }
    .head-box{
      display:flex;
      align-items:center;
      img{
        @include wh(0.906667rem,0.906667rem);
        margin-right: 0.266667rem;
        border-radius: 50%
      }
      .icon-touxiang{
        @include font-dpr(30px);
        color:$ic
      }
    }
    .icon-arrow-right{@include font-dpr(13px);}
    .mf-box{
      display:flex;height:100%;
      .mf-item{
        display:flex;
        align-items:center;
        margin-left: 0.266667rem;
        height:100%;
        input{height:100%}
      }
    }
    .msg{@include font-dpr(13px);i{margin-left: 0.266667rem;}}
  }
}
.out-login{
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
