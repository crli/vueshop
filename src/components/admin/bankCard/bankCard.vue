<template>
  <div class="wrap">
    <headTop :noneHome="noneHome" :headTitle="titleName"></headTop>
    <div class="box">
      <section v-for="(item,index) in bancard" class="item" @click="select(item.Card,index,item.Id)">
        <div class="img">
          <img :src="handimg(item.Type)" alt="" />
        </div>
        <div class="cont">
          <p>{{item.Name}}</p>
          <p>{{item.Card}}</p>
        </div>
      </section>
      <section class="add" @click = "gotopath({path: '/bankCard/addCard'})">+添加银行卡</section>
    </div>
    <mesbox v-if="showMsg"  @close="close" :mesText="mesText" @del="delmsg" @revise="revisemsg"></mesbox>
    <transition name="router-slid">
        <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import headTop from '@/components/commen/header/head'
import mesbox from '@/components/commen/mesbox/mesbox'
import {mapState,mapActions} from 'vuex'
import {getUserBankCardList,delBankCard} from '@/service/getData'
import {getCookie} from '@/config/mUtils'
import MasterCard from '@/assets/img/MasterCard.png'
import ivisa from '@/assets/img/visa.png'
import DISCOVER from '@/assets/img/DISCOVER.png'
import JCB from '@/assets/img/JCB.png'
export default {
  name: 'bankCard',
  data () {
    return {
      titleName:'银行卡',
      noneHome:true,
      showMsg:false,//弹出
      mesText:null,//提示信息
      selectIndex:-1,//所选index
      Id:null//所选Id
    }
  },
  mounted(){
    this.initData()
  },
  methods:{
    ...mapActions([
        'getBancard'
    ]),
    initData(){
        this.getBancard();
        document.body.scrollTop = 0
        document.documentElement.scrollTop = 0
    },
    close(){
      this.showMsg = false;
    },
    delmsg(){
      delBankCard(getCookie("USERToken"),this.Id).then((response)=>{
        if(!response.data.ret){
          this.bancard.splice(this.selectIndex,1)
        }
      })
      this.close()
    },
    revisemsg(){
      this.$router.push("/bankCard/changeCard?Id="+this.Id+"")
      this.close()
    },
    select(card,index,id){
      this.selectIndex = index;
      this.Id = id;
      let str = card.substr(card.length-4)
      this.showMsg = true;
      this.mesText = '您可对 尾号'+str+'的 银行卡 进行操作'
    },
    gotopath(path){
      this.$router.push(path)
    },
    handimg(type){
      switch (type){
        case 'visa':
        return ivisa
          break;
        case 'jcb':
        return JCB
          break;
        case 'mastercard':
        return MasterCard
          break;
        case 'discover':
        return DISCOVER
          break;
      }
    }
  },
  computed:{
    ...mapState([
      'bancard'
    ])
  },

  components:{headTop,mesbox}
}
</script>
<style scoped lang="scss">
@import '../../../style/mixin';
.tip{font-size: 86px}
  .wrap{
    .box{
      padding-top: 1.093333rem;
      .item{
        position: relative;
        margin: 0.333333rem 0.133333rem;
        height: 2.32rem;
        background:#fff;
        @include borderRadius(0.013333rem,#eee,0.066667rem)
        .img{
          @include ct;
          left:0.48rem;
          @include wh(1.24rem,0.88rem);
          img{@include wh(1.24rem,0.88rem);}

        }
        .cont{
          @include ct;
          left:2.2rem;
          p{
            @include font-dpr(14px)
          }
        }
      }
      .add{
        margin: 0.333333rem 0.133333rem;
        background:#fff;
        @include borderRadius(0.013333rem,#eee,0.066667rem)
        height: 1.32rem;
        line-height: 1.32rem;
        text-align: center;
        @include font-dpr(14px)
        color: #666
      }
    }
  }
  .router-slid-enter-active, .router-slid-leave-active {
      transition: all .4s;
  }
  .router-slid-enter, .router-slid-leave-active {
      transform: translateX(100%);
  }
</style>
