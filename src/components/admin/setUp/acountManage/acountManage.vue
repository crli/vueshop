<template>
  <div class="wrap">
    <headTop :noneHome="noneHome" :headTitle="titleName"></headTop>
    <div class="box">
      <router-link to="/admin/setUp/acountManage/retel" class="item" tag="div">
        <span>绑定手机号<b>{{telephone}}</b></span>
        <div class="nm">更换<i class="iconfont icon-arrow-right"></i></div>
      </router-link>
      <router-link to="/admin/setUp/acountManage/remail" class="item" tag="div">
        <span>绑定邮箱<b>{{Email}}</b></span>
        <div class="nm">更换<i class="iconfont icon-arrow-right"></i></div>
      </router-link>
      <router-link to="/admin/setUp/acountManage/repassworld" class="item" tag="div" >
        <span>账号安全中心</span>
        <div class="nm"><span>修改密码</span><i class="iconfont icon-arrow-right"></i></div>
      </router-link>
    </div>
    <transition name="router-slid">
        <router-view></router-view>
    </transition>

  </div>
</template>

<script>
import headTop from '@/components/commen/header/head'
import {mapState} from 'vuex'
export default {
  name: 'acountManage',
  data () {
    return {
      titleName:'账号管理',
      noneHome:true,
      telephone:'',
      Email:''
    }
  },

  methods: {

  },
  computed:{
    ...mapState([
      'userInfo'
    ])
  },
  watch:{
    userInfo:function (value) {
      if(value && value.ID){
        this.telephone = value.Tel.replace(/(.{3})(.{4})(.{3})/, '$1****$3');
        this.Email = value.Email
      }
    },

  },
  components:{headTop}
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
  z-index: 3;
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

    span{
      @include font-dpr(14px);
      b{margin-left: 0.2rem;@include font-dpr(14px);}
    }
    .nm{
      @include font-dpr(14px);
      i{@include font-dpr(12px);}
    }
  }
}
.router-slid-enter-active, .router-slid-leave-active {
    transition: all .4s;
}
.router-slid-enter, .router-slid-leave-active {
    transform: translateX(100%);
}

</style>
