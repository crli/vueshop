<template>
  <div class="wrap">
    <headTop :noneHome="noneHome" :headTitle="titleName"></headTop>
    <div class="box">
      <router-link to="/repassword" class="item"tag="div">
        <div class="cont"><span>找回/修改密码</span><span class="de">利用账号绑定的手机找回/修改密码</span></div>
        <div><i class="iconfont icon-arrow-right"></i></div>
      </router-link>
      <!-- <router-link to="/appeal/complaint" class="item"tag="div">
        <div class="cont"><span>账号申诉</span><span class="de">通过提交资料找回账号密码及更换绑定手机、邮箱</span></div>
        <div><i class="iconfont icon-arrow-right"></i></div>
      </router-link> -->
    </div>

    <transition name="router-slid">
        <router-view></router-view>
    </transition>

  </div>
</template>

<script>
import headTop from '@/components/commen/header/head'
export default {
  name: 'appeal',
  data () {
    return {
      titleName:'账号安全中心',
      noneHome:true,
    }
  },

  methods: {

  },
  components:{headTop}
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
    @include wh(100%,1.8rem);
    padding:0 0.266667rem;
    display:flex;
    justify-content:space-between;
    align-items:center;
    border-bottom: 1px solid #eee;
    span{
      @include font-dpr(14px);display:block;line-height: 0.9rem;
    }
    .icon-arrow-right{@include font-dpr(14px);}
    .de{color:#999;@include font-dpr(12px);}
  }
  a.router-link-active{color:#000}
}
.router-slid-enter-active, .router-slid-leave-active {
    transition: all .4s;
}
.router-slid-enter, .router-slid-leave-active {
    transform: translateX(100%);
}

</style>
