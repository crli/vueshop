<template>
  <section class="news">
    <headTop :noneHome="noneHome" :headTitle="titleName">
    </headTop>
    <div class="box">
      <section v-html="Web"></section>
    </div>
  </section>
</template>

<script>

import headTop from '@/components/commen/header/head'
import {WebView} from '@/service/getData'
import {getCookie} from '@/config/mUtils'
export default {
  name: 'news',
  data () {
    return {
      titleName:'由我新闻',
      noneHome:true,
      id:'',
      Web:""
    }
  },
  mounted(){
    this.id = this.$route.query.id;
    this.init();
  },
  methods:{
    init(){
      WebView("News",this.id).then((response)=>{
        this.Web = response.data
      })
    }
  },
  components:{headTop}
}
</script>

<style scoped lang="scss">
  @import '../../style/mixin';
  .box{padding-top: 1.093333rem}


</style>
