<template>
  <section class="news">
    <headTop :noneHome="noneHome" :headTitle="titleName">
    </headTop>
    <div class="box">
      <div class="news-list" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
        <section class="news-section" v-for="(item,index) in newsbox" @click="newsdetail(item.Id,item.Title,item.Cont)">
          <p>{{item.Title}}</p>
          <p>{{item.Cont}}</p>
          <p><span>{{item.CataName}}</span><span>{{item.Hits}}人看过</span></p>
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
import {GetNewsList} from '@/service/getData'
import infiniteScroll from 'vue-infinite-scroll'
import {getCookie} from '@/config/mUtils'
export default {
  name: 'newslist',
  data () {
    return {
      titleName:'由我头条',
      noneHome:true,
      newsbox:[],
      busy: true,
      loadernone:false,//没有数据提示
      page:0,
      cateid:''
    }
  },
  mounted(){
    this.cateid = this.$route.query.cateid;
    this.loadMore()
  },
  directives: {infiniteScroll},
  methods:{
      /**
       * [loadMore 无限加载]
       * @return {[type]} [description]
       */
      loadMore() {
        this.busy = true;
        this.loadernone = false;
        GetNewsList(getCookie("USERToken"),this.cateid,10,this.page++).then((response) => {
          this.newsbox = [...this.newsbox, ...response.data];
          if (response.data.length < 10) {
            this.loadernone = true;
            return
          }
          this.busy = false;
        })
      },
      newsdetail(Id,title,Cont){
        this.$router.push("newslist/newsdetail?id="+Id+"&title="+title+"&Cont="+Cont)
      }
  },
  components:{headTop}
}
</script>

<style scoped lang="scss">
  @import '../../style/mixin';
  .box{padding-top: 1.093333rem}
  .head-other{
    z-index: 0!important
  }
  .news-section{
    background:#fff;
    margin-bottom: 0.266667rem;
    padding: 0.266667rem;
    p:nth-child(1){
      @include font-dpr(16px)
    }
    p:nth-child(2){
      margin:0.266667rem 0;
      line-height: 0.613333rem;
      @include font-dpr(12px);
      @include ellipsis(2)
    }
    p:nth-child(3){
      @include font-dpr(12px)
      span:first-child{
        color:$fcolor;
        border: 1px solid $fcolor;
        padding:0.053333rem 0.106667rem;
      }
      span:last-child{
        color:#666;
        margin-left: 0.266667rem
      }
    }
  }
</style>
