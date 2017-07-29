<template>
  <div class="wrap">
    <headTop :noneHome="noneHome" :headTitle="titleName"></headTop>
    <div class="box">
      <section v-for="(item,index) in address.Items" class="item" @click="select(index,item.Id)">
        <p><span>{{item.Firstname}}</span><span>{{item.Mobile}}</span></p>
        <p><span>{{item.State}}</span><span>{{item.Street}}</span><span>{{item.Zipcode}}</span></p>
        <div :class="item.Default=='N'?'def':'def select'">选择默认</div>
      </section>
      <section class="add" @click = "gotopath({path: '/address/addAddress'})">+添加地址</section>
    </div>
    <mesbox v-if="showMsg"  @close="closemsg" @del="delmsg" @revise="revisemsg" ></mesbox>
    <transition name="router-slid">
        <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import headTop from '@/components/commen/header/head'
import mesbox from '@/components/commen/mesbox/mesbox'
import {mapState,mapActions} from 'vuex'
import {deleteAddress,addNewAddress} from '@/service/getData'
import {getCookie} from '@/config/mUtils'
export default {
  name: 'address',
  data () {
    return {
      titleName:'地址管理',
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
        'getAddress'
    ]),
    //初始化信息
    initData(){
        this.getAddress();
        document.body.scrollTop = 0
        document.documentElement.scrollTop = 0
    },
    closemsg(){
      this.showMsg = false;
    },
    delmsg(){
      deleteAddress(getCookie("USERToken"),this.Id).then((response)=>{
        if(!response.data.ret){
          this.address.Items.splice(this.selectIndex,1)
        }
      })
      this.closemsg()
    },

    revisemsg(){
      this.$router.push("/address/changeAddress?Id="+this.Id+"")
      this.closemsg()
    },
    select(index,id){
      this.selectIndex = index;
      this.Id = id;
      this.showMsg = true;
    },
    gotopath(path){
      this.$router.push(path)
    }
  },
  computed:{
    ...mapState([
      'address'
    ])
  },
  watch: {
      '$route' (to, from) {
        if(from.path=='/address/addAddress'){
          this.getAddress()
        }
      }
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
        background:#fff;
        @include borderRadius(0.013333rem,#eee,0.066667rem)
        padding:0.4rem;
        p{
          line-height: 0.8rem;
          height:0.8rem;
          @include font-dpr(13px);
          span{margin-right: 0.133333rem;}
        }
        .def{
          display:none;
        }
        .select{
          display:block;
          position:absolute;
          top:0.4rem;
          right:.4rem;
          background: $ic;
          color:#fff;
          padding:0.08rem;
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
