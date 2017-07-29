<template>
  <section class="likebox" v-if="forbox[0].value.length">
    <div class="section" v-for="value in forbox">
      <div class="title">{{value.title}}</div>
      <div class="box">
        <div class="item" v-for="item in value.value" @click="teamto(item.TeamId)">
          <img :src="item.Image" alt="" />
          <div class="cont">
            <p class="name">{{item.Partner}}</p>
            <p class="text">{{item.Title}}</p>
            <div class="money"><span class="left">{{dollorflag}}<b>{{changedollor(item.Price)}}</b></span><span class="right">{{dollorflag}}{{changedollor(item.Mprice)}}</span></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import {getYouLike} from '@/service/getData'
export default {
  name: 'likebox',
  data () {
    return {
      forbox:[
      {
        value:'',
        title:'为你推荐'
      },
      {
        value:'',
        title:'更多商家'
      }
      ],
      dollorflag:"$"

    }
  },
  created(){
    this.dollorflag = this.changedollorflag()
  },
  mounted(){
    this.$ajax.all([
      getYouLike(1),
      getYouLike(2)
      ]).then(this.$ajax.spread((res1, res2)=> {
        this.forbox[0].value = res1.data;
        this.forbox[1].value = res2.data;
    }));
  },
  methods:{
    teamto(id){
      document.body.scrollTop = 0;
      this.$router.push('/team?id=' + id)
    }
  }
}
</script>

<style scoped lang="scss">
  @import '../../../style/mixin';
  .section{
    &:last-child{
      padding-bottom: 1.28rem
    }
    .title{
      line-height: 0.933333rem;padding:0 0.266667rem;@include font-dpr(14px);background:#fff;margin-top: 0.373333rem;border-bottom: 1px solid #eee;
    }
    .box{
      padding:0.266667rem 0;
      display:flex;
      flex-flow:wrap;
      background:#fff;

      .item{
        width:4.6rem;
        margin:0 0 0.4rem 0.266667rem;
        box-sizing:border-box;
        border:1px solid #eee;
        display:flex;flex-direction:column;
        img{
          width:100%;
          height:2.8rem;
        }
        .cont{

          padding-left: 0.133333rem;
          display:flex;
          flex-direction:column;
          justify-content:space-between;
          p{
            line-height: 0.5rem;
          }
        }
        .name{
          @include font-dpr(12px);
          font-weight: bold;

          @include ellipsis(1)
        }
        .text{
          @include font-dpr(11px);
          color:#666;
          @include ellipsis(2);
        }

        .left, b{
          color:$ic;@include font-dpr(14px);
        }
        .right{
          color:#666;@include font-dpr(10px);margin-left: 0.15rem;
        }
      }
    }
  }

</style>
