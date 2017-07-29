<template>
  <section class="project" v-for="(item,index) in homeLike" :key="index">
    <div class="title"><i class="iconfont" :class="'icon-ulikeico'+item.gid"></i>{{item.partner}}</div>
    <div class="cont">
      <img :src="item.image" alt="" />
      <div class="cont-wrap">
        <div class="cont-p">{{item.title}}</div>
        <div class="cont-m">
          <div class="cont-m-box"><span class="now">$<b>{{item.mprice}}</b>/人</span><span class="before">$<b>{{item.price}}</b>/人</span></div>
          <div class="cont-m-star">
            <span class="star-pic">
              <i :style="'width:' + item.star*20 + '%'"></i>
            </span>
          </div>
          <div class="cont-m-how">已售<b>{{item.buynum}}</b></div>
        </div>
      </div>
    </div>
    <footer class="loader-more" v-show="preventRepeatReuqest">正在加载更多商家...</footer>
  </section>
</template>

<script>

import {mapState} from 'vuex'

export default {
  data(){
    return {

    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../../style/mixin';

</style>
