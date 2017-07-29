<template>
  <section class="message">
    <headTop noneHome=true headTitle="消息中心">
      <div class="edit"slot="edit" @click="msgset"><i class="iconfont icon-shezhi"></i></div>
    </headTop>
    <section class="center">
      <div class="item" v-for="value in centermsg"  @click="tolist(value.Type)">
        <div class="tipbox">
          <img :src="'https://www.uworldeal.com/res/public/app/images/msg/'+value.Type+'.png'" alt="" />
          <span v-if="value.Num">{{value.Num}}</span>
        </div>
        <div class="contbox">
          <div class="title">
            <span>{{value.Title}}</span>
            <span>{{value.Time}}</span>
          </div>
          <div class="cont">{{value.Cont}}</div>
        </div>
      </div>
    </section>
    <transition name="router-slid">
      <router-view></router-view>
    </transition>
  </section>
</template>

<script>

import headTop from '@/components/commen/header/head'
import {UserMsgCenter} from "@/service/getData"
import {getCookie} from '@/config/mUtils'
export default {
  name: 'message',
  data () {
    return {
      centermsg:[]
    }
  },
  async mounted(){
    let response = await UserMsgCenter(getCookie("USERToken"));
    this.centermsg = response.data
  },
  methods:{
    msgset(){
      this.$router.push("/message/setmessage")
    },
    tolist(type){
      this.$router.push("/message/messagelist?type="+type)
    }
  },
  components:{headTop}
}
</script>

<style scoped lang="scss">
  @import '../../style/mixin';
  .head-other{z-index: 0!important}
  .edit{
    position:absolute;
    right:0.266667rem;
    z-index: 5;
  }
  .center{padding-top: 1.093333rem}
  .item{
    @include wh(100%,1.866667rem);
    background:#fff;
    margin-bottom: 2px;
    padding:0.266667rem;
    display:flex;
    align-items:center;
    .tipbox{
      margin-right: 0.4rem;
      @include wh(1.066667rem,1.066667rem);
      position:relative;
      img{
        @include wh(100%,100%);
      }
      span{
        position:absolute;
        right:0;
        top:0;
        display:block;
        @include wh(0.426667rem,0.426667rem);
        border-radius: 50%;
        text-align: center;
        line-height: 0.426667rem;
        background: #fe0145;
        color:#fff;
        border: 1px solid #fff;
        @include font-dpr(9px)
      }
    }
    .contbox{
      flex:1;
      .title{
        margin-bottom: 0.266667rem;
        display:flex;
        justify-content:space-between;
      }
    }
  }
</style>
