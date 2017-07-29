 <template>
    <div class="message" >
      <div class="box">
        <div class="text">
          <h3 :style="{color:color}">温馨提示</h3>
          <p :style="{color:color}">{{tipmsg}}</p>
        </div>
        <p class="sure" @click="close">确定</p>
      </div>

    </div>
</template>

<script>
    export default {
      name:'message',
      data(){
        return{

        }
      },
      props:{
        tipmsg:{
          type:String,
          default:''
        },
        color:{
          type:String,
          default:''
        }
      },
      mounted(){

      },
      methods: {
        close(){
          this.$emit('closeTip')
        }
      }
    }
</script>

<style lang="scss" scoped>
  @import '../../../style/mixin';
    .message{
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 200;
      background:rgba(0,0,0,.2);
      .box{
        @include center;
        @include wh(6.4rem,auto);
        background:#fff;@include borderRadius(0.013333rem,#eee,0.25rem);
        box-shadow: 1px 1px 10px #aaa;
      }
      .text{
        text-align: center;
        padding:0.506667rem 0.266667rem;
        p{
          line-height: 0.506667rem;
          @include font-dpr(12px);
        }
      }
      .sure{
        @include wh(100%,.8rem);
        line-height: .8rem;
        text-align: center;
        color:#0061ff;
        @include font-dpr(13px);
        border-top:1px solid #eee
      }
    }

</style>
