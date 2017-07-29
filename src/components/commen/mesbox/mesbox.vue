 <template>
    <div class="mesbox">
      <div class="box">
        <section class="mes-container">
          <p class="mes-text" v-if="mesText">{{mesText}}</p>
<!--           <p class="mes-del"@click="select" v-if="defaultselect">选择默认</p> -->
          <p class="mes-del"@click="delmsg" v-if="del">删除</p>
          <p class="mes-revise"@click="revisemsg" v-if="revise">修改</p>
        </section>
        <section class="cancel" @click="close">取消</section>
      </div>
    </div>
</template>

<script>
    export default {
      name:'mesbox',
      data(){
        return{

        }
      },
      mounted(){

      },
      props: {
        del: {
            type: Boolean,
            default: true
        },
        revise: {
            type: Boolean,
            default: true
        },
        mesText: {
            type: String,
            default: ''
        },
        // defaultselect: {
        //     type: Boolean,
        //     default: false
        // }
      },
      methods: {
          close(){
            this.$emit('close')
          },
          delmsg(){
            this.$emit('del')
          },
          revisemsg(){
            this.$emit('revise')
          },
          // select(){
          //   this.$emit('defaultMsgSelect')
          // }
      }
    }
</script>

<style lang="scss" scoped>
  @import '../../../style/mixin';
    .mesbox{
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 200;
      background:rgba(0,0,0,.2);
      .box{position: absolute;bottom:0.266667rem;width:100%}
      .mes-container,.cancel{
        background:#fff;
        margin:0 0.266667rem;
        @include borderRadius(0.013333rem,#eee,0.25rem)
      }
      .mes-container{
        p{text-align: center;@include font-dpr(14px);}
        .mes-text{
          line-height: 0.8rem;
          border-bottom: 0.013333rem solid #eee;
          @include font-dpr(12px)
        }
        .mes-del{
          line-height: 1.333333rem;
          border-bottom:1px solid #eee;
          color:red
        }
        .mes-revise{
          line-height: 1.333333rem;
          color:#04f
        }
      }
      .cancel{
        line-height: 1.333333rem;text-align: center;@include font-dpr(14px);color:#07f;font-weight: bold;
        margin-top: 0.266667rem
      }
    }

</style>
