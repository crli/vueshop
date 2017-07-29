<template>
  <section class="messagedetail">
    <headTop noneHome=true :headTitle="titleName">
    </headTop>
    <div class="detail-box">
      <div class="detail">
      <div class="time">{{message.Time}}</div>
      <div class="contbox">
        <div class="cont-t">{{message.Title}}</div>
        <div class="cont-msg">{{message.Cont}}</div>
      </div></div>
    </div>
  </section>
</template>

<script>

import headTop from '@/components/commen/header/head'
import {mapState} from 'vuex'
export default {
  name: 'messagedetail',
  data () {
    return {
      titleName:''
    }
  },
  created(){
    this.titleName = this.$route.query.title;
  },
  methods:{

  },
  computed:{
    ...mapState([
      'message'
    ])
  },
  components:{headTop}
}
</script>

<style scoped lang="scss">
  @import '../../../../style/mixin';
  .messagedetail{
    position: fixed;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    z-index: 0;
    background:#eee;
    overflow: auto;
    .detail-box{
      width:100%;
      height:100%;
      padding:1.093333rem 0.533333rem 0.533333rem;
    }
    .time{
      line-height: 1.066667rem;
      text-align: center;
      @include font-dpr(15px);
      color:#999;
      background:#eee;
    }
    .detail{
      height:100%;
      background:#fff;overflow-y:scroll;
    }
    .contbox{
      padding:0.266667rem;
      height:auto;
      .cont-t{
        @include font-dpr(17px);
        margin-bottom: 0.4rem;
        color:#666
      }
      .cont-msg{
        color:#999;
        @include font-dpr(14px);
      }
    }
  }
</style>
