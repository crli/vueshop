<template>
  <section class="translate">
    <headTop :noneHome="noneHome" :headTitle="titleName">
      <div slot="clear" class="clearscreen" @click="clearall">清屏</div>
    </headTop>
    <div class="box">
      <section>
        <textarea v-model="value" class="textarea"></textarea>
      </section>
      <div class="controle">
        <span @click="translateto('cn')">English to Chinese</span><i></i><span @click="translateto('en')">中文转换英文</span>
      </div>
      <section>
        <div class="textarea"><span>{{getvalue}}</span><i v-show="getvalue" @click="voice()" class="iconfont icon-shengyin"></i></div>
      </section>
      <div id="box" v-html="nhtml">

      </div>
      <alert v-if="showAlert"  @closeTip="close" :alertText="alertText" :suc="collectflag"></alert>
    </div>
  </section>
</template>

<script>

import headTop from '@/components/commen/header/head'
import alert from '@/components/commen/alert/alert'
import {Translate} from '@/service/getData'
import {getCookie} from '@/config/mUtils'

export default {
  name: 'translate',
  data () {
    return {
      titleName:'实时翻译',
      noneHome:true,
      value:'',
      getvalue:'',
      showAlert:false,
      alertText:null,
      collectflag:false,
      language:'zh',
      nhtml:''
    }
  },
  mounted(){

  },
  methods:{
    translateto(flag){
      this.language = flag;
      if(flag=='cn'){
        this.language = 'zh';
      }
      if(this.value){
        Translate(getCookie("USERToken"),flag,this.value).then((response)=>{
          if(response.data.Ret==0){
            this.getvalue = response.data.Txt
          }
        })
      }else{
        this.showAlert = true;
        if(flag=="en"){
          this.alertText = "请输入文字";
        }else{
          this.alertText = "Please enter a text";
        }

      }
    },
    close(){
      this.showAlert = false;
      this.alertText = "";
    },
    clearall(){
      this.value = '';
      this.getvalue = '';
      this.nhtml = '';
    },
    voice() {
      this.nhtml = "<audio  autoplay='autoplay' id='playstart'><source src='http://tts.baidu.com/text2audio?lan="+this.language+"&ie=UTF-8&spd=5&text="+encodeURI(this.getvalue)+"' type='audio/mpeg'></source></audio>";
      this.$nextTick(()=>{
        var playstart = document.getElementById("playstart")
        if(playstart.paused){
            playstart.play();
        }else{
            playstart.pause();
        }
      })
    }
  },
  components:{headTop,alert}
}
</script>

<style scoped lang="scss">
  @import '../../style/mixin';
  .clearscreen{
    position: absolute;
    right: 0.2rem;
    @include font-dpr(16px)
    color: #333;
    z-index: 200;
  }
  .translate{
      position: fixed;
      top: 0px;
      left: 0px;
      right: 0px;
      bottom: 0px;
      overflow: auto;-webkit-overflow-scrolling: touch;
      .box{
        padding-top: 1.093333rem;
        width:100%;
        height:100%;
        overflow: auto;
        section{
          @include wh(100%,4.0rem);
        }
      }
      .textarea{
        overflow-y:scroll;
        @include wh(100%,4.0rem);
        padding: 0 0.133333rem;
        @include font-dpr(14px);
        background:#fff;
        span{
          display:inline-block;
          line-height: 0.5rem;
          // height:100%;
        }
        i{margin-left: 10px;@include font-dpr(28px);vertical-align: middle;}
      }
      .controle{
        @include wh(100%,1.066667rem);
        line-height: 1.066667rem;
        display:flex;
        justify-content:space-between;
        align-items:center;
        margin:0.133333rem 0;
        span{
          display:block;
          width:4.3rem;
          text-align: center;
          color: #ff9002;
          border: 1px solid $ict;
          border-radius: 0.133333rem;
          @include font-dpr(13px);
          background:#fff;
          margin:0 0.133333rem
        }
        i{
          @include wh(1.066667rem,1.066667rem);
          background:url('../../assets/img/zz.png')no-repeat center center;
          background-size: 50%
        }
      }
  }
</style>
