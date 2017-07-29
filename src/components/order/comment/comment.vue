 <template>
    <div class="comment"@touchmove.prevent>
      <headTop :noneHome="noneHome" :headTitle="titleName"></headTop>
      <div class="box">
        <score @toscore="setscore"></score>
        <div class="cont">
          <textarea v-model="parameter.Cont" placeholder="菜品口味如何，服务周到吗，环境如何？" @input="numcomputed">
          </textarea><span>还剩{{contnum}}字</span>
        </div>
        <div class="money">
          人均：$ <input type="text" v-model="parameter.PerCapita" placeholder="请输入消费金额" @input="numright"/>
        </div>
        <div class="anonymous">
          <input type="checkbox" id="Y" value="Y" v-model="anonymousbox">
          <label for="Y">匿名评价</label>
        </div>
        <div class="sub" @click="subTo">提交评论</div>
      </div>
      <alert v-if="showAlert"  :alertText="alertText" @closeTip="close" :suc="collectflag"></alert>
    </div>
</template>

<script>
import headTop from '@/components/commen/header/head'
import alert from '@/components/commen/alert/alert'
import score from '@/components/commen/score/score'
import {getCommentTagsList,createTeamComment} from '@/service/getData'
import {getCookie} from '@/config/mUtils'
export default {
  name:'comment',
  data(){
    return{
      titleName:'',
      noneHome:true,
      showAlert:false,
      alertText:'',
      collectflag:false,
      parameter:{
        Token:null,
        OrderId:'',
        File:'',
        Star1:null,
        Cont:null,
        PerCapita:null,
        Anonymous:'N',
        Tags:''
      },
      taglist:{},
      tagbox:[],
      contnum:140,
      anonymousbox:[],
      suc:false,
      PartnerId:''
    }
  },
  created(){
    this.initData();
  },
  methods:{
    setscore(arr){
      this.parameter[arr[0]] = arr[1]
    },
    initData(){
      this.titleName = this.$route.query.partner;
      this.parameter.OrderId = this.$route.query.orderid;
      this.PartnerId = this.$route.query.partnerid;
      getCommentTagsList(this.PartnerId).then((response)=>{
        for(let i in response.data){
          response.data[i].tagflag = false
        }
        this.taglist = response.data;
      })
    },

    tagclick(id){
      this.taglist[id].tagflag = !this.taglist[id].tagflag
      if(this.taglist[id].tagflag == true){
        this.tagbox.push(id)
      }else{
        let index = this.tagbox.indexOf(id);
        if (index > -1) {
          this.tagbox.splice(index, 1);
        }
      }
      this.parameter.Tags = this.tagbox.join(",")
    },
    numcomputed(){
      this.contnum = 140 - this.parameter.Cont.length;
      if(this.parameter.Cont.length>=140){
        this.parameter.Cont = this.parameter.Cont.substr(0,139);
      }
    },
    subTo(){
      // if(!this.parameter.Star1||!this.parameter.Star2||!this.parameter.Star3||!this.parameter.Star4){
      if(!this.parameter.Star1){
        this.showAlert = true;
        this.alertText = '请完整评分';
        return false
      }else if(!this.parameter.Cont||this.parameter.Cont.length<15){
        this.showAlert = true;
        this.alertText = '请输入评价，最少15个字';
        return false
      }else if(!this.parameter.PerCapita){
        this.showAlert = true;
        this.alertText = '请输入消费金额';
        return false
      }else if(!/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(this.parameter.PerCapita)){
        this.showAlert = true;
        this.alertText = '请输入正确金额';
        return false
      }else{
        this.parameter.Token = getCookie("USERToken");
        createTeamComment(this.parameter).then((response)=>{
          if(response.data.Ret==0){
            this.suc = true;
            this.alertText = "评论成功";
            this.showAlert = true;
            this.collectflag = true;
          }else{
            this.showAlert = true;
            this.alertText = "评论提交失败,请重新尝试";
            return false
          }
        })
      }
    },
    numright(){
      this.parameter.PerCapita = this.parameter.PerCapita.replace(/[^\d.]/g, '')
    },
    close(){
      if(this.suc){
        this.$router.go(-1)
      }else{
        this.showAlert = false
      }
    }
  },
  watch:{
    anonymousbox:function (value) {
      this.parameter.Anonymous = value[0]||'N'
    }
  },

  components:{headTop,alert,score}
}
</script>

<style lang="scss" scoped>
  @import '../../../style/mixin';
  .comment{
    position: fixed;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    z-index: 0;
    background:#eee;
    overflow: auto;
    .box{
      padding-top: 1.093333rem ;
      width:100%;
      height:100%;
    }
    .star-box{
      background:#fff;
      padding:0.266667rem;
      margin-bottom:0.4rem;
    }
    .star{
      line-height: 0.96rem;
      display:flex;
      align-items:center;
      .nm{
        width:1.066667rem;
        @include font-dpr(15px)
      }
      .star-pic{display:inline-block;
        @include wh(3.626667rem, 0.48rem);
        background: url('../../../assets/img/xd.png') no-repeat;
        background-size: auto 100%;
        position:relative;
        .i{
          background: url('../../../assets/img/xdh.png')no-repeat;
          display: inline-block;
          height: 0.48rem;
          background-size: auto 100%;
          vertical-align: top;
        }
        .star-select{
          position:absolute;
          z-index: 10;
          top:0;
          left:0;
          display: inline-block;
          @include wh(3.626667rem, 0.48rem);
          display:flex;
          justify-content:space-between;
          .hand{
            @include wh(0.48rem, 0.48rem);
            display:block;
          }
        }
      }
      .start-msg{
        margin-left: 0.4rem;
        display:inline-block;
        @include font-dpr(14px)
      }
    }
    .star-m{
      line-height: 0.666667rem;
      display:flex;
      align-items:center;
      .nm{
        width:1.066667rem;
        @include font-dpr(13px)
      }
      .star-pic{
        @include wh(3.04rem, 0.4rem);
        background: url('../../../assets/img/xx.png') no-repeat;
        background-size: 100% 100%;
        position:relative;
        .i{
          background: url('../../../assets/img/xxh.png')no-repeat;
          display: inline-block;
          height: 0.4rem;
          overflow: hidden;
          background-size: auto 100%;
          vertical-align: top;
        }
        .star-select{
          position:absolute;
          z-index: 300;
          top:0;
          left:0;
          display: inline-block;
          @include wh(3.04rem, 0.4rem);
          display:flex;
          justify-content:space-between;
          i{
            @include wh(0.4rem,0.4rem);
          }
        }
      }
      .start-msg{
        margin-left: 0.4rem;
        @include font-dpr(12px)
      }
    }
    .tag{
      margin: 0.22rem 0;
      span{display:inline-block; padding:0.05rem 0.4rem;margin:0.2rem 0.466667rem 0 0;@include font-dpr(12px);}
      .Y{
        border:1px solid $ic;color:$ic;
      }
      .N{
        border:1px solid #ddd;color:#666;
      }
      .active{
        background:$ic;color:#fff
      }
    }
    .cont{
      height:2.5rem;
      border:1px solid #ddd;position:relative;

      textarea{
        @include wh(100%,100%);padding:0 0.266667rem;@include font-dpr(14px)

      }
      span{
        position:absolute;
        right:0.266667rem;
        bottom:0;
                color:#666;
      }
    }
    .money{
      margin:0.4rem 0;
      line-height: 1.2rem;
      background:#fff;
      padding:0 0.266667rem;@include font-dpr(14px);
      input{@include font-dpr(14px);}
    }
    .anonymous{
      margin:0.4rem 0;
      line-height: 1.2rem;
      background:#fff;
      padding:0 0.266667rem;@include font-dpr(14px)

    }
    .sub{
      width:86%;
      margin:.25rem auto ;
      background-color: $ic;
      color:#fff;
      padding: .26rem 0;
      border: 1px;
      border-radius: 0.15rem;
      text-align: center;
      @include font-dpr(14px);
    }
  }
</style>
