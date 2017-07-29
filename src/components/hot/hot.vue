<template>
  <section class="hot">
    <section class="ss">
      <div class="item" v-for="(val,index) in value"><span :class="{active:active==index}" @click="handleClick(index)">{{val}}</span></div>
    </section>
    <Foot ></Foot>
  </section>
</template>

<script>

import headTop from '@/components/commen/header/head'
import Foot from '@/components/commen/footer/foot'

export default {
  name: 'hot',
  data () {
    return {
      value:['啊啊','搜索','搜2索','搜3索','搜4索','搜5索','搜6索','搜索','搜索','搜索','搜索','搜索','搜7索','搜索','搜索','搜索'],
      active:0
    }
  },
  methods:{
    handleClick(index){
      this.active = index
    }
  },
  components:{headTop,Foot}
}
</script>

<style scoped lang="scss">
  @import '../../style/mixin';
  .ss{
    display:flex;
    overflow-y:scroll;
    background:#18c1d6;
    .item{
      font-size: 16px;
      line-height: 90px;
      span{display:block;width:80px;text-align: center;color:#c2edf2;}
      span.active{
        color:#fff
      }
    }
  }
</style>
