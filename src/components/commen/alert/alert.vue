 <template>
    <div class="alert">
	    <section class="tip-container">
            <div class="tip-icon" v-if="!suc">
                <i class="iconfont icon-tixingicon"></i>
            </div>
            <div class="tip-icon-suc" v-if="suc">
                <i class="iconfont icon-xuanze"></i>
            </div>
            <p class="tip-text">{{alertText}}</p>
            <div class="confrim" @click="close">确认</div>
        </section>
    </div>
</template>

<script>
    export default {
      name:'alert',
    	data(){
        return{

        }
      },
      mounted(){

      },
      props: {
        alertText: {
            type: String,
            default: ''
        },
        suc: {
            type: Boolean,
            default: false
        }
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
	@keyframes tipMove{
       0%   { transform: scale(1) }
       35%  { transform: scale(.8) }
       70%  { transform: scale(1.1) }
       100% { transform: scale(1) }
    }
    .alert{
    	position: fixed;
    	top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 200;

    }
    .tip-container{
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -3.266667rem;
        margin-left: -3.266667rem;
        width: 6rem;
        animation: tipMove .4s ;
        background-color: rgba(255,255,255,1);
        box-shadow: 0 0rem 2rem rgba(0,0,0,.5);
        border: 1px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        border-radius: 0.25rem;
        .tip-icon{
            margin:.2rem 0;
            i{@include font-dpr(50px);color:$ic}
        }
        .tip-icon-suc{
          margin:.2rem 0;
          i{@include font-dpr(50px);color:#5cb85c}
        }
        .tip-text{
            @include wh(5rem,auto);
            line-height: 0.6rem;
            text-align: center;
        }
        .confrim{
            @include wh(100%,1.2rem);
            font-weight: bold;
            margin-top: .5rem;
            background-color: $ic;
            color:#fff;
            text-align: center;
            line-height: 1.2rem;
            border: 1px;
            border-bottom-left-radius: 0.25rem;
            border-bottom-right-radius: 0.25rem;
        }
    }

</style>
