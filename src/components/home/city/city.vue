<template>
  <section class="city">
    <headTop noneHome=true headTitle="选择城市">
    </headTop>
    <div class="city-box">
      <section v-for="item in citydata" class="item" @click="selectto(item.id)">
        <img :src="item.img"/>
        <div class="cont">
          <h3>{{item.name}}</h3>
          <h4>{{item.yname}}</h4>
        </div>
      </section>
    </div>
    <tip v-if="showAlert" @closeTip="close" :tipmsg="tip"></tip>
  </section>
</template>

<script>

import headTop from '@/components/commen/header/head'
import ny from '@/assets/img/ny.jpg'
import los from '@/assets/img/los.jpg'
import wq from '@/assets/img/wq.jpg'
import tip from '@/components/commen/tip/tip'
export default {
  name: 'city',
  data () {
    return {
      citydata:[
        {'name':'洛杉矶',"yname":"Los Angeles","img":los,id:1},
        {'name':'湾区',"yname":"Silicon Valley","img":wq,id:2},
        {'name':'纽约',"yname":"New York","img":ny,id:3}
      ],
      tip:"",
      showAlert:false,
    }
  },
  created(){
    document.body.setAttribute("class","hid");
  },
  destroyed(){
    document.body.removeAttribute("class","hid");
  },
  methods:{
    selectto(id){
      if(id==1){
        this.$router.push("/home")
      }else{
        this.tip = "暂时未开放";
        this.showAlert = true;
      }
    },
    close(){
      this.showAlert = false
    }
  },
  components:{headTop,tip}
}
</script>

<style scoped lang="scss">
  @import '../../../style/mixin';
  .head{z-index: 0!important}
  .city{
    position: fixed;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    z-index: 0;
    background:#fff;
    overflow: auto;-webkit-overflow-scrolling: touch;
    .city-box{
      width:100%;
      height:100%;
      padding-top:1.093333rem;overflow: auto;-webkit-overflow-scrolling: touch;
    }
    .item{
      @include wh(100%,6.0rem);
      position:relative;
      img{@include wh(100%,100%);}
      .cont{
        position:absolute;
        @include center;
        text-align: center;
        h3,h4{
          color:#fff;
        }
        h3{
          @include font-dpr(20px)
        }
        h4{
          @include font-dpr(16px)
        }
      }
    }
  }
</style>
