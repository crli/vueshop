 <template>
	<div class="container">
	    <div class="load-img" :style="{backgroundPositionY: -(positionY%4)*2 + 'rem'}">
	    </div>
      <div class="load-foot"></div>
		</svg>
	</div>
</template>

<script>

    export default {
      name: 'loading',
    	data(){
            return{
                positionY: 0,
                timer: null,
            }
        },
        mounted(){
        	this.timer = setInterval(() => {
        		this.positionY ++;
        	}, 600)
        },
        beforeDestroy(){
        	clearInterval(this.timer);
        }
    }
</script>

<style lang="scss" scoped>
  @import '../../../style/mixin';
  // .con-wrap{
  //   position: fixed;
  //   top:0;
  //   left:0;
  //   bottom:0;
  //   right:0;
  //   background:#f1f1f1
  // }
	@keyframes load{
		0%   {transform: translateY(0px);}
		50%  {transform: translateY(-50px);}
		100% {transform: translateY(0px);}
	}
	@keyframes loadfoot{
		0%   {transform: scale(1);}
		50%  {transform: scale(0.3);}
		100% {transform: scale(1);}
	}
    .container{
    	position: fixed;
    	top: 50%;
    	left: 50%;
    	transform: translate(-50%, -50%);
    	@include wh(2rem, 2rem);
      z-index: 1111111111;border:none;

    }
    .load-img{
    	@include wh(100%, 100%);
    	background: url(../../../assets/img/loading.png) no-repeat 0 0;
    	background-size: 100% auto;
      border:none;
    	transform: translateY(0px);
    	animation: load .6s infinite ease-in-out;
    	position: relative;
    	z-index: 11;
    }
	.load-foot{
		position: absolute;
		@include wh(1.2rem, .8rem);
    border-radius: 30%;
		top: 2rem;
		left: 0.4rem;
		z-index: 10;
    background:#eee;
		animation: loadfoot .6s infinite ease-in-out;
	}
</style>
