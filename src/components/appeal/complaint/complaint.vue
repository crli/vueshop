<template>
  <div class="wrap">
    <headTop :noneHome="noneHome" :headTitle="titleName"></headTop>
    <div class="box">
      <div class="box-wrap">
        <div class="item">申述适用范围：无法正常登录由我团账号，如手机 号停止使用、忘记密码等</div>
        <div class="item">申述结果会在<b>48小时</b>内以<b>短信</b>告知您</div>
        <div class="item">申述成功后请根据指引，检查并修改相应信息</div>
        <div class="item">恶意申述他人的账号将承担法律责任</div>
      </div>
      <router-link to="/appeal/complaint/start" class="com-to" tag="div">开始申诉</router-link>
    </div>
    <transition name="router-slid">
        <router-view></router-view>
    </transition>

  </div>
</template>

<script>
import headTop from '@/components/commen/header/head'
export default {
  name: 'complaint',
  data () {
    return {
      titleName:'账号申述',
      noneHome:true,
    }
  },

  components:{headTop}
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
  .box{
    width:100%;
    height:100%;
    padding:1.093333rem 0.266667rem 0;
    .box-wrap{
      margin-top: 0.666667rem;
      background:#fff;
      padding:0.4rem 0;
      .item{
        line-height: 0.693333rem;
        position:relative;
        padding-left: 0.8rem;
        &:before{
          position:absolute;
          content:'';
          background:$ic;
          width:0.213333rem;
          height:0.213333rem;
          border-radius: 50%;
          left:0.4rem;
          top:0.2rem;
        }
      }
      b{color:$ic}
    }
  }
}
.com-to{
    width:100%;
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
