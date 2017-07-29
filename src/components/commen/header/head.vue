<template>
    <section id='head' class="head-other" v-if="noneHome" >
      <div class="head-back" @click="routerto"><i class="iconfont icon-back"></i></div>
      <div class="head-title">{{headTitle}}</div>
      <slot name="edit"></slot>
      <slot name="loginChange"></slot>
      <slot name="explain"></slot>
      <slot name="collect"></slot>
      <slot name="hack"></slot>
      <slot name="clear"></slot>
      <div class="head-back"></div>
    </section>
    <section id='head' class="head" v-else>
      <div class="item">
        <router-link to="/home/city" class="loc-name">{{name}}<i class="iconfont icon-xiala"></i></router-link>
      </div>
      <div class="item search" @click="clickto">

          <i class="iconfont">&#xe602;</i>
          <input type="text" placeholder="休闲娱乐"  :readonly="readonly"/>

      </div>
      <div class="item admin" >
        <router-link :to="tok?'/message':'/login'"><i class="iconfont icon-xiaoxi"></i></router-link>
      </div>
      <alert v-if="showAlert"  @closeTip="close" :alertText="alertText" :suc="collectflag"></alert>
    </section>
</template>

<script>
import {getStore,getCookie} from '@/config/mUtils'
import alert from '@/components/commen/alert/alert'
import {mapState, mapActions,mapMutations} from 'vuex'
    export default {
      name:'head',
      data () {
        return {
          name:"洛杉矶",
          showAlert:false,
          alertText:null,
          tok : ''
        }
      },
      props: ['noneHome','headTitle','readonly'],
      mounted(){
          this.tok = getCookie("USERToken");
          //获取用户信息
          let sUser = getStore("UWUSER");
          let noinfor = [
            '/home',
            '/home/city',
            '/discovery',
            '/partner',
            '/partner/allcomment',
            '/team',
            '/team/allcomment',
            '/team/teamdetail',
            '/team/otherpartner',
            '/category',
            '/category/subCategory',
            '/login',
            '/translate',
            '/strategy',
            '/strategy/strategydetail',
            '/newslist',
            '/newslist/newsdetail',
            '/news',
            '/appeal',
            '/findpassword',
            '/findpassword/setPassword',
            '/searchlist'
          ];
          let newpath = this.$route.path;
          if(sUser&&sUser.match("^\{(.+:.+,*){1,}\}$")){
            this.GET_USERINFO(JSON.parse(sUser))
          }else if(noinfor.indexOf(newpath)>-1){
            return false;
          }else{
            this.getUserInfo();
          }
      },
      methods: {
          ...mapActions([
              'getUserInfo'
          ]),
          ...mapMutations([
              'GET_USERINFO','OUT_LOGIN'
          ]),
          clickto(){
            if(this.$route.path=='/home'){
              this.$router.push('/search')
            }else{
              return false
            }
          },
          routerto(){
            if(this.$route.path=='/admin/ticket/refund/refDetails'){
              this.$router.push('/admin/ticket')
            }else if(this.$route.path=='/admin/ticket'){
              this.$router.push('/admin')
            }else if(this.$route.path=='/order/orderDetail/orderProgress'){
              this.$router.push('/order')
            }else if(this.$route.path=='/order'){
              this.$router.push('/admin')
            }else if(this.$route.path=='/login'){
              this.$router.push('/home')
            }else if(this.$route.path=='/admin/setUp/personalData'){
              this.$router.push('/admin/setUp')
            }else if(this.$route.path=='/admin/setUp'){
              this.$router.push('/admin')
            }else if(this.$route.path=='/category/subCategory'){
              this.$router.push('/category')
            }else{
              this.$router.go(-1)
            }

          },
          close(){
            this.showAlert = false;
            this.$router.push('/login')
          }
      },
      computed: {
          ...mapState([
              'userInfo'
          ]),
      },
      components:{alert}
    }

</script>

<style lang="scss" scoped>
  @import '../../../style/mixin';
  .head{
    position: absolute;
    z-index: 3;
    left: 0;
    top: 0;
    display: flex;
    @include wh(100%, 1.2rem);
    line-height: 1.2rem;
    background: transparent;
    align-items:center;
    .item{
      width: 2.4rem;
      .loc-name{
        @include font-dpr(15px);
        color: #fff;
        padding-left: 0.213333rem;
        i{
          padding-left: 0.213333rem;
          @include font-dpr(14px);
          color: #fff;
        }
      }
    }
    .search{
      flex: 1;
      position: relative;
      // a{display:block;line-height:0.666667rem; }
      i{
        position: absolute;
        left: 0.333333rem;
        @include font-dpr(13px);
        color: #fff
      }
      input{
        width: 100%;
        height: 0.666667rem;
        line-height: 0.666667rem;
        border-radius: 20px;
        padding-left: 0.88rem;
        background: rgba(255, 255, 255, .5);
        @include font-dpr(13px);
      }
    }
    .admin{
      width: 1.013333rem;
      text-align: center;
      i{
        color: #fff;
        @include font-dpr(13px)
      }
    }
  }
  input:-ms-input-placeholder{
      color: #fff;opacity:1;
  }

  input::-webkit-input-placeholder{
      color: #fff;opacity:1;
  }
  .head-other{
    background:$ict;
    position: fixed;
    z-index: 3;
    left: 0;
    top: 0;
    @include wh(100%, 1.093333rem);
    line-height: 1.093333rem;
    display: flex;
    .head-back{
      position: relative;
      @include wh(1.093333rem, 1.093333rem);
      i{
        color:#333;
        @include center;
        @include font-dpr(16px);
      }
    }
    .head-title{
      flex: 1;
      height:1.093333rem;
      text-align: center;
      color:#333;
      @include font-dpr(16px);
    }
  }
</style>
