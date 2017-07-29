<template>
  <div class="wrap">
    <headTop :noneHome="noneHome" :headTitle="titleName"></headTop>
    <div class="box">
      <textarea v-model="message" class="message"></textarea>
      <div class="login-to" @click="submit">提交</div>
    </div>
    <alert v-if="showAlert"  @closeTip="close" :alertText="alertText" :suc="trueflag"></alert>
  </div>
</template>

<script>
import headTop from '@/components/commen/header/head'
import {NewsComment} from '@/service/getData'
import alert from '@/components/commen/alert/alert'
import {getCookie} from '@/config/mUtils'
import {mapMutations, mapState} from 'vuex'
export default {
  name: 'newscomment',
  data () {
    return {
      titleName:'编写评论',
      noneHome:true,
      message:null,
      showAlert:false,
      alertText:null,
      trueflag:false,
      id:null
    }
  },
  mounted(){
    this.id = this.$route.query.id
  },
  methods:{
    ...mapMutations([
      'ADD_NEWS_COM'
    ]),
    submit(){
      if(!this.message){
        this.showAlert = true;
        this.alertText = "请编写评论";
      }else{
        NewsComment(getCookie("USERToken"),this.id,this.message).then((response)=>{
          if(response.data.Ret == 0){
            let nid = 0;
            if(this.newslist.length){
              nid = this.newslist[0].Id;
            }

            this.ADD_NEWS_COM(
              {
                Avatar:this.userInfo.headPhoto,
                Cont:this.message,
                Id:String(++nid),
                Like:"N",
                LikeNum:"0",
                Time:'',
                UserName:this.userInfo.AccountName
              }
            )
            this.trueflag = true;
            this.showAlert = true;
            this.alertText = "提交成功";
          }else{
            this.showAlert = true;
            this.alertText = response.data.Msg;
          }
        })
      }

    },
    close(){
      this.showAlert = false;
      this.alertText = "";
      if(this.trueflag){
        this.$router.go(-1)
      }
    }
  },
  created(){
    document.body.setAttribute("class","hid");
  },
  computed:{
    ...mapState([
      'newslist','userInfo'
    ])
  },
  components:{headTop,alert}
}
</script>
<style scoped lang="scss">
@import '../../../../style/mixin';
  .wrap{
     position: fixed;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    z-index: 1100;
    background:#eee;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    .box{
      width:100%;
      height:100%;
      overflow: auto;
      -webkit-overflow-scrolling: touch;
      padding: 1.36rem 0.266667rem 0 0.266667rem;
      .message{
        @include wh(100%,6.0rem);@include font-dpr(15px);
      }
      .login-to{
        width:100%;
        margin:.2rem auto 0;
        background-color: $ict;
        color:#333;
        padding: .26rem 0;
        border: 1px;
        border-radius: 0.15rem;
        text-align: center;
        @include font-dpr(16px);
      }
    }
  }

</style>
