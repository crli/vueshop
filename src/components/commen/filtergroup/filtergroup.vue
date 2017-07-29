<template>
  <div class="filter-item">
    <div class="item-title">{{aData.Title}}</div>
    <div class="item-box">
      <div class="item" v-for="(v,index) in aData.Cont" :class="{active:active == index}" @click="activechange(index)">
        <input type="radio" :name="aData.Title" :value="v.Val" :id="v.Val+time" v-model="dataMode"/>
        <label :for="v.Val+time">{{v.Title}}</label>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name:'filter-model',
    data(){
      return{
        dataMode:'',
        active:0
      }
    },
    mounted(){

    },
    props: {
      aData: {
          type: Object,
          default: {}
      },
      time:{
        type:Number,
        default:''
      },

    },
    methods: {

      activechange(index){
        this.active = index;
      }
    },
    watch:{
      aData:function (value){
        if(value){
          this.dataMode = '';
          this.active = 0;
        }
      }
    }
  }
</script>
<style scoped lang="scss">
@import '../../../style/mixin';
  .filter-item{
    .item-title{
      height:1rem;line-height: 1rem;
      @include font-dpr(13px)
    }
    .item-box{
      display:flex;
      flex-wrap:wrap;
      .item{
        width:25%;
        height:0.586667rem;
        line-height: 0.586667rem;
        background:transparent;
        box-sizing:border-box;
        text-align: center;
        margin-bottom: 0.2rem;
        border-radius: 0.106667rem;
        font-size: 0;
        input{display:none};
        label{
          display:inline-block;
          width:100%;
          @include font-dpr(13px)
        }
        &.active{
          border:1px solid $ic;
          background:#fff;
          color:$ic;
        }
      }
    }
  }
</style>
