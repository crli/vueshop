<template>
  <div class="wrap">
    <headTop :noneHome="noneHome" :headTitle="titleName"></headTop>
    <div class="box" >
      <div v-html="teamCont" class="htmlbox"></div>
    </div>
  </div>
</template>

<script>
import headTop from '@/components/commen/header/head'
import {WebView} from '@/service/getData'
export default {
  name: 'strategydetail',
  data () {
    return {
      titleName:'实用攻略',
      noneHome:true,
      TeamId:null,
      teamCont:null
    }
  },
  created(){
    document.body.setAttribute("class","hid");
  },
  destroyed(){
    if(this.$route.path == "/strategy"){
      document.body.removeAttribute("class","hid");
    }
  },
  beforeMount(){
    this.TeamId = this.$route.query.id;
  },
  mounted(){
    WebView('News',this.TeamId).then((response)=>{
      this.teamCont = response.data
    });
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
  }
}
</style>
