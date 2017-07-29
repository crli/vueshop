<template>
  <div class="discover-list" v-infinite-scroll="loadMore" id="discover-list" infinite-scroll-disabled="busy" infinite-scroll-distance="20">
    <section class="list-item" v-for="item in teamlist">
      <div class="top" @click ="routerpushPart(item.Pid)">
        <div class="img">
          <img v-lazy="item.Img" alt="" />
        </div>
        <div class="cont ellipsis">
          <p class="title ellipsis">{{item.Title}}</p>
          <p><span class="star-pic">
            <i :style="'width:' + item.Star*20 + '%'"></i>
          </span></p>
          <p class="ellipsis">{{item.Category}}</p>
          <p class="money">
            <span>$<span>{{item.Percapita}}</span>/人</span>
            <span>{{item.Distance||'暂无数据'}}</span>
          </p>
        </div>
      </div>
      <div class="center"></div>
      <div class="bot">
        <div class="item ellipsis" v-for="value in item.Team" @click="routerpush(value.TeamId)">{{value.Title}}</div>
      </div>
    </section>
    <footer class="loader-more" v-show="!loadernone">正在加载更多商家...</footer>
    <footer class="loader-none" v-show="loadernone">没有了...</footer>
  </div>
</template>

<script>
  import infiniteScroll from 'vue-infinite-scroll'
  import {getPartnerTeamList} from '@/service/getData'
    export default {
      name:'list',
      data(){
        return{
          busy: false,
          loadernone:false,//没有数据提示
          teamlist:[]//总团单数据
        }
      },
      mounted(){

      },
      directives: {infiniteScroll},
      props: ['parameter'],
      methods: {
        loadMore() {
          //防止重复请求

          this.busy = true;
          this.loadernone = false;
          getPartnerTeamList(this.parameter).then((response)=>{
            console.log(response.data.length)
            if(response.data.length){
              this.teamlist = [...this.teamlist, ...response.data]
              if (response.data.length < 20) {
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
          this.parameter.page++
          this.teamlist = [...this.teamlist, ...data];
        },
        routerpush(id){
          this.$router.push("/team?id="+id+"&type=t")
        },
        routerpushPart(id){
          this.$router.push("/partner?id="+id+"&type=p")
        },
      }
    }
</script>

<style lang="scss" scoped>
  @import '../../../style/mixin';
  .discover-list{
    position: relative;
    width:100%;
    height:auto;
    padding-bottom: 1.28rem;

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
    .list-item{
      background:#fff;
      padding:0.266667rem 0.266667rem 0;
      margin-top:0.426667rem;
      .top{
        display:flex;
        .img{
          @include wh(2.666667rem,2.373333rem);
          img{@include wh(2.666667rem,2.373333rem);}
          margin-right:0.4rem;
        }
        .cont{
          flex:1;
          p{line-height: 0.613333rem;@include font-dpr(12px);}
          p.title{
            @include font-dpr(14px);
          }
          p.money{
            display:flex;
            justify-content:space-between;
          }
        }
      }
      .center{
        height:0.773333rem;
        line-height: 0.773333rem;
        border-bottom: 1px solid #eee;
        @include font-dpr(13px);
        color:$ic;
      }
      .bot{
        .item{
          height: 0.906667rem;
          line-height: 0.906667rem;
          margin-left:3.06667rem;
          position: relative;
          padding-left: 0.666667rem;
          @include font-dpr(12px);
          &:before{
            content:'';
            position: absolute;
            background:url('../../../assets/img/tuan.png');
            background-size: 100%,100%;
            @include wh( 0.373333rem,0.373333rem);
            top:0.25rem;
            left:0
          }
        }
      }
    }

  }
  .loader-more,.loader-none{ width: 100%; height:1.28rem;text-align: center;line-height: 1.28rem}
</style>
<!-- <div class="discover-list" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="20">
  <section :class="{nonewrap:teamArrflag[index]}"v-for="(item,index) in teamArr" :key="index">
    <div class="title" @click="routerpushPart(teamhead[index][2])">{{teamhead[index][1]}}</div>
    <div class="star">评分：{{teamhead[index][0]}}</div>
    <div class="box">
      <div class="item" v-for="value in item"  @click="routerpush(value.TeamId)">
        <div class="img"><img v-lazy="value.Img" /></div>
        <div class="cont">
          <div class="cont-title cont-item ellipsis">{{value.Title}}</div>
          <div class="cont-money cont-item ellipsis">$<span>{{value.Mprice}}</span><span class="before">{{value.Price}}</span></div>
          <div class="cont-sold cont-item ellipsis">已售<span>{{value.Num}}</span></div>
          <div class="cont-star cont-item">
            <span class="star-pic">
              <i :style="'width:' + value.Star*20 + '%'"></i>
            </span>
          </div>
        </div>
      </div>
      <div class="tip" @click="removewrap(index)">其他<span>{{item.length-2}}</span>个团购<i class="iconfont icon-xiala"></i></div>
    </div>
  </section>
  <footer class="loader-more" v-show="!loadernone">正在加载更多商家...</footer>
  <footer class="loader-none" v-show="loadernone">没有了...</footer>
</div> -->
<!--  .discover-list{
    position: absolute;
    top:2.4rem;
    width:100%;
    height:auto;
    z-index: 0;
    padding-bottom: 1.28rem;
    section{
      background:#fff;
      margin-bottom: 0.373333rem;
      padding:0 0.2rem;
      position: relative;
      overflow:hidden;
      transition: all .2s ease-in-out;
      .tip{
        display:none;
      }
      &.nonewrap{
        height:7.573337rem;
        .tip{
          display:block;
          position: absolute;
          top:6.773337rem;
          @include wh(100%,0.8rem);
          background:#fff;
          line-height: 0.8rem;text-align: center;
          i{@include font-dpr(10px);margin-left: 0.066667rem;}
        }
      }
      .title{
        @include font-dpr(13px);
        line-height: 0.666667rem;
      }
      .star{
        line-height: 0.506667rem;
        @include font-dpr(12px);
      }
      .item{
        height:2.8rem;
        line-height: 2.8rem;
        display:flex;
        padding:0.293333rem 0;
        .img{
          @include wh(3.12rem,2.213333rem);
          margin-right: 0.426667rem;
          img{@include wh(3.12rem,2.213333rem);}
        }
        .cont{
          height:2.186667rem;
          .cont-item{line-height: 0.6rem;}
          .cont-title{@include font-dpr(12px);}
          .cont-money{
            color:$ic;@include font-dpr(12px);
            span:first-child{color:$ic;margin-right: 0.133333rem}
            .before{color:#666;@include font-dpr(10px);text-decoration: line-through;}
          }
          .cont-how{@include font-dpr(11px);}
          .cont-star{
            @include wh(2.173333rem, 0.346667rem);
            .star-pic{
              @include wh(2.173333rem, 0.346667rem);
              background: url('../../assets/img/star0.png') no-repeat;
              background-size: 100% 100%;
              display: inline-block;
              vertical-align: top;
              i{
                background: url('../../assets/img/star.png')no-repeat;
                display: inline-block;
                height: 0.346667rem;
                overflow: hidden;
                background-size: auto 100%;
                vertical-align: top;
              }
            }
          }
        }
      }

    }
  } -->
