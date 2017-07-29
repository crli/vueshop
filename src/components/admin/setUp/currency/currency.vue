<template>
  <div class="wrap">
    <headTop :noneHome="noneHome" :headTitle="titleName"></headTop>
    <div class="box">
      <div class="item" v-for="(value,index) in itembox"@click="select(index)">
        <span>{{value.name}}</span><i class="iconfont icon-xuanzhong" :class="value.active?'active':''" ></i>
      </div>
    </div>
  </div>
</template>

<script>
import headTop from '@/components/commen/header/head'
import {getStore,setStore} from '@/config/mUtils'
export default {
  name: 'personalData',
  data () {
    return {
      titleName:'币种',
      noneHome:true,
      itembox:[
        {
          'name':"美元",
          'active':true
        },
        {
          'name':"人民币",
          'active':false
        }
      ]
    }
  },
  created(){
    if(!getStore("DOLLORFLAG")){
      setStore("DOLLORFLAG","d");
    }else{
      let flag = getStore("DOLLORFLAG");
      if(flag=='d'){
        this.$set(this.itembox,0,{'name':"美元",'active':true})
        this.$set(this.itembox,1,{'name':"人民币",'active':false})
      }else{
        this.$set(this.itembox,0,{'name':"美元",'active':false})
        this.$set(this.itembox,1,{'name':"人民币",'active':true})
      }
    }
  },
  methods: {
    select(index){
      if(index==0){
        this.$set(this.itembox,0,{'name':"美元",'active':true})
        this.$set(this.itembox,1,{'name':"人民币",'active':false})
        setStore("DOLLORFLAG","d");
      }else{
        this.$set(this.itembox,0,{'name':"美元",'active':false})
        this.$set(this.itembox,1,{'name':"人民币",'active':true})
        setStore("DOLLORFLAG","c");
      }
    }
  },
  components:{headTop}
}
</script>
<style scoped lang="scss">
@import '../../../../style/mixin';
.wrap{
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  z-index: 103;
  background:#fff;
  overflow: auto;
  .box{
    width:100%;
    height:100%;
    padding-top:1.093333rem;
  }
  .item{
    line-height: 1.333333rem;
    display:flex;
    justify-content:space-between;
    border-bottom: 1px solid #eee;
    align-items:center;
    padding:0 0.266667rem;
    @include font-dpr(14px)
    i{color:#999}
    i.active{color:$fcolor}
  }
}
</style>
