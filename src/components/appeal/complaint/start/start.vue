<template>
  <div class="wrap">
    <headTop :noneHome="noneHome" :headTitle="titleName"></headTop>
    <div class="box">

    </div>
    <transition name="router-slid">
        <router-view></router-view>
    </transition>

  </div>
</template>

<script>
import headTop from '@/components/commen/header/head'
export default {
  name: 'start',
  data () {
    return {
      titleName:'申述',
      noneHome:true,
    }
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
  z-index: 103;
  background:#eee;
  overflow: auto;
  .box{
    width:100%;
    height:100%;
    padding:1.093333rem 0.266667rem 0;
  }
}


.router-slid-enter-active, .router-slid-leave-active {
    transition: all .4s;
}
.router-slid-enter, .router-slid-leave-active {
    transform: translateX(100%);
}

</style>
