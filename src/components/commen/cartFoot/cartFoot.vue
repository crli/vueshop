 <template>
    <div class="cartfoot">
      <div class="box">
        <div class="item"@click="tocollect">
          <i class="iconfont icon-xin-1":class="FavState"></i>
          <p>收藏</p>
        </div>
        <div class="item" @click="tocart">
          <i class="iconfont icon-gouwu"></i>
          <p>购物车</p>
          <span v-if="buynum">{{buynum}}</span>
        </div>
      </div>
      <div class="otheradd" @click="addCart">加入购物车</div>
      <div class="otherbuy" @click="rightCart">立即购买</div>
    </div>
</template>

<script>
    export default {
      name:'cartfoot',
      data(){
        return{

        }
      },
      mounted(){

      },
      props: {
        buynum: {
            type: String,
            default: ''
        },
        FavState:{
          type: String,
          default: ''
        }

      },
      methods: {
          addCart(){
            this.$emit('addCart')
          },
          tocart(){
            this.$router.push("/cart")
          },
          tocollect(){
            this.$emit('tocollect')
          },
          rightCart(){
            this.$emit('rightCart')
          }
      }
    }
</script>

<style lang="scss" scoped>
  @import '../../../style/mixin';
    .cartfoot{
      position: fixed;
      bottom: 0;
      z-index: 0;
      background:rgba(255,255,255,.9);
      display:flex;
      @include wh(100%,1.093333rem);
      border-top: 1px solid $ic;
      .box{
        display:flex;
        flex-grow:1;
        .item{
          flex-grow:1;text-align: center;
          position:relative;
          line-height: .54rem;
          i{
            @include font-dpr(18px);
            &.Y{
              color:$ic
            }
          }
          p{@include font-dpr(10px);}
          span{
            position:absolute;
            display:block;
            border-radius: .15rem;
            @include wh(auto,.3rem);
            min-width: .4rem;
            @include font-dpr(10px);;
            text-align: center;
            background:red;
            color:#fff;
            top:0.05rem;
            right:0.35rem;
            line-height: .3rem;
          }
        }
      }
      .otherbuy,.otheradd{
        flex-grow:1;
        line-height: 1.093333rem;
        text-align: center;
        @include font-dpr(14px);
        color:#fff
      }
      .otherbuy{
        background:#f45;
      }
      .otheradd{
        background:$ic
      }
    }

</style>
