<template>
  <div class="wrap">
    <headTop :noneHome="noneHome" :headTitle="titleName"></headTop>
    <div class="box">
      <section class="section">
        <div class="head">
          <div class="left"><span>评价({{commentbox.total}})</span></div>
          <div class="right">
            <span class="star-pic">
              <i :style="'width:' + commentbox.Star*20 + '%'"></i>
            </span>
            <span>{{commentbox.Star}}</span>
          </div>
        </div>
        <div class="tagbox" v-if="commentbox.Comtags&&commentbox.Comtags.length>0">
          <span :class="[active==index ? 'active' : '', value.Good]" v-for="(value,index) in commentbox.Comtags" @click="selectid(value.Id,index)">{{value.Txt}}({{value.Num}})</span>
        </div>
        <div class="comment-box" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="20">
          <section v-for="value in list" class="comment-item">
            <div class="comment-t">
              <div class="img">
                <img :src="value.face" alt="" />
                <div class="name-box">
                  <div class="name">{{value.name}}</div>
                  <div class="time">{{value.time}}</div>
                </div>
              </div>
              <div class="star-pic">
                <i :style="'width:' + value.star*20 + '%'"></i>
              </div>
            </div>
            <div class="comment-c">
              <div class="cont-box">{{value.cont}}</div>
              <div class="img-box">
                <img :src="v" alt="" v-for="v in value.img"/>
              </div>
            </div>
            <div class="comment-b">消费评价-{{commentbox.Title}}</div>
          </section>
          <footer class="loader-more" id="none-load" v-show="!loadernone">正在加载更多...</footer>
          <footer class="loader-none"  v-show="loadernone">已经全部加载完毕</footer>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import headTop from '@/components/commen/header/head'
import infiniteScroll from 'vue-infinite-scroll'
import {getTeamCommentList} from '@/service/getData'
import {getStore} from '@/config/mUtils'
export default {
  name:'allcomment',
  data(){
    return{
      titleName:'全部评价',
      noneHome:true,
      parameter:{
        Type:'',
        Id:null,
        TagId:0,
        Page:1,
        PageSize:20
      },
      commentbox:'',
      busy: false,
      loadernone:false,//没有数据提示
      list:[],
      active:-1
    }
  },
  created(){;
    document.body.setAttribute("class","hid");
  },
  beforeMount(){
    this.parameter.Id = this.$route.query.id;
    this.parameter.Type = this.$route.query.type;
  },
  mounted(){
    this.commentbox = JSON.parse(getStore('COMMENT_SAVE'))
  },
  directives: {infiniteScroll},
  destroyed(){
    if(this.$route.path == "/team"||this.$route.path == "/partner"){
      document.body.removeAttribute("class","hid");
    }
  },
  methods: {
    loadMore() {
      //防止重复请求
      this.busy = true;
      this.loadernone = false;
      getTeamCommentList(this.parameter).then((response)=>{
        if(response.data.total){
          this.initStart(response.data);
          if (response.data.total < 20) {
            this.busy = true;
            this.loadernone = true;
            return
          }
        }else{
          this.busy = true;
          this.loadernone = true;
          return
        }
        this.busy = false;
      })
    },
    initStart(data){
      this.parameter.Page++
      this.list = [...this.list, ...data.list];
    },
    selectid(id,index){
      this.parameter.TagId = id;
      this.parameter.Page = 1;
      this.list = [];
      this.active = index;
      this.loadMore()
    }
  },
  components:{headTop}
}
</script>

<style lang="scss" scoped>
@import '../../../style/mixin';
.wrap{
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  z-index: 0;
  background:#fff;
  overflow: auto;
  -webkit-overflow-scrolling: touch;

  .box{
    padding-top: 1.093333rem;
    width:100%;
    height:100%;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }
  .section{
    background:#fff;
    padding:0 0.266667rem;
    .head{
      display:flex;justify-content:space-between;line-height: 1.093333rem;
      span{
        @include font-dpr(14px);
      }
      .right{
        .iconfont{@include font-dpr(14px);}
      }
    }
    .tagbox{
      padding:0.2rem 0 0.4rem 0;
      border-bottom: 1px solid #eee;
      span{
        display: inline-block;
        padding: 0.05rem 0.2rem;
        margin: 0.2rem 0.2rem 0 0;
        @include font-dpr(12px);
        border:1px solid #ddd;
        color:#666;
        &.Y{
          color: $ic;
          border-color: $ic
        }
        &.active{
          background: $ic;
          color:#fff
        }
      }
    }
    .star-pic{
      @include wh(2.173333rem, 0.346667rem);
      background: url('../../../assets/img/star0.png') no-repeat;
      background-size: 100% 100%;
      display: inline-block;
      vertical-align: middle;
      margin-right: 0.133333rem;
      i{
        background: url('../../../assets/img/star.png')no-repeat;
        display: inline-block;
        height: 0.346667rem;
        overflow: hidden;
        vertical-align: top;
        background-size: auto 100%;}
    }
    .comment-item{
      border-bottom: 1px solid #eee;
      .comment-t{
        display:flex;
        justify-content:space-between;
        margin:0.266667rem 0;
        .img{
          display:flex;
        }
        img{
          @include wh(1.013333rem,1.013333rem);
          border-radius: 50%;
          margin-right: 0.4rem;
        }
        .name{@include font-dpr(14px);}
        .time{@include font-dpr(11px);}
      }
      .comment-c{
        line-height: 0.426667rem;
        margin-bottom: 0.266667rem;
        .cont-box{@include font-dpr(14px);}
        .img-box{
          margin:0.266667rem 0;
          img{
            width:2.0rem;height:1.5rem;margin-right: 0.266667rem;
          }
        }
      }
      .comment-b{
        margin-bottom: 0.266667rem;@include font-dpr(12px)
      }
    }
  }
}
</style>
