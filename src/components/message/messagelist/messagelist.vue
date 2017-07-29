<template>
  <section class="messagelist">
    <headTop noneHome=true :headTitle="titleName">
    </headTop>
    <div class="listbox">
      <div class="project-list" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
        <section class="list" v-for="(item,index) in msgbox" >
          <div class="time">{{item.Time}}</div>
          <div class="contbox">
            <div class="cont-t">{{item.Title}}</div>
            <div class="cont-msg">{{item.Cont}}</div>
            <div class="see" @click ="routerpush(item)">
              <span>查看详情</span>
              <i class="iconfont icon-arrow-right"></i>
            </div>
          </div>
        </section>
      </div>
      <footer class="loader-more" v-show="!loadernone">正在加载更多...</footer>
      <footer class="loader-none" v-show="loadernone">已经全部加载完毕</footer>
    </div>
    <transition name="router-slid">
      <router-view></router-view>
    </transition>
  </section>
</template>

<script>

import headTop from '@/components/commen/header/head'
import infiniteScroll from 'vue-infinite-scroll'
import {UserMsgList} from "@/service/getData"
import {getCookie} from '@/config/mUtils'
import {mapMutations} from 'vuex'
export default {
  name: 'messagelist',
  data () {
    return {
      titleName:"",
      type:"",
      page:1,
      busy: true,
      loadernone:false,//没有数据提示
      msgbox:[]
    }
  },
  created(){
    this.type = this.$route.query.type;
    switch (this.type) {
      case "Comment":
        this.titleName = "评价互动"
        break;
      case "Coupon":
        this.titleName = "优惠券消息"
        break;
      case "Discount":
      this.titleName = "优惠活动"
        break;
      case "Notice":
      this.titleName = "通知提醒"
        break;
    }

  },
  mounted(){
    this.loadMore()
  },
  directives: {infiniteScroll},
  methods:{
    ...mapMutations([
      'SET_MSG'
    ]),
    /**
     * [loadMore 无限加载]
     * @return {[type]} [description]
     */
    async loadMore() {
      this.busy = true;
      this.loadernone = false;
      let response = await UserMsgList(getCookie("USERToken"),this.page++,10,this.type);
      this.msgbox = [...this.msgbox, ...response.data.List];
      if (response.data.List.length < 10) {
        this.loadernone = true;
        return
      }
      this.busy = false;
    },
    routerpush(item){
      this.SET_MSG(item);
      this.$router.push('/message/messagelist/messagedetail?title='+this.titleName)
    }
  },

  components:{headTop}
}
</script>

<style scoped lang="scss">
  @import '../../../style/mixin';
  .messagelist{
    position: fixed;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    z-index: 0;
    background:#eee;
    overflow: auto;
    .listbox{
      padding-top: 1.093333rem;
      width:100%;
      height:100%;
    }
    .time{
      line-height: 1.066667rem;
      text-align: center;
      @include font-dpr(15px);
      color:#999
    }
    .contbox{
      margin: 0 0.533333rem;
      background:#fff;
      padding:0.266667rem;
      padding-bottom: 0;
      .cont-t{
        @include font-dpr(17px);
        margin-bottom: 0.4rem;
        color:#666
      }
      .cont-msg{
        color:#999;
        @include font-dpr(14px);
        @include ellipsis(2);
        margin-bottom: 0.453333rem;
      }
      .see{
        border-top: 1px solid #eee;
        line-height: 1.226667rem;
        display:flex;
        justify-content:space-between;
        @include font-dpr(14px);
        span,i{
          color:#666;
        }
        i{@include font-dpr(12px);}
      }
    }
  }
</style>
