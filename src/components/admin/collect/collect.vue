<template>
  <div class="wrap">
    <headTop :noneHome="noneHome" :headTitle="titleName"><div class="edit"slot="edit" @click="edit">{{editext}}</div></headTop>
    <div class="box" >
      <div class="head">
        <div class="item" :class="{active:active==index}" @click="select(index)" v-for="(v,index) in cont">{{v.title}}({{v.value}})</div>
      </div>
      <div class="list" v-if="active==0">
        <div class="list-item" v-for="(v,index) in partlist" @click="partnerto(v.Id)">
          <div class="img">
            <img :src="v.Img" alt="" />
          </div>
          <div class="cont-box">
            <p class="title">{{v.Title}}</p>
            <p class="cont">{{v.Cont}}</p>
            <p>
              <span class="star-pic">
                <i :style="'width:' +v.Star*20 + '%'"></i>
              </span>
              <span>${{v.Percapita}}/人</span>
            </p>
          </div>
          <div class="del" v-if="!flag"><i class="iconfont icon-shanchu" @click.stop="delteam(index,v.Id,'Partner')"></i></div>
        </div>
      </div>
      <div class="list" v-else>
        <div class="list-item" v-for="(v,index) in teamlist" @click="teamto(v.Id)">
          <div class="img">
            <img :src="v.Img" alt="" />
          </div>
          <div class="cont-box">
            <p class="title-t ellipsis">{{v.Title}}</p>
            <p class="cont-t"><span class="ic">$</span><b class="ic">{{v.Price}}起</b><span class="ml">门市价</span><span>$</span><b>{{v.Mprice}}</b></p>
            <p class="how"><span>已售</span>{{v.SaleNum}}份</p>
            <p>
              <span class="star-pic">
                <i :style="'width:' +v.Star*20 + '%'"></i>
              </span>
            </p>
          </div>
          <div class="del" v-if="!flag"><i class="iconfont icon-shanchu" @click.stop="delteam(index,v.Id,'Team')"></i></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import headTop from '@/components/commen/header/head'
import {FavTeamList} from '@/service/getData'
import {getCookie} from '@/config/mUtils'
import {DelFavorites} from '@/service/getData'
export default {
  name: 'collect',
  data () {
    return {
      titleName:'我的收藏',
      noneHome:true,
      cont:[{
        title:'商家',
        value:null
      },{
        title:'团购',
        value:null
      }],
      editext:'编辑',
      flag:true,
      active:0,
      teamlist:[],
      partlist:[]
    }
  },
  methods:{
    select(index){
      this.active = index
    },
    teamto(id){
      this.$router.push('/team?id=' + id)
    },
    partnerto(id){
      this.$router.push('/partner?id=' + id)
    },
    edit(){
      if(this.flag){
        this.editext = '完成'
        this.flag = false;
      }else{
        this.editext = '编辑'
        this.flag = true;
      }
    },
    // delteam(index,id,type){
    //   DelFavorites(getCookie("USERToken"),1111,type).then((response)=>{
    //     if(response.data.Ret == 0){
    //       if(type=="Team"){
    //         this.teamlist.splice(index, 1);
    //         this.cont[1].value = this.teamlist.length;
    //       }
    //       if(type=="Partner"){
    //         this.partlist.splice(index, 1);
    //         this.cont[0].value = this.partlist.length;
    //       }
    //     }
    //   })
    // }
    async delteam(index,id,type){
      try {
        let response = await DelFavorites(getCookie("USERToken"),id,type);
        if(response.data.Ret == 0){
          if(type=="Team"){
            this.teamlist.splice(index, 1);
            this.cont[1].value = this.teamlist.length;
          }
          if(type=="Partner"){
            this.partlist.splice(index, 1);
            this.cont[0].value = this.partlist.length;
          }
        }
      }catch(e){

      }
    }
  },
  mounted(){
    FavTeamList(getCookie("USERToken"),'Team').then((response)=>{
      this.teamlist = response.data;
      this.cont[1].value = this.teamlist.length;
    });
    FavTeamList(getCookie("USERToken"),'Partner').then((response)=>{
      this.partlist = response.data;
      this.cont[0].value = this.partlist.length;
    });
    document.body.scrollTop = 0
    document.documentElement.scrollTop = 0
  },
  components:{headTop}
}
</script>
<style scoped lang="scss">
@import '../../../style/mixin';
  .edit{
    position: absolute;
    right:0.54rem;
    @include font-dpr(14px);
    color:#333;
    z-index:1000
  }
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
        @include font-dpr(14px);
      }
      .active{
        color:$fcolor;
        &:before{
          position:absolute;
          width:50%;
          height:1px;
          content: '';
          background:$fcolor;
          bottom:0;
          left:25%
        }
      }
    }
    .list-item{
      margin-top: 0.373333rem;
      padding:0.453333rem;
      display:flex;
      background:#fff;
      position:relative;
      .img{
        @include wh(2.96rem,2.48rem);
        margin-right: 0.453333rem;
        img{
          @include wh(2.96rem,2.48rem);
        }
      }
      .cont-box{width:4.933333rem}
      .star-pic{
        @include wh(2.173333rem, 0.346667rem);
        background: url('../../../assets/img/star0.png') no-repeat;
        background-size: 100% 100%;
        display: inline-block;
        vertical-align: middle;
        margin-right: 0.133333rem;
        i{
          background: url('../../../assets/img/star.png')no-repeat;
          display: inline-block;
          height: 0.346667rem;
          overflow: hidden;
          vertical-align: top;
          background-size: auto 100%;
        }
      }
      .title{
        @include font-dpr(14px);
        line-height: 0.64rem;
      }
      .title-t{
        @include font-dpr(14px);
        line-height: 0.64rem;
      }
      .cont{
        @include font-dpr(12px);
        @include ellipsis(3)
      }
      .cont-t{
        line-height: 0.64rem;
        span,b{@include font-dpr(10px);}
        .ic{
          color:$fcolor;@include font-dpr(14px);
        }
        .ml{
          margin-left: 0.133333rem;
        }
      }
      .how{
        @include font-dpr(13px);
        color:#666;
        span{color:#666;}
      }
      .del{
        position:absolute;
        right:0;
        top:.4rem;
        width:1rem;
        height:1rem;
        z-index: 2000;
        .icon-shanchu{
          @include center;
          @include font-dpr(16px);
          color:red;
        }
      }

    }
  }
</style>
