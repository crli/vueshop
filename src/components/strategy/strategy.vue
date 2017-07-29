<template>
  <section class="strategy">
    <headTop :noneHome="noneHome" :headTitle="titleName">
    </headTop>
    <div class="box">
      <div class="strategy-list" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
        <section class="strategy-section" v-for="(item,index) in strategybox" >
          <div class="img">
            <img :src="item.Img" alt="" @click="nextto(item.Id)"/>
            <span>{{item.Title}}</span>
          </div>
          <div class="cont">
            <div class="text">
              {{item.Cont}}
            </div>
            <div class="like">
              <div class="like-cont"@click="addlike(item.Id,item.Like,index)"><i :class="item.Like" class="iconfont icon-hua" ></i><span>{{item.LikeNum}}</span>人点赞</div>
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
import {GetNewsList,UserLikeNewsComment} from '@/service/getData'
import infiniteScroll from 'vue-infinite-scroll'
import {getCookie} from '@/config/mUtils'
export default {
  name: 'strategy',
  data () {
    return {
      titleName:'实用攻略',
      noneHome:true,
      strategybox:[],
      busy: true,
      loadernone:false,//没有数据提示
      page:1,
    }
  },
  mounted(){
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
        GetNewsList(getCookie("USERToken"),759,10,this.page++).then((response) => {
          this.strategybox = [...this.strategybox, ...response.data];
          if (response.data.length < 10) {
            this.loadernone = true;
            return
          }
          this.busy = false;
        })
      },
      nextto(Id){
        this.$router.push("strategy/strategydetail?id="+Id)
      },
      addlike(Id,like,index){
        UserLikeNewsComment(getCookie("USERToken"),Id,'newslike').then((response)=>{
          if(like=="N"){
            if(response.data.Ret == 0){
              this.strategybox[index].Like = "Y";
              let num = this.strategybox[index].LikeNum;
              this.strategybox[index].LikeNum= Number(num)+1;
            }
          }else{
            if(response.data.Ret == 0){
              this.strategybox[index].Like = "N";
              let num = this.strategybox[index].LikeNum;
              this.strategybox[index].LikeNum=Number(num)-1;
            }
          }
        })
      }
  },
  components:{headTop}
}
</script>

<style scoped lang="scss">
  @import '../../style/mixin';
  .box{padding-top: 1.093333rem}
  .strategy-section{
    margin-bottom: 0.266667rem;
    .img{
      @include wh(100%,4.8rem);
      position:relative;
      img{
        @include wh(100%,100%)
      }
      span{
        @include cl;
        bottom:1.066667rem;
        padding: 0 0.266667rem;
        color:#fff;
        @include font-dpr(14px)
      }
    }
    .cont{
      padding: 0 0.266667rem;
      @include wh(100%,1.4rem);
      display:flex;
      background:#fff;
      .text{
        flex:1;
        line-height: 0.64rem;
        @include ellipsis(2);
        @include font-dpr(13px)
      }
      .like{
        width:28%;
        position:relative;
        .like-cont{
          position:absolute;
          bottom:0.133333rem;
          right:0;
          @include font-dpr(13px)
          i.Y{color:$fcolor}
        }
      }
    }
  }
</style>
