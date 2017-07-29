<template>
  <section class="setmessage">
    <headTop noneHome=true headTitle="消息提醒设置">
    </headTop>
    <section class="set">
      <div class="item"@change="fmselect">
        <label for="Discount">优惠活动</label>
        <input type="checkbox" value="Discount" id="Discount" v-model="setbox"/>
      </div>
      <div class="item"@change="fmselect">
        <label for="Coupon">优惠券消息</label>
        <input type="checkbox" value="Coupon" id="Coupon" v-model="setbox"/>
      </div>
      <div class="item"@change="fmselect">
        <label for="Notice">通知提醒</label>
        <input type="checkbox" value="Notice" id="Notice" v-model="setbox"/>
      </div>
      <div class="item"@change="fmselect">
        <label for="Comment">评价互动</label>
        <input type="checkbox" value="Comment" id="Comment" v-model="setbox"/>
      </div>
    </section>
  </section>
</template>

<script>

import headTop from '@/components/commen/header/head'
import {MsgNoticeSetting,GetUserSettings} from "@/service/getData"
import {getCookie} from '@/config/mUtils'
import {mapMutations, mapState} from 'vuex'
export default {
  name: 'setmessage',
  data () {
    return {
      setbox:[],
      Discount:"Y",
      Coupon:"Y",
      Notice:"Y",
      Comment:"Y",
      initdata:{},//初始设置
    }
  },
  mounted(){
    GetUserSettings(getCookie("USERToken")).then((response)=>{
      this.initdata = response.data;
      if(this.initdata.commentmsg=="Y") this.setbox.push("Comment");
      if(this.initdata.couponmsg=="Y") this.setbox.push("Coupon");
      if(this.initdata.discountmsg=="Y") this.setbox.push("Discount");
      if(this.initdata.noticemsg=="Y") this.setbox.push("Notice");
    })
  },
  methods:{
    fmselect(){
      if(this.setbox.length){
        ["Discount","Coupon","Notice","Comment"].forEach((ele)=>{
          if(this.setbox.indexOf(ele)>-1){
            this[ele] = "Y"
          }else {
            this[ele] = "N"
          }
        })
      }else {
        this.Discount = "N";
        this.Coupon = "N";
        this.Notice = "N";
        this.Comment = "N";
      }
      MsgNoticeSetting(getCookie("USERToken"),this.Discount,this.Coupon,this.Notice,this.Comment)
    },
  },
  components:{headTop}
}
</script>

<style scoped lang="scss">
  @import '../../../style/mixin';
  .setmessage{
    position: fixed;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    z-index: 0;
    background:#fff;
    overflow: auto;
    .set{
      padding-top: 1.093333rem;
      width:100%;
      height:100%;
      .item{
        padding: 0.266667rem;
        box-sizing:border-box;
        @include wh(100%,1.333333rem);
        display:flex;
        justify-content:space-between;
        align-items:center;
        border-bottom: 1px solid #eee;
      }
    }
  }
</style>
