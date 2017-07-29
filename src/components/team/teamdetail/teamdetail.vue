<template>
  <div class="wrap">
    <headTop :noneHome="noneHome" :headTitle="titleName"></headTop>
    <div class="box" >
      <div class="head">
        <div class="item" :class="{active:active==index}" @click="select(index)" v-for="(value,index) in cont">{{value}}</div>
      </div>
      <div v-html="teamCont" class="htmlbox" v-if="active==0"></div>
      <div v-html="partnerCont" class="htmlbox" v-if="active==1"></div>
    </div>
  </div>
</template>

<script>
import headTop from '@/components/commen/header/head'
import {getOneTeamCont,WebView} from '@/service/getData'
export default {
  name: 'teamdetail',
  data () {
    return {
      titleName:'图文详情',
      noneHome:true,
      cont:['订单详情','商家介绍'],
      TeamId:null,
      teamCont:'',
      active:0,
      partnerCont:'',
      PartnerId:''
    }
  },
  created(){
    document.body.setAttribute("class","hid");
  },
  destroyed(){
    if(this.$route.path == "/team"){
      document.body.removeAttribute("class","hid");
    }
  },
  beforeMount(){
    this.TeamId = this.$route.query.id;
    this.PartnerId = this.$route.query.pid;
  },
  mounted(){
    WebView('Team',this.TeamId).then((response)=>{
      this.teamCont = response.data
    });
    WebView('Partner',this.PartnerId).then((response)=>{
      this.partnerCont = response.data
    });
  },
  methods:{
    select(index){
      this.active = index
    }
  },
  components:{headTop}
}
</script>
<style scoped lang="scss">
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
  .box{
    padding-top: 1.093333rem;
    width:100%;
    height:100%;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    .head{
      display:flex;
      background:#eee;
      .item{
        width:50%;
        text-align: center;
        line-height: 1.066667rem;
        border-bottom: 1px solid #ddd;
        position:relative;
        @include font-dpr(14px)
      }
      .active{
        &:before{
          position:absolute;
          width:50%;
          height:1px;
          content: '';
          background:$ic;
          bottom:0;
          left:25%
        }
      }
    }
    .htmlbox{
    }
  }
}
</style>
