<template>
  <div class="star-box">
    <div :class="[key=='Star1'?'star':'star-m']" v-for="(item,key,index) in datas" >
      <div class="nm">{{item.title}}</div>
      <span class="star-pic">
        <i class="i" :style="'width:' + item.value*20 + '%'"></i>
        <span class="star-select">
          <i class="hand" v-for="n in 5" @click="select(n,key,index,item.msg)"></i>
        </span>
      </span>
      <span class="start-msg">{{starmsg[index]}}</span>
    </div>
  </div>
</template>
<script>
  export default {
    name:'score',
    data(){
      return{
        datas:this.scoredatas,
        starmsg:new Array(Object.keys(this.scoredatas).length)
      }
    },
    mounted(){

    },
    props: {
      scoredatas: {
          type: Object,
          default(){
            return {
              'Star1':{
                'title':'总分',
                'value':null,
                'msg':['非常差','很差','一般','很好','非常好']
              },
            }
          }
      }

    },
    methods: {
      /**
       * [select 单击评分]
       * @param  {[type]} n     [1-5]
       * @param  {[type]} key   [单个评分组数据键值]
       * @param  {[type]} index [评分组索引]
       * @param  {[type]} msg   [评分组内容]
       * @return {[type]}       [description]
       */
      select(n,key,index,msg){
        this.datas[key].value = n;
        this.starmsg.splice(index, 1,msg[n-1]);
        this.$emit('toscore',[key,n])
      },
    }
  }
</script>
<style scoped lang="scss">
@import '../../../style/mixin';
  .star-box{
      background:#fff;
      padding:0.266667rem;
      margin-bottom:0.4rem;
    }
    .star{
      line-height: 0.96rem;
      display:flex;
      align-items:center;
      .nm{
        width:1.066667rem;
        @include font-dpr(15px)
      }
      .star-pic{display:inline-block;
        @include wh(3.626667rem, 0.48rem);
        background: url('../../../assets/img/xd.png') no-repeat;
        background-size: auto 100%;
        position:relative;
        .i{
          background: url('../../../assets/img/xdh.png')no-repeat;
          display: inline-block;
          height: 0.48rem;
          background-size: auto 100%;
          vertical-align: top;
        }
        .star-select{
          position:absolute;
          z-index: 10;
          top:0;
          left:0;
          display: inline-block;
          @include wh(3.626667rem, 0.48rem);
          display:flex;
          justify-content:space-between;
          .hand{
            @include wh(0.48rem, 0.48rem);
            display:block;
          }
        }
      }
      .start-msg{
        margin-left: 0.4rem;
        display:inline-block;
        @include font-dpr(14px)
      }
    }
    .star-m{
      line-height: 0.666667rem;
      display:flex;
      align-items:center;
      .nm{
        width:1.066667rem;
        @include font-dpr(13px)
      }
      .star-pic{
        @include wh(3.04rem, 0.4rem);
        background: url('../../../assets/img/xx.png') no-repeat;
        background-size: 100% 100%;
        position:relative;
        .i{
          background: url('../../../assets/img/xxh.png')no-repeat;
          display: inline-block;
          height: 0.4rem;
          overflow: hidden;
          background-size: auto 100%;
          vertical-align: top;
        }
        .star-select{
          position:absolute;
          z-index: 300;
          top:0;
          left:0;
          display: inline-block;
          @include wh(3.04rem, 0.4rem);
          display:flex;
          justify-content:space-between;
          i{
            @include wh(0.4rem,0.4rem);
          }
        }
      }
      .start-msg{
        margin-left: 0.4rem;
        @include font-dpr(12px)
      }
    }
</style>
