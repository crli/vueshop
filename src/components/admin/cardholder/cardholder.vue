<template>
  <section class="cardholder">
    <headTop noneHome=true headTitle="由我团商家储值卡">
      <div class="edit"slot="edit">用卡记录</div>
    </headTop>
    <div class="cardholder-box">
      <div class="head">
        <div class="item" :class="{active:active==index}" @click="select(index,v.type)" v-for="(v,index) in cont">{{v.title}}</div>
      </div>
      <div class="discover-list" v-infinite-scroll="loadMore" id="discover-list" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
        <section class="list-item" v-for="item in cardData">
          <router-link to="" tag="div" class="top">
            <div class="left">
              <img :src="item.img" alt="" /><span>{{item.title}}</span>
            </div>
            <div class="right">
              <span>{{item.quantity}}张</span><i class="iconfont icon-arrow-right"></i>
            </div>
          </router-link>
          <div class="bottom">
            <div class="bottom-item"><span>余额</span><span>${{item.balance}}</span></div>
            <div class="bottom-item"><span>过期时间</span><span>{{item.expiretime}}</span></div>
            <div class="bottom-item"><router-link to="">去使用</router-link></div>
          </div>
        </section>
        <footer class="loader-more" v-show="!this.loadernone">正在加载更多...</footer>
        <footer class="loader-none" v-show="this.loadernone">已经全部加载完毕</footer>
      </div>
      <div class="footer-buy">
        <router-link to="" tag="div" class="tobuy">购买储值卡</router-link>
      </div>
    </div>
  </section>
</template>

<script>

import headTop from '@/components/commen/header/head'
import {GetUserAllSVCard} from '@/service/getData'
import infiniteScroll from 'vue-infinite-scroll'
import {getCookie} from '@/config/mUtils'
export default {
  name: 'cardholder',
  data () {
    return {
      busy: true,
      active:0,
      cont:[
        {
          'title':'可使用',
          'type':'use',
        },
        {
          'title':'不可使用',
          'type':'nouse',
        }
      ],
      page:1,
      type:'use',
      cardData:[],
      loadernone:false,
    }
  },
  created(){
    document.body.setAttribute("class","hid");
  },

  mounted(){
    this.selectflag(0,'use')
  },
  destroyed(){
    document.body.removeAttribute("class","hid");
  },
  directives: {infiniteScroll},
  methods:{
    /**
     * [loadMore 无限加载]
     * @return {[type]} [description]
     */
    async loadMore() {
      //防止重复请求
      this.busy = true;
      this.loadernone = false;
      let response = await GetUserAllSVCard(getCookie("USERToken"),this.page,10,this.type);
      this.cardData = [...this.cardData, ...response.data];
      this.page++;
      if(response.data.length){
        if (response.data.length < 10) {
          this.loadernone = true;
          return
        }
      }else{
        this.loadernone = true;
        return
      }
      this.busy = false;
    },
    /**
     * [init 初始化]
     * @return {[type]} [description]
     */
    init(){
      this.page = 1;
      this.cardData = [];
    },
    /**
     * [tagto 横向切换导航栏]
     * @param  {[type]} index [横向索引]
     * @param  {[type]} type    [横向值]
     * @return {[type]}       [description]
     */

    select(index,type){
      this.type = type;
      this.active = index;
      this.init()
      this.selectflag(index,type)
    },
    selectflag(index,type){
      GetUserAllSVCard(getCookie("USERToken"),this.page,10,type).then((response)=>{
        this.cardData = [...this.cardData, ...response.data];
        this.page++;
        if(response.data.length){
          if (response.data.length < 10) {
            this.loadernone = true;
            return
          }
        }else{
          this.loadernone = true;
          return
        }
        this.busy = false;
      })
    }
  },

  components:{headTop}
}
</script>

<style scoped lang="scss">
  @import '../../../style/mixin';
  .edit{
    position: absolute;
    right:0.24rem;
    @include font-dpr(14px);
    color:#333;
    z-index:200
  }
  .cardholder{
    position: fixed;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    z-index: 0;
    background:#eee;
    overflow: auto;
    .cardholder-box{
      width:100%;
      height:100%;
      padding-top:1.093333rem;
    }
    .head{
      display:flex;
      background:#fff;
      .item{
        width:50%;
        text-align: center;
        line-height: 1.44rem;
        border-bottom: 1px solid #ddd;
        position:relative;
        @include font-dpr(14px)
      }
      .active{
        &:before{
          position:absolute;
          width:50%;
          height:0.08rem;
          content: '';
          background:$fcolor;
          bottom:0;
          left:25%
        }
      }
    }
  }
  .list-item{
    margin-top: 0.4rem;
    padding:0 0.4rem;
    background:#fff;
    .top{
      height:2.026667rem;
      width:100%;
      display:flex;
      justify-content: space-between;
      align-items:center;
      img{
        @include wh(1.253333rem,1.253333rem);
        border-radius: 50%;
        margin-right: 0.4rem;
        vertical-align: middle
      }
      .left,.right{
        span{color:#999;@include font-dpr(16px);}
        i{@include font-dpr(14px);margin-left: 0.133333rem}
      }
    }
    .bottom{
      display:flex;
      justify-content: space-between;
      align-items:center;
      border-top: 1px solid #eee;
      height:1.626667rem;
    }
    .bottom-item{
      flex:1;
      text-align: center;
      @include font-dpr(15px);
    }

    .bottom-item span{
      display:block;
      line-height: 0.666667rem;

      &:first-child{
        color:#999;
        @include font-dpr(14px);
      }
    }
  }
  .footer-buy{
    background:#fff;
    @include wh(100%,1.6rem);
    padding:0.213333rem 0.533333rem;
    text-align: center;
    position:fixed;
    bottom:0;
    .tobuy{
      background:#ffcc00;
      height:1.146667rem;
      line-height: 1.146667rem;
      @include font-dpr(16px);
    }
  }
</style>
