<template>
  <section class="checkwx">

  </section>
</template>

<script>

import {setCookie,getCookie} from '@/config/mUtils'
import {mapMutations} from 'vuex'
import {GetWxOpenid,GetWxOpenidStart} from '@/service/getData'
export default {
  name: 'checkwx',
  data () {
    return {

    }
  },
  created(){
    // let Token = this.$route.query.Token;
    // let url = this.$route.query.url;
    // // setCookie("USERToken",Token,7)
    // // if(getCookie("USERToken")){
    // //   this.$router.push(url)
    // // }
    // let openid = this.$route.query.openid;
    // GetWxOpenid(openid).then((response)=>{
    //   if(!response.data.Ret){
    //     if(response.data.openid!== openid){
    //       this.outlogin()
    //     }else{
    //       setCookie("USERToken",Token,7)
    //       if(getCookie("USERToken")){
    //         this.$router.push(url)
    //       }
    //     }
    //   }else{
    //     this.outlogin()
    //   }
    // })
    let wxopenid = getCookie('wxopenid');
    let code = this.$route.query.code;
    console.log(code);
    if (wxopenid==""){
       if (code==null){
           var fromurl = 'http://m.uworldusa.com/#/checkwx';
           var url='https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx36c997a4e1efc927&redirect_uri='+encodeURIComponent(fromurl)+'&response_type=code&scope=snsapi_base&state=STATE%23wechat_redirect&connect_redirect=1#wechat_redirect';
           console.log(11);
           location.href=url;
           console.log(22);
       }else{
        console.log(33)
          GetWxOpenidStart(code).then((response)=>{
            console.log(response.data)
          })
       }
    }
  },
  methods:{
    ...mapMutations([
      'OUT_LOGIN'
    ]),
    outlogin(){
      this.OUT_LOGIN();
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped lang="scss">

</style>
