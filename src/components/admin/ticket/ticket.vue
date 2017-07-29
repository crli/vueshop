<template>
  <div class="wrap">
    <headTop :noneHome="noneHome" :headTitle="titleName"></headTop>
    <div class="box">
      <div class="head">
        <div class="item" :class="{active:active==index}" @click="select(index)" v-for="(v,index) in cont">{{v.title}}({{v.value}})</div>
      </div>
      <div class="showbox" v-if="active==0">
        <div class="box-item" v-for="(v,index) in tickets.NoUse">
          <div class="top">
            <!-- <div class="left" @click.prevent="showdel(v.OrderId,'OrderId','NoUse',index)"> -->
            <div class="left">
              <div class="title">{{v.Title}}</div>
              <div class="money">{{v.Currency=="Dollar"?"$":"￥"}}{{v.Money}}</div>
              <div class="time">付款时间：{{v.PayTime}}</div>
              <div class="time">有效期至{{v.ExpireTime}}</div>
            </div>
          </div>
          <div class="bottom":class="{nonewrap:arrflag[index]}">
            <div class="item-list" v-for="(value,i) in v.Coupon">
              <p>{{value.Id}}</p>
              <span @click.stop="showQrCode(value.QrCode)"><i class="iconfont icon-apperweima"></i>点击查看二维码</span>
            </div>
          </div>
          <div class="tip" v-show="arrflag[index]" @click="clicksee(index)" v-if="v.Coupon.length>2"><span>查看剩余<b>{{v.Coupon.length-2}}</b>张</span><i class="iconfont icon-xiala"></i></div>
        </div>
      </div>
      <div class="showbox" v-if="active==1">
        <div class="box-item box-item-end" v-for="(v,index) in tickets.Expire">
          <div class="top">
            <div class="left"@click.prevent="showdel(v.OrderId,'OrderId','Expire',index)">
              <div class="title">{{v.Title}}</div>
              <div class="money">{{v.Currency=="Dollar"?"$":"￥"}}{{v.Money}}</div>
              <div class="time">已过期</div>
            </div>
            <div class="right"><img src="../../../assets/img/gq.png" alt="" /></div>
          </div>
          <div class="bottom":class="{nonewrap:arrflagExpire[index]}">
            <div class="item-list" v-for="(value,i) in v.Coupon"  @click.prevent="showdel(value.Id,'couponid','NoUse',i)">
              <p>{{value.Id}}</p>
              <span @click.stop="showQrCode(value.QrCode)"><i class="iconfont icon-apperweima"></i>点击查看二维码</span>
            </div>
          </div>
          <div class="tip" v-show="arrflagExpire[index]" @click="Expireclicksee(index)" v-if="v.Coupon.length>2"><span>查看剩余<b>{{v.Coupon.length-2}}</b>张</span><i class="iconfont icon-xiala"></i></div>
        </div>
      </div>
    </div>
    <transition name="router-slid">
        <router-view></router-view>
    </transition>
    <div class="alert" v-if="alertQrCode" @click="hidqrcode">
      <div class="alert-box">
        <img :src="qrCodesrc" alt="" />
        <p>扫描二维码，确认使用本团券</p>
      </div>
    </div>
    <message v-if="showMsg"  @close="application" @del="close" message="是否申请退款" delmessage="取消" cancelmessage="申请退款"></message>
  </div>
</template>

<script>
import headTop from '@/components/commen/header/head'
import message from '@/components/commen/message/message'
import {mapMutations,mapActions,mapState} from 'vuex'
// import {getUserCouponList} from '@/service/getData'
import {getCookie} from '@/config/mUtils'
export default {
  name: 'ticket',
  data () {
    return {
      titleName:'由我券',
      noneHome:true,
      cont:[
        {
          'title':'可使用',
          'value':0
        },
        {
          'title':'已过期',
          'value':0
        }
      ],
      active:0,
      showMsg:false,//弹出
      num:null,
      txt:"",
      arrflag:[],
      alertQrCode:false,
      qrCodesrc:'',
      arrflagExpire:[],
      index:'',
      msg:''
    }
  },
  methods:{
    ...mapMutations([
      'OUT_LOGIN'
    ]),
    ...mapActions([
        'getUserCouponList'
    ]),
    select(index){
      this.active = index
    },
    close(){
      this.showMsg = false;
    },
    /**
     * [showdel 弹出退款提示框]
     * @param  {[type]} num   [券码或者订单id]
     * @param  {[type]} txt   [券码或者订单id标识]
     * @param  {[type]} msg   [可使用退款还是已过期退款，vuex用]
     * @param  {[type]} index [索引]
     * @return {[type]}       [description]
     */
    showdel(num,txt,msg,index){
      this.showMsg = true;
      this.txt = txt;
      this.num = num;
      this.index = index;
      this.msg = msg;
    },

    application(){
      this.$router.push("/admin/ticket/refund?flag="+this.msg+"&index="+this.index+"&"+this.txt+"="+this.num);
      this.close()
    },
    clicksee(index){
      this.arrflag.splice(index,1,false)
    },
    Expireclicksee(index){
      this.arrflagExpire.splice(index,1,false)
    },
    showQrCode(QrCode){
      this.alertQrCode = true;
      this.qrCodesrc = QrCode;
    },
    hidqrcode(){
      this.alertQrCode = false;
      this.qrCodesrc = '';
    }
  },
  created(){
    document.body.setAttribute("class","hid");

  },
  mounted(){
    //如果单个券获取单个，否则获取列表
    let flagtype = true;
    let orderid = this.$route.query.orderid;
    if(orderid&&flagtype){
      this.getUserCouponList(orderid)
      flagtype = false;
    }
    if(flagtype){
      this.getUserCouponList(0)
    }
  },

  computed:{
    ...mapState([
      'tickets'
    ])
  },
  watch: {

      '$route' (to, from) {
        if(from.path == '/admin/ticket/refund'){
          let id = to.query.orderid;
          if(id){
            this.getUserCouponList(id)
          }else{
            this.getUserCouponList(0)
          }
        }
      },
      //监听券
      tickets:function (value) {

        value.NoUse.forEach( (element, index)=> {
          if(element.Coupon.length>2){
            this.arrflag.push(true)
          }else{
            this.arrflag.push(false)
          }
        });
        value.Expire.forEach( (element, index)=> {
          if(element.Coupon.length>2){
            this.arrflagExpire.push(true)
          }else{
            this.arrflagExpire.push(false)
          }
        });
        this.$set(this.cont,0,{
          'title':'可使用',
          'value':value.NoUseTotal
        });
        this.$set(this.cont,1,{
          'title':'已过期',
          'value':value.ExpireTotal
        })
      }
  },
  destroyed(){
    document.body.removeAttribute("class","hid");
  },
  components:{headTop,message}
}
</script>
<style scoped lang="scss">
@import '../../../style/mixin';
.wrap{
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  z-index: 0;
  background:#eee;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  .box{
    padding-top: 1.093333rem;
    width:100%;
    height:100%;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    .head{
      display:flex;
      background:#fff;
      .item{
        width:50%;
        text-align: center;
        line-height: 1.333333rem;
        border-bottom: 1px solid #ddd;
        position:relative;
        @include font-dpr(14px)
      }
      .active{
        &:before{
          position:absolute;
          width:50%;
          height:1px;
          content: '';
          background:$ic;
          bottom:0;
          left:25%
        }
        color:$fcolor
      }
    }
    .box-item{
      .top{
        display:flex;
        padding:0.266667rem 0;
        border-bottom: 1px solid #e5e5e5;
        background:#fff;
        position: relative;
        &:before{
            content:"";
            position: absolute;
            width: 0;
            height: 0;
            border-left: 0.2rem solid transparent;
            border-right: 0.2rem solid transparent;
            border-bottom: 0.36rem solid #f2f2f2;
            bottom:0rem;
            left:1.6rem;
          }
        .left{
          width:7rem
        }
        .right{
          flex:1;
          position: relative;
          span{@include center;@include font-dpr(14px);color:$fcolor;width:80%;text-align: center;border: 1px solid #eee;
            padding:0.133333rem 0}
        }
        .title,.money,.time{
          line-height: 0.773333rem;
          padding:0 0.266667rem;
        }
        .title{
          @include font-dpr(14px)
        }
        .money{
          color:$fcolor
        }
        .money,.time{
          @include font-dpr(13px)
        }
      }
      .bottom{
        background:#f2f2f2;
        &.nonewrap{
          height:4.48rem;
          overflow:hidden
        }

        .item-list{
          padding:0.133333rem 0.266667rem 0.4rem;
          border-bottom: 1px solid #e5e5e5;

        }
        p{line-height: 0.853333rem;@include font-dpr(14px);}
        span{line-height: 0.853333rem;@include font-dpr(14px);}
        i{margin-right: 0.266667rem}
      }
      .tip{
        line-height: 1.866667rem;
        text-align: center;
        @include font-dpr(14px);
        i{@include font-dpr(13px);margin-left: 0.266667rem}
        b{color:$fcolor}
      }
    }
  }
  .alert{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 200;
    background:rgba(0,0,0,.2);
    .alert-box{
      background:#fff;
      @include center;
      @include wh(8.666667rem,6.666667rem);
      border: 1px solid #eee;
      box-shadow: 1px 1px 2px #eee;
      text-align: center;
    }
    img{margin:1.04rem auto;@include wh(3.333333rem,3.333333rem) }
    p{width:100%;text-align: center;@include font-dpr(14px);}
  }
  .box-item-end{
    position: relative;
    img{
      width:2.4rem;
      position: absolute;
      bottom:-0.266667rem
    }
  }
}

</style>
