<template>
  <div class="car-body">
    <section class="car" v-if="CartData.length">
      <headTop :noneHome="noneHome" :headTitle="titleName">
        <div class="edit"slot="edit" @click="eidtall">{{alledit?'编辑':'完成'}}</div>
      </headTop>

      <div class="car-box">
        <section class="item" v-for="(value,i) in CartData">
          <div class="title">
            <i class="iconfont icon-xuanzhong"  :class="value.state?'active':''" @click="itemtitleselect(value.StoreId)"></i>
            <i class="iconfont icon-shangpinguanli"></i>
            <div class="name" @click="routerpushPart(value.StoreId)">{{value.StoreName}}</div>
            <div class="item-edit" @click="editflagto(i)">{{editflag[i]?'编辑':'完成'}}</div>
          </div>
          <section class="item-wrap" v-for="(v,vi) in value.Items">
            <i class="iconfont icon-xuanzhong" :class="v.state?'active':''" @click="itemselect(v.Id)"></i>
            <div class="item-wrap-con">
              <img :src="v.PicUrl" alt="" @click="routerpush(v.Id)"/>
              <div class="cont">
                <div class="cont-title">{{v.Title}}</div>
                <div class="cont-money" v-show="editflag[i]"><span>$<b>{{v.LowPrice}}</b>起</span><span>门市价$<b>{{v.StorePrice}}</b></span></div>
                <div class="cont-how" v-show="editflag[i]">已售 <span>{{v.SaleNumber}}</span>份</div>
                <span class="star-pic" v-show="editflag[i]">
                  <i v-show="editflag[i]" :style="'width:' + v.Score*20 + '%'"></i>
                </span>
                <div class="num-box"v-show="!editflag[i]">
                  <span @click="des(v)">-</span><input type="text" v-model.lazy="v.BoughtNum"/><span @click="add(v)">+</span>
                </div>
              </div>
              <div class="num" v-show="editflag[i]">×{{v.BoughtNum}}</div>
            </div>
            <div class="del" v-show="!editflag[i]" @click="delteam(i,value.StoreId,vi,v.Id)"><span>删除</span></div>
          </section>
        </section>
      </div>
      <section class="account">
        <div class="select-all" @click="all"><i class="iconfont icon-xuanzhong":class="!allflag?'active':''"></i>全选</div>
        <div class="totle">合计：$<span>{{totle.retoFixed(2)}}</span></div>
        <div class="cartto" @click="cartto">结算</div>
      </section>
      <alert v-if="showAlert"  @closeTip="close" :alertText="alertText" :suc="collectflag"></alert>
      <transition name="router-slid">
        <router-view></router-view>
      </transition>
    </section>
    <section v-else>
      <headTop :noneHome="noneHome" :headTitle="titleName"></headTop>
      <div class="no-box">
        <div class="no-title">
          <i class="iconfont icon-gouwuche"></i><span>购物车空空,快去狂逛吧</span><button @click="$router.push('/category?pid=210')">去逛逛</button>
        </div>
        <div class="title">猜你喜欢</div>
        <section class="likebox">
          <div class="section" v-for="value in forbox">
            <div class="like-title">{{value.title}}</div>
            <div class="box">
              <div class="item" v-for="item in value.value" @click="routerpush(item.TeamId)">
                <img :src="item.Image" alt="" />
                <div class="cont">
                  <p class="name">{{item.Partner}}</p>
                  <p class="text">{{item.Title}}</p>
                  <div class="money"><span class="left">{{dollorflag}}<b>{{changedollor(item.Price)}}</b></span><span class="right">{{dollorflag}}{{changedollor(item.Mprice)}}</span></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>
    <Foot></Foot>
  </div>
</template>

<script>

import headTop from '@/components/commen/header/head'
import Foot from '@/components/commen/footer/foot'
import alert from '@/components/commen/alert/alert'
import {GetUserCartDataSource,DelCartItem,UserCartToOrder,getYouLike,AddToUserCart} from '@/service/getData'
import {getCookie} from '@/config/mUtils'
import {mapMutations} from 'vuex'
export default {
  name: 'cart',
  data () {
    return {
      titleName:'购物车',
      noneHome:true,
      CartData:[],
      totle:0,
      allflag:true,//全选
      editflag:[],//编辑
      alledit:true,
      editactive:true,
      alertText:"",
      showAlert:false,
      collectflag:false,
      forbox:[
      {
        value:'',
        title:'为你推荐'
      }
      ],
      dollorflag:"$",
    }
  },
  created(){
    this.dollorflag = this.changedollorflag()
  },
  async mounted(){
    let response = await GetUserCartDataSource(getCookie("USERToken"))
    if(response.data.Ret==1001){
      this.OUT_LOGIN();
      this.$router.push('/login')
    }
    this.CartData = response.data.Item;
    this.CartData.forEach((element,index)=>{
      element.state = false;
      this.editflag.push(true);
      element.Items.forEach((ele,i)=>{
        ele.state = false;

      })
    })
    if(!this.CartData.length){
      getYouLike(1).then((response)=>{
        this.forbox[0].value = response.data
      })
    }

    document.body.scrollTop = 0
    document.documentElement.scrollTop = 0
  },
  methods:{
    ...mapMutations([
      'OUT_LOGIN'
    ]),
    /**
     * [all 全选]
     * @return {[type]} [description]
     */
    all(){
      this.CartData.forEach((element,index)=>{

        if(this.allflag){
          element.state = true;
        }else{
          element.state = false;
        }
        element.Items.forEach((ele,i)=>{
          if(element.state){
            ele.state = true;
          }else{
            ele.state = false;
          }
        })
      })
      if(this.allflag){
        this.allflag = false;
      }else{
        this.allflag = true;
      }
      this.totlenum()
    },
    /**
     * [itemtitleselect 选中订单头]
     * @param  {[type]} id [description]
     * @return {[type]}    [description]
     */
    itemtitleselect(id){
      let newarr = [].concat(this.CartData)
      let arr = newarr.filter((element,index)=>{
        return element.StoreId == id
      });
      let item = arr[0];
      if(item.state){
        item.state = false;
        item.Items.forEach((element,index)=>{
          element.state = false;
        })
      }else{
        item.state = true;
        item.Items.forEach((element,index)=>{
          element.state = true;
        })
      }
      this.CartData = newarr;
      this.checkall()
      this.totlenum()
    },
    /**
     * [itemselect 单个团单选择]
     * @param  {[type]} id [团单id]
     * @return {[type]}    [description]
     */
    itemselect(id){
      let newarr = [].concat(this.CartData)
      newarr.forEach((element,index)=>{
        element.Items.forEach((ele,i)=>{
          if(ele.Id == id){
            if(ele.state){
              ele.state = false;
            }else{
              ele.state = true;
            }
          }
        })
      })
      this.CartData = newarr;
      this.checktitle(id)
      this.totlenum()
    },
    /**
     * [totlenum 总价]
     * @return {[type]} [description]
     */
    totlenum(){
      this.totle = 0;
      this.CartData.forEach((element,index)=>{
        element.Items.forEach((ele,i)=>{
          if(ele.state){
            this.totle += ele.BoughtNum*ele.LowPrice;
          }
        })
      })
    },
    /**
     * [checkall 检查是否全选]
     * @return {[type]} [description]
     */
    checkall(){
      let narr = this.CartData.filter((element,index)=>{
        return element.state == false
      })
      if(narr.length){
        this.allflag = true;
      }else{
        this.allflag = false;
      }
    },
    /**
     * [checktitle 检查某个订单是否全选]
     * @param  {[type]} id [团单id]
     * @return {[type]}    [description]
     */
    checktitle(id){
      // 先找父层
      let tarr = [];
      this.CartData.forEach((element,index)=>{
        element.Items.forEach((ele,i)=>{
          if(ele.Id == id){
            tarr = element
          }
        })
      })
      let newarr = [].concat(this.CartData)
      let arr = newarr.filter((element,index)=>{
        return element.StoreId == tarr.StoreId
      });
      let item = arr[0];
      var lastarr = item.Items.filter((ele,i)=>{
        return ele.state == false
      })
      if(lastarr.length){
        item.state = false;
      }else{
        item.state = true;
      }
      this.CartData = newarr;
      this.checkall()
    },
    routerpush(id){
      this.$router.push("/team?id="+id)
    },
    routerpushPart(id){
      this.$router.push("/partner?id="+id)
    },
    /**
     * [eidtall 全部编辑]
     * @return {[type]} [description]
     */
    eidtall(){
      this.alledit = !this.alledit;
      this.editflag.forEach((ele,index)=>{
        this.editflag.splice(index,1,this.alledit)
      })
    },
    /**
     * [editflagto 单个编辑]
     * @param  {[type]} i [索引]
     * @return {[type]}   [description]
     */
    editflagto(i){
      this.editflag.splice(i,1,!this.editflag[i])
    },
    /**
     * [des 减少]
     * @param  {[type]} v [description]
     * @return {[type]}   [description]
     */
    des(v){
      v.BoughtNum--;

      if(v.BoughtNum<1){
        v.BoughtNum = 1
      }else{
        AddToUserCart(v.Id,-1,getCookie("USERToken")).then((response)=>{
          if(response.data.Ret != 0){
            v.BoughtNum++;
          }
        })
      }
      v.BoughtNum +='';
      this.totlenum()
    },
    /**
     * [add 增加]
     * @param {[type]} v [description]
     */
    add(v){
      v.BoughtNum++;
      AddToUserCart(v.Id,1,getCookie("USERToken")).then((response)=>{
        if(response.data.Ret != 0){
          v.BoughtNum--;
        }
      })
      v.BoughtNum +='';
      this.totlenum()
    },
    /**
     * [delteam 购物车删除]
     * @param  {[type]} si  [订单索引]
     * @param  {[type]} sid [订单id]
     * @param  {[type]} vi  [团单索引]
     * @param  {[type]} id  [团单id]
     * @return {[type]}     [description]
     */
    delteam(si,sid,vi,id){
      // 外层索引,外层id,内层索引,内层id
      DelCartItem(id,getCookie("USERToken")).then((response)=>{
        if(response.data.Ret == 0){
          let narr = this.CartData.filter((element,index)=>{
            return element.StoreId == sid
          });
          narr[0].Items.splice(vi,1);
          if(narr[0].Items.length <= 0){
            this.CartData.splice(si,1);
          }
          this.alertText = "删除成功";
          this.showAlert = true;
          this.collectflag = true;
        }else{
          this.alertText = response.data.Msg;
          this.showAlert = true;
        }
        this.totlenum()
      })
    },
    close(){
      this.alertText = "";
      this.showAlert = false;
      this.collectflag = false;
    },
    /**
     * [cartto 结算]
     * @return {[type]} [description]
     */
    cartto(){
      let flag = 0;
      // 是否有选中
      this.CartData.forEach((element,index)=>{
        if(element.state){
          flag = 1
          return false
        }else{
          element.Items.forEach((ele,i)=>{
            if(ele.state){
              flag = 1
              return false
            }
          })
        }
      })
      if(flag){
        let arr = [];
        this.CartData.forEach((element,index)=>{
          element.Items.forEach((ele,i)=>{
            if(ele.state){
              arr.push({'Id':ele.Id,'Num':ele.BoughtNum})
            }
          })
        })

        UserCartToOrder(getCookie("USERToken"),JSON.stringify(arr)).then((response)=>{
          if(response.data.PackageId){
            this.$router.push('/pay?id='+response.data.PackageId)
          }else{
            this.alertText = response.data.Msg;
            this.showAlert = true;
            this.collectflag = false;
          }
        })
      }else{
        this.alertText = "请选择订单";
        this.showAlert = true;
        this.collectflag = false;
      }
    }
  },

  components:{headTop,Foot,alert}
}
</script>

<style scoped lang="scss">
@import '../../style/mixin';
  .edit{
    position: absolute;
    right:0.54rem;
    @include font-dpr(14px);
    color:#333;
    z-index:200
  }
  .show-wrap-bac{background:#f5f5f5}
  .car-box{
    padding-top: 1.093333rem;
    padding-bottom: 2.186666rem;
    .item{
      margin-bottom: 0.4rem;
      i.icon-xuanzhong{
        @include font-dpr(16px);
        color:#ccc;
        &.has-choosed{color:$ic}
      }
      .title{
        @include wh(100%, 1.333333rem);
        line-height: 1.333333rem;
        display:flex;
        background:#fff;
        padding:0 0 0 0.266667rem;

        i{
          display:block;
          text-align: center;
          line-height: 1.333333rem;
          @include font-dpr(16px);margin-right: 0.32rem;
        }
        i.icon-shangpinguanli{
          color:$ic;@include font-dpr(14px)
        }
        .name{@include font-dpr(15px);flex:1}
        .item-edit{
          position: relative;
          width:1.2rem;;
          text-align: center;
          color:#666;
          &:before{
            content:"";
            position: absolute;
            height:0.453333rem;
            width:0.013333rem;
            top:0.44rem;
            left:-0.01rem;
            background:#999;
          }
        }
      }

    }
    .item-wrap{
      padding:0.266667rem;
      display:flex;
      position: relative;
      background:#f6f6f6;
      margin-bottom: 0.24rem;
      i.icon-xuanzhong{
        @include ct;
      }
      .del{
        position:absolute;
        top:0;
        right:0;
        background:$ic;
        @include wh(1.333333rem,100%);
        span{
          @include center;
          display:block;
          width:100%;
          text-align: center;
          color:#fff;
        }
      }
      .item-wrap-con{
        display:flex;
        img{
          @include wh(2.906667rem, 2.906667rem);
          margin:0 0.453333rem 0 0.933333rem;
        }

      }
      .cont{
        width:3.333333rem;line-height: 0.506667rem;
        .cont-title{
          @include ellipsis(2)
          @include font-dpr(14px);
        }
        .cont-money{
          span:first-child{
            color:$ic;@include font-dpr(13px);margin-right: 0.133333rem;
            b{color:$ic;@include font-dpr(14px);}
          }
          span:last-child{
            color:#666;@include font-dpr(10px);
            b{@include font-dpr(10px)}
          }
        }
        .cont-how{
          line-height: 0.613333rem;@include font-dpr(12px);color:#666
        }
        .num-box{
          display:flex;
          margin:0.4rem 0;
          border:1px solid #ccc;
          @include wh(2.666667rem,0.586667rem)
          span{
            @include wh(0.56rem,0.56rem);
            text-align: center;
            line-height: 0.533333rem;
            box-sizing:border-box;
            @include font-dpr(14px);
            &:first-child{
              border-right: 1px solid #ccc;
            }

            &:last-child{
               border-left:1px solid #ccc;
            }
          }
          input{
            width:1.68rem;
            height:0.533333rem;
            border-radius: none;
            box-sizing:border-box;
            @include font-dpr(12px);
            text-align: center;
          }
        }
      }
      .num{
        position:absolute;
        top:0.266667rem;
        right:0.266667rem;
        @include font-dpr(14px);
      }
    }
    .star-pic{
      @include wh(2.173333rem, 0.346667rem);
      background: url('../../assets/img/star0.png') no-repeat;
      background-size: 100% 100%;
      display: inline-block;
      vertical-align: middle;
      margin-right: 0.133333rem;
      i{
        background: url('../../assets/img/star.png')no-repeat;
        display: inline-block;
        height: 0.346667rem;
        overflow: hidden;
        vertical-align: top;
        background-size: auto 100%;}
    }
  }
  .no-box{
    padding-top: 1.093333rem;
    .no-title{
      display:flex;
      height: 1.333333rem;
      background:#fff;
      align-items:center;
      i{margin: 0 0.533333rem;@include font-dpr(30px);}
      span{@include font-dpr(14px);}
      button{
        @include font-dpr(14px);color:#fff;
        @include wh(1.866667rem,0.8rem)
        background:$fcolor;
        border-radius: 0.133333rem;
        margin-left: 0.533333rem;
      }
    }
    .title{
      line-height: 1.226667rem;
      @include font-dpr(16px);
      text-align: center;
      position: relative;
      &:before,&:after{
        position: absolute;
        content:'';
        width:2.666667rem;
        height:0.026667rem;
        background:#cacaca;
        top:0.61rem;
      }
      &:before{
        left:0.6rem
      }
      &:after{
        right:0.6rem
      }
    }
    .likebox{
      .section{
        .like-title{
          line-height: 0.986667rem;padding:0 0.266667rem;@include font-dpr(14px);background:#fff;border-bottom: 1px solid #eee;
        }
        .box{
          padding:0.266667rem 0;
          display:flex;
          flex-flow:wrap;;background:#fff;

          .item{
            width:4.6rem;
            margin:0 0 0.4rem 0.266667rem;
            box-sizing:border-box;
            border:1px solid #eee;
            img{
              width:100%;
              height:2.8rem;
            }
            .cont{
              padding-left: 0.133333rem;
            }
            .name{
              @include font-dpr(12px)
              font-weight: bold
            }
            .text{
              @include font-dpr(11px);
              color:#666;
              @include ellipsis(2);
              max-height: 1.05rem
            }
            .left, b{
              color:$ic;@include font-dpr(13px);
            }
            .right{
              color:#666;@include font-dpr(12px);margin-left: 0.266667rem;
            }
          }
        }
      }
    }
  }
  .account{
    position: fixed;
    bottom:1.28rem;
    @include wh(100%, 1.28rem);
    background:#fff;
    display:flex;
    padding-left:0.266667rem;
    line-height: 1.28rem;
    .select-all{
      @include font-dpr(16px);
      i{
        margin-right: 0.32rem;color:#ccc;
      }
    }
    .totle{
      flex:1;color:$ic;
      @include font-dpr(15px);
      text-align: center;
      span{color:$ic}
    }
    .cartto{
      @include wh(2.906667rem, 1.28rem);
      text-align: center;
      @include font-dpr(16px)
      color:#fff;
      background:$ic
    }
  }
  .icon-xuanzhong.active{
    color:$ic!important
  }
</style>
