<template>
  <div class="detailwrap">
    <headTop :noneHome="noneHome" :headTitle="titleName"></headTop>
    <div class="box" >
      <section class="section1">
        {{this.Cont}}
      </section>
      <section class="section2">
        <div class="left">用户评论({{newslist.length}})</div>
        <div class="right" @click="writecomment"><i class="iconfont icon-xie"></i>写评论</div>
      </section>
      <section class="section3">
          <div class="news-list" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
            <section class="news-section" v-for="(item,index) in newslist">
              <div class="img">
                <img :src="item.Avatar" alt="" /><span>{{item.UserName}}</span>
              </div>
              <div class="cont">
                <p>{{item.Cont}}</p>
              </div>
              <div class="like">
                <span @click="addlike(item.Id,item.Like,index)"><i :class="item.Like" class="iconfont icon-zankongxingai"></i>{{item.LikeNum}}人</span>
              </div>
            </section>
          </div>
          <footer class="loader-more" v-show="!loadernone">正在加载更多...</footer>
          <footer class="loader-none" v-show="loadernone">已经全部加载完毕</footer>
      </section>
    </div>
    <transition name="router-slid">
        <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import headTop from '@/components/commen/header/head'
import {getNewsCommentList,UserLikeNewsComment} from '@/service/getData'
import {mapMutations, mapState} from 'vuex'
import infiniteScroll from 'vue-infinite-scroll'
import {getCookie} from '@/config/mUtils'
export default {
  name: 'newsdetail',
  data () {
    return {
      titleName:null,
      noneHome:true,
      TeamId:null,
      teamCont:[],
      busy: true,
      loadernone:false,//没有数据提示
      page:1,
      Cont:null,
      first:true
    }
  },
  created(){
    document.body.setAttribute("class","hid");
  },
  destroyed(){
    document.body.removeAttribute("class","hid");

  },
  beforeMount(){
    this.TeamId = this.$route.query.id;
    this.titleName = this.$route.query.title;
    this.Cont = this.$route.query.Cont;
  },
  mounted(){
    this.loadMore()
  },
  directives: {infiniteScroll},
  methods:{
      ...mapMutations([
        'SAVE_NEWS_COM'
      ]),
      /**
       * [loadMore 无限加载]
       * @return {[type]} [description]
       */
      loadMore() {
        this.busy = true;
        this.loadernone = false;
        getNewsCommentList(getCookie("USERToken"),this.TeamId,this.page++,10).then((response) => {
          this.teamCont = [...this.teamCont, ...response.data.List];
          this.SAVE_NEWS_COM(this.teamCont);
          if (response.data.List.length < 10) {
            this.loadernone = true;
            return
          }
          this.busy = false;
        })
      },
      addlike(Id,like,index){
        UserLikeNewsComment(getCookie("USERToken"),Id,'like').then((response)=>{
          if(like=="N"){
            if(response.data.Ret == 0){
              this.teamCont[index].Like = "Y";
              let num = this.teamCont[index].LikeNum;
              this.teamCont[index].LikeNum= String(Number(num)+1);
            }
          }else{
            if(response.data.Ret == 0){

              this.teamCont[index].Like = "N";
              let num = this.teamCont[index].LikeNum;
              this.teamCont[index].LikeNum=String(Number(num)-1);
            }
          }
          this.SAVE_NEWS_COM(this.teamCont);
        })
      },
      writecomment(){
        this.$router.push("/newslist/newsdetail/newscomment?id="+this.TeamId+"&title="+this.titleName+"&Cont="+this.Cont)
      }
  },
  computed:{
    ...mapState([
      'newslist'
    ])
  },
  components:{headTop}
}
</script>
<style scoped lang="scss">
@import '../../../style/mixin';

.detailwrap{
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  z-index: 0;
  background:#fff;
  overflow: auto;
  .box{
    padding-top: 1.093333rem;
    width:100%;
    height:100%;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }
  .section1{
    min-height:2.666667rem;
    @include font-dpr(14px);
    padding:0.266667rem;
  }
  .section2{
    display:flex;
    justify-content:space-between;
    border-bottom: 1px solid #ddd;
    padding: 0 0.266667rem 0.266667rem;
    .left{
      @include font-dpr(14px)
    }
    .right{
      @include font-dpr(12px);
      color:$fcolor;
      border:1px solid $fcolor;
      padding:0.08rem 0.133333rem 0.08rem 0.08rem;
      i{
        color:$fcolor;
        @include font-dpr(12px);
        padding: 0 0.066667rem
      }
    }
  }
  .section3{
    .news-section{
      padding:0.4rem 0.266667rem;
      border-bottom: 1px solid #ddd;
    }
    .img{
      img{
        @include wh(1.066667rem,1.066667rem);
        border-radius: 50%;
        margin-right: 0.266667rem;vertical-align: middle
      }
      span{
        color:$fcolor;
        @include font-dpr(12px);

      }
    }
    .cont{
      padding-left: 1.333333rem;
      p{
        line-height: 0.48rem;
        width:7rem;
        word-wrap:break-word;
      }

    }
    .like{
      position:relative;
      span{
        position:absolute;
        right:0rem;
        bottom:-0.266667rem;
        i{
          margin-right: 0.266667rem;
          &.Y{color:$fcolor}

        }
      }
    }

  }
}
</style>
