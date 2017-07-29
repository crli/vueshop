 <template>
    <div>
      <p class="nopay" v-if="orderby=='nopay'" @click="nopayclickto">付款</p>
      <div v-if="orderby=='nouse'" class="nouse">
        <p class="again" @click="againclickto()">再来一单</p>
        <p class="back" @click="seeclickto()">查看券码</p>
      </div>
      <div v-if="orderby=='nocomment'" class="nouse">
        <p class="again" @click="againclickto()">再来一单</p>
        <p class="back" @click="commentclickto()">评价</p>
      </div>
      <div v-if="orderby=='refunded'" class="nouse">
        <p class="back" @click="againclickto()">再来一单</p>
      </div>
      <div v-if="orderby=='expire'" class="expire">
        <span class="text">您的订单在指定日期内未消费，已过期</span>
        <p class="back" @click="backclickto()">申请退款</p>
      </div>
      <div v-if="orderby=='askrefund'" class="expire">
        <span class="text">三到五个工作日到账</span>
        <p class="back">正在退款</p>
      </div>
    </div>
</template>

<script>
    export default {
      name:'orderby',
      data(){
        return{
          itembox:this.items
        }
      },
      mounted(){

      },
      props: {
        orderby: {
            type: String,
            default: ''
        },
        items:{
          type: Object,
          default: {}
        }
      },
      methods: {
          nopayclickto(){
            this.$emit('nopayclick',this.itembox)
          },
          againclickto(){
            this.$emit('againclick',this.itembox)
          },
          backclickto(){
            this.$emit('backclick',this.itembox)
          },
          commentclickto(){
            this.$emit('commentclick',this.itembox)
          },
          seeclickto(){
            this.$emit('seeclick',this.itembox)
          }
      }
    }
</script>

<style lang="scss" scoped>
  @import '../../../style/mixin';
  .nopay{
    @include wh(2.0rem,0.72rem)
    text-align: center;
    line-height: 0.72rem;
    background:$ic;
    color:#fff;
    float: right;
    @include font-dpr(12px);
  }
  .nouse{
    display:flex;
    flex-direction:row;
    justify-content: flex-end ;
    .back,.again{
      @include wh(2.0rem,0.72rem)
      text-align: center;
      line-height: 0.72rem;@include font-dpr(12px);
    }
    .back{
      background:$ic;
      color:#fff;

    }
    .again{
      border:1px solid $ic;
      color:$ic;
      box-sizing:border-box;
      margin-right: 0.666667rem;
    }
  }
  .expire{
    display:flex;
    justify-content:space-between;
    align-items:center;
    .back{
      @include wh(2.0rem,0.72rem)
      text-align: center;
      line-height: 0.72rem;
      background:$ic;
      color:#fff;@include font-dpr(12px);
    }
    .text{
      position: relative;
      padding-left: 0.266667rem;
      @include wh(7.0rem,0.72rem)
      line-height: 0.72rem;@include font-dpr(12px);
      &:before{
        position:absolute;
        content:'*';
        top:0;
        left:0;
        color:red
      }
    }
  }
</style>
