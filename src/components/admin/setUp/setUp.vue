<template>
  <div class="setup">
    <headTop :noneHome="noneHome" :headTitle="titleName"></headTop>
    <div class="box">
      <router-link to="/admin/setUp/personalData" class="item" tag="div">
        <div class="left">个人资料</div>
        <div class="right"><i class="iconfont icon-arrow-right"></i></div>
      </router-link>
      <router-link to="/admin/setUp/acountManage" class="item" tag="div">
        <div class="left">账户管理</div>
        <div class="right"><i class="iconfont icon-arrow-right"></i></div>
      </router-link>
<!--       <router-link to="/setUp/language" class="item" tag="div">
        <div class="left">系统语言</div>
        <div class="right">简体中文<i class="iconfont icon-arrow-right"></i></div>
      </router-link> -->
      <router-link to="/admin/setUp/currency" class="item" tag="div">
        <div class="left">默认币种</div>
        <div class="right">{{txt}}<i class="iconfont icon-arrow-right"></i></div>
      </router-link>
      <div  class="item" tag="div">
        <div class="left">距离单位</div>
        <div class="right mf">
          <div class="mf-item" @change="Disselect">
            <input type="radio" value="km" id="km" v-model="distanceunit"/>
            <label for="km">km</label>
          </div>
          <div class="mf-item" @change="Disselect">
            <input type="radio" value="mile" id="mile" v-model="distanceunit"/>
            <label for="mile">mile</label>
          </div>
        </div>
      </div>
    </div>
    <transition name="router-slid">
        <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import headTop from '@/components/commen/header/head'
import {UserSettings,GetUserSettings} from '@/service/getData'
import {getStore,getCookie} from '@/config/mUtils'
export default {
  name: 'setUp',
  data () {
    return {
      titleName:'设置',
      noneHome:true,
      txt:"美元",
      distanceunit:''
    }
  },
  created(){
    document.body.setAttribute("class","hid");
    this.init()

  },
  mounted(){
    GetUserSettings(getCookie("USERToken")).then((response)=>{
      this.distanceunit = response.data.distanceunit
    })
  },
  destroyed(){
    document.body.removeAttribute("class","hid");
  },
  methods:{

    init(){
      let flag = getStore("DOLLORFLAG");
      if(flag=='c'){
        this.txt = "人民币"
      }else{
        this.txt = "美元"
      }
    },
    Disselect(){
      UserSettings(getCookie("USERToken"),'s','d',this.distanceunit)
    }
  },
  watch:{
    '$route' (to, from) {
      if(from.path=='/admin/setUp/currency'){
        this.init()
      }
    }
  },

  components:{headTop}
}
</script>
<style scoped lang="scss">
@import '../../../style/mixin';

.setup{
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  z-index: 0;
  background:#eee;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}
.box{
   padding-top: 1.093333rem;
    width:100%;
    height:100%;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  .item{
    position: relative;
    height: 1.2rem;
    background:#fff;
    line-height: 1.2rem;
    padding:0 0.266667rem;
    display: flex;
    justify-content:space-between;
    border-bottom: 1px solid #eee;@include font-dpr(14px);
    i{
      margin-left: 0.266667rem;
      @include font-dpr(12px);
    }
  }
  .mf{
    display:flex;
    .mf-item{
      display: flex;
      align-items: center;
      height: 100%;
    }
    .mf-item:first-child{
      margin-right: 0.3rem;
    }
  }
}
.router-slid-enter-active, .router-slid-leave-active {
    transition: all .4s;
}
.router-slid-enter, .router-slid-leave-active {
    transform: translateX(100%);
}
.mm{margin:0.4rem;font-size: 50px}
</style>
