<template>
    <section id='foot'>
      <div class="footer">
          <router-link to="/home" class="item">
            <i class="iconfont icon-zhuye"></i><span>首页</span>
          </router-link>
          <router-link to="/discovery" class="item">
            <i class="iconfont icon-fujin"></i><span>发现</span>
          </router-link>
          <router-link :to="tok? '/cart':'/login'" class="item">
            <i class="iconfont icon-gouwu"></i><span>购物车</span>
          </router-link>
          <router-link :to="tok? '/admin':'/login'" class="item">
            <i class="iconfont icon-wode"></i><span>我的</span>
          </router-link>
      </div>
    </section>
</template>

<script>
import {getCookie} from '@/config/mUtils'

  import {mapState} from 'vuex'
    export default {
      name:'foot',
      data(){
          return{
            tok : ''
          }
      },

      mounted(){
        this.tok = getCookie("USERToken");
      },
      computed: {
          // ...mapState([
          //     'login'
          // ]),
      }
    }
</script>

<style lang="scss" scoped>
  @import '../../../style/mixin';
  #foot{height:1.28rem;}
  .footer{
      background-color: #fff;
      position: fixed;
      z-index: 100;
      left: 0;
      right: 0;
      bottom: 0;
      @include wh(100%, 1.28rem);
      line-height: 0.64rem;
      display: flex;
      border-top: 1px solid #f66;
      .item{
        display:block;
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        .iconfont{
            @include font-dpr(20px);
        }
        span{
          display:block;
          @include font-dpr(12px);
        }
      }
  }
</style>
