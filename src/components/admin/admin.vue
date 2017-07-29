<template>
  <div class="admin">
    <section class="admin-head">
      <div class="img-box">
        <img :src="headPhoto"/>
        <div class="img-other">
          <p class="name"><span>{{AccountName}}</span><i class="dj":class="'dj'+VipLevel"></i></p>
          <p class="signed"><span :class="{signedyes:yes==1}" @click="tosigned">{{signedmsg}}</span></p>
        </div>
      </div>
      <div class="admin-tip">
        <router-link to="/admin/ticket" tag="div" class="tip-item"><span>{{CouponNum}}</span><span>由我券</span></router-link>
        <router-link to="/admin/coupon" tag="div" class="tip-item"><span>0</span><span>优惠券</span></router-link>
        <router-link to="/admin/cardholder" tag="div" class="tip-item"><span>0</span><span>卡包</span></router-link>
        <div class="tip-item"><span>{{Score}}</span><span>U积分</span></div>
      </div>
    </section>
    <div class="order">
      <div class="left">我的订单</div>
      <router-link to="/order?status=0" class="right">全部订单<i class="iconfont icon-arrow-right"></i></router-link>
    </div>
    <section class="option">
      <router-link to="/order?status=1" class="option-item">
        <img src="../../assets/img/nopay.png" alt="" /><span>待付款</span>
      </router-link>
      <router-link to="/order?status=2" class="option-item">
        <img src="../../assets/img/nouse.png" alt="" /><span>待消费</span>
      </router-link>
      <router-link to="/order?status=3" class="option-item">
        <img src="../../assets/img/nocom.png" alt="" /><span>待评价</span>
      </router-link>
      <router-link to="/order?status=4" class="option-item">
        <img src="../../assets/img/tui.png" alt="" /><span>退款</span>
      </router-link>
    </section>
    <section class="item-box">
      <router-link to="/collect" class="item" tag="div">
        <div class="left"><i class="iconfont icon-shoucang"></i><span>我的收藏</span></div>
        <div class="right"><i class="iconfont icon-arrow-right"></i></div>
      </router-link>
      <router-link to="/bankCard" class="item" tag="div">
        <div class="left"><i class="iconfont icon-yinxingqia"></i><span>银行卡管理</span></div>
        <div class="right"><i class="iconfont icon-arrow-right"></i></div>
      </router-link>
      <router-link to="/address" class="item" tag="div">
        <div class="left"><i class="iconfont icon-fujin"></i><span>地址管理</span></div>
        <div class="right"><i class="iconfont icon-arrow-right"></i></div>
      </router-link>
      <router-link to="/balance" class="item" tag="div">
        <div class="left"><i class="iconfont icon-yue"></i><span>余额</span></div>
        <div class="right"><i class="iconfont icon-arrow-right"></i></div>
      </router-link>
      <router-link to="/admin/setUp" class="item" tag="div">
        <div class="left"><i class="iconfont icon-shezhi"></i><span>设置</span></div>
        <div class="right"><i class="iconfont icon-arrow-right"></i></div>
      </router-link>
      <router-link to="/admin/feedback" class="item" tag="div">
        <div class="left"><i class="iconfont icon-bangzhu"></i><span>意见反馈</span></div>
        <div class="right"><i class="iconfont icon-arrow-right"></i></div>
      </router-link>
    </section>
    <transition name="router-slid">
        <router-view></router-view>
    </transition>
    <Foot v-show="this.$route.path=='/admin'"></Foot>
  </div>
</template>

<script>
import Foot from '@/components/commen/footer/foot'
import {getCookie,setStore} from '@/config/mUtils'
import {mapState,mapMutations} from 'vuex'
import {getUser,GetUserSignDays0,GetUserSignDays1} from '@/service/getData'
import moren from '@/assets/img/toux.png'
export default {
  name: 'admin',
  data () {
    return {
      headPhoto:"",
      AccountName:"",
      VipLevel:"",
      Score:0,
      CouponNum:0,
      signedmsg:"",//签到信息
      yes:0//是否签到
    }
  },
  created(){

  },

  mounted(){
    this.init()
  },
  methods: {
      ...mapMutations([
        'RECORD_USERINFO','OUT_LOGIN'
      ]),

      init(){
        //获取用户信息
        getUser(getCookie("USERToken")).then((response)=>{
          if(response.data.Ret==1001){
            this.OUT_LOGIN();
            this.$router.push('/login')
          }else {
            this.RECORD_USERINFO(response.data);
            setStore("UWUSER",response.data)
          }

        })
        GetUserSignDays1(getCookie("USERToken")).then((response)=>{
          this.yes = response.data.Today;
          if(this.yes==1){
            this.signedmsg = "已签到"
          }else{
            this.signedmsg = "签到"
          }
        })
      },
      tosigned(){
        if(this.yes==1){
          return false
        }else{
          GetUserSignDays0(getCookie("USERToken")).then((response)=>{
            this.yes = 1;
            this.signedmsg = "已签到";
            this.Score = String(Number(this.Score)+Number(response.data.Score))
          })
        }
      }
  },

  computed:{
    ...mapState([
      'userInfo'
    ]),
  },
  components:{Foot},
  watch: {
      userInfo: function (value) {
        if(value){
          this.headPhoto = value.headPhoto||moren;
          this.AccountName = value.AccountName;
          this.VipLevel = value.VipLevel;
          this.Score = value.Score;
          this.CouponNum = value.CouponNum;
        }
      },
      '$route' (to, from) {
        if(from.path == '/admin/ticket'){
          this.init()
        }
      },
  }
}
</script>

<style scoped lang="scss">
@import '../../style/mixin';
@mixin djimg{background:url(../../assets/img/djimg.png) no-repeat; }
@mixin djbox{
  @for $i from 0 through 8{
    .dj#{$i} {
      height:16px;width:16px;background-position: -18px * $i 0;
    }
  }
}

.admin{
  i{margin: 0 0.24rem}
  position: absolute;
  top:0;
  left:0;
  width:100%
}
.admin-head{
  @include wh(100%,5.84rem);
  position: relative;
  background:url('../../assets/img/1.png')no-repeat center center;
  background-size:100%;
  .img-box{
    @include wh(100%,1.333333rem);
    @include cl;
    top:30%;
    display:flex;
    justify-content:center;
    img{
      @include wh(1.333333rem,1.333333rem );
      border-radius: 50%;
      margin:0 0.933333rem 0 0;
      border:0.013333rem solid #fff;
    }
    .img-other{
      p{
        line-height: 0.666667rem;
        color: #fff;
        @include font-dpr(14px)
      }
      p.name{
        span{
          color: #fff;
          display:inline-block;
          vertical-align: middle;
          max-width: 4rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .dj{
          vertical-align: middle;
          display:inline-block;
          @include djimg;
          margin:0;
        }
        @include djbox;
      }
      p.signed{
        span{
          display:block;
          @include wh(1.2rem,0.506667rem);
          line-height: 0.506667rem;
          box-sizing:border-box;
          text-align: center;
          border:1px solid #fff;
          border-radius: 0.133333rem;
          background:#50b9e0;
          color:#fff;
          @include font-dpr(10px);
          &.signedyes{
            background:#eee;
            color:#333;
          }
        }
      }
    }
  }
  .admin-tip{
    bottom:0;
    @include wh(100%,1.6rem);
    position:absolute;
    background:rgba(0,0,0,.3);
    display:flex;
    .tip-item{
      @include wh(25%,100%);
      position:relative;
      &:after{
        position:absolute;
        content:'';
        @include wh(1px,0.826667rem);
        background:#fff;
        right:0;
        top:0.386667rem;
      }
      &:last-child:after{
        background:transparent;
      }
    }
    span{
      display:block;
      text-align: center;
      line-height: .8rem;
      color:#fff;
      @include font-dpr(13px)
    }
  }
}
.order{
  border-bottom: 0.013333rem solid #eee;
  @include wh(100%,1.2rem );
  line-height: 1.2rem;
  display:flex;
  justify-content:space-between;
  background:#fff;
  @include font-dpr(16px)
  padding-left: 0.266667rem;
  i{@include font-dpr(15px);}
}
.option{
  background-color: #fff;
  @include wh(100%, 2.24rem);
  line-height: 1.12rem;
  display: flex;
  margin-bottom: 0.4rem;
  .option-item{
    flex: 1;
    display: flex;
    text-align: center;
    flex-direction: column;
    align-items: center;
    img{@include wh(0.72rem,0.72rem);margin-top: .4rem}
    span{
      display:block;
      @include font-dpr(14px)
    }
  }
}
.item-box{
  background:#fff;
  .item{
    border-bottom: 0.013333rem solid #eee;
    @include wh(100%,1.2rem );
    line-height: 1.2rem;
    display:flex;
    justify-content:space-between;
    span{
      @include font-dpr(16px)
    }
    i{@include font-dpr(18px);}
    .right{
      i{@include font-dpr(15px);}
    }
  }
}

</style>
