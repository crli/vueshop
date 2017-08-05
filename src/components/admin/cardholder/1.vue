<template>
  <section class="cardholder">
    <headTop noneHome=true headTitle="由我团商家储值卡">
      <div class="edit"slot="edit">用卡记录</div>
    </headTop>
    <div class="cardholder-box">
      <div class="head">
        <div class="item" :class="{active:active==index}" @click="select(index,v.type)" v-for="(v,index) in cont">{{v.title}}</div>
      </div>
      <div class="discover-list" v-infinite-scroll="loadMore" id="discover-list" infinite-scroll-disabled="busy" infinite-scroll-distance="1">
        <section class="list-item" v-for="item in cardData" style="height:530px">{{item.partner}}
        </section>
        <footer class="loader-more" v-show="!cont[active].loadernone">正在加载更多...</footer>
        <footer class="loader-none" v-show="cont[active].loadernone">已经全部加载完毕</footer>
      </div>
      <div class="tip"style="display:none">
        <img src="../../../assets/img/none.png" alt="" />
        <p>暂无卡包</p>
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
          'loadernone':false,//没有数据提示
        },
        {
          'title':'不可使用',
          'type':'nouse',
          'loadernone':false,//没有数据提示
        }
      ],
      page:1,
      cardList:{
        use:[],
        nouse:[]
      },
      type:'use',
      usePage:1,
      nousePage:1,
      cardData:[],
      usefirst:true,
      nousefirst:true
    }
  },
  created(){
    document.body.setAttribute("class","hid");
    this.init()
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
      this.cont[this.active].loadernone = false;
      let newtype = this.type;
      this.page = newtype == 'use'? this.usePage : this.nousePage;
      let response = await GetUserAllSVCard(getCookie("USERToken"),this.page,1,this.type);
      this.cardList[newtype] = [...this.cardList[newtype], ...response.data];
      this.cardData = this.cardList[newtype];
      this.type == 'use'? this.usePage++ : this.nousePage++;
      if(response.data.length){
        if (response.data.length < 1) {
          this.cont[this.active].loadernone = true;
          return
        }
      }else{
        this.cont[this.active].loadernone = true;
        return
      }
      this.busy = false;
    },
    /**
     * [init 初始化（默认可使用）]
     * @return {[type]} [description]
     */
    init(){
      this.selectflag(0,'use')
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
      this.cardData = this.cardList[type];
      this.selectflag(index,type)
    },
    // 第一次加载
    selectflag(index,type){
      if(this.cont[index].loadernone||this[type+'first'] == false){
        return false
      }
      GetUserAllSVCard(getCookie("USERToken"),this[type+'Page'],1,type).then((response)=>{
        this[type+'first'] = false;
        this.cardList[type] = [...this.cardList[type], ...response.data];
        this.cardData = this.cardList[type];
        this[type+'Page']++
        if(response.data.length){
          if (response.data.length < 1) {
            this.cont[index].loadernone = true;
            return
          }
        }else{
          this.cont[index].loadernone = true;
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
    background:#fff;
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
  .tip{
    text-align: center;
    margin-top: 2.666667rem;
    img{@include wh(7.013333rem,4.773333rem);}
    p{
      margin-top: 0.4rem;
      @include font-dpr(15px);
    }
  }
</style>
