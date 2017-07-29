 <template>
    <div class="message">
      <div class="box">
        <div class="text">{{message}}</div>
        <section class="container">
          <p class="del" @click="dels">{{delmessage}}</p>
          <p class="cancel" @click="closes">{{cancelmessage}}</p>
        </section>
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
      mounted(){

      },
      props: {
        message: {
            type: String,
            default: '确认删除此订单？'
        },
        delmessage: {
            type: String,
            default: '删除'
        },
        cancelmessage: {
            type: String,
            default: '取消'
        }
      },
      methods: {
          closes(){
            this.$emit('close')
          },
          dels(){
            this.$emit('del')
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
        @include wh(7.8rem,4.5rem);
        background:#fff;@include borderRadius(0.013333rem,#eee,0.25rem)
      }
      .text{
        text-align: center;
        padding:0.72rem 0;
        border-bottom: 1px solid #eee;
      }
      .cancel,.del{
        @include borderRadius(0.013333rem,#eee,0.25rem)
      }
      .container{
        display:flex;
        justify-content:space-around;
        margin-top: 0.74rem;
        p{
          text-align: center;
          @include font-dpr(14px);
          @include wh(2.933333rem,1.066667rem);
          line-height: 1.066667rem;
        }
        .del{color:#666;    border: 1px solid #eee;
    background: #f1f1f1;}
        .cancel{color:#fff;background:$ic}
      }
    }

</style>
