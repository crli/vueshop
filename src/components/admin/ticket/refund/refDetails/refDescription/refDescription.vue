<template>
  <div class="refDescription">
    <headTop :noneHome="noneHome" :headTitle="titleName"></headTop>
    <div class="box">
      <div class="item" v-for="(value,index) in list">
        <div class="title">{{index+1}}：{{value.Title}}</div>
        <div class="msg" v-html="value.Cont">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import headTop from '@/components/commen/header/head'
import {GetNewsList} from '@/service/getData'
import {getCookie} from '@/config/mUtils'
export default {
  name: 'refDescription',
  data () {
    return {
      titleName:'退款说明',
      noneHome:true,
      list:[]
    }
  },
  methods:{

  },
  created(){
    document.body.setAttribute("class","hid");
  },
  mounted(){
    GetNewsList(getCookie("USERToken"),750,'100','1','','1').then((response)=>{
      this.list = response.data
    })
  },

  components:{headTop}
}
</script>
<style scoped lang="scss">
@import '../../../../../../style/mixin';
.refDescription{
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  z-index: 5100;
  background:#eee;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  .box{
    padding-top: 1.093333rem;
    width:100%;
    height:100%;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    background:#fff
  }
  .title{
    line-height: 1.066667rem;
    background:#f9f9f9;
    padding:0 0.266667rem
  }
  .msg{
    padding:0.266667rem;
    p{
      line-height: 0.693333rem;
      text-indent: 0.266667rem
    }
  }

}

</style>
