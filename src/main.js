import Vue from 'vue'
import App from './App'
import router from './router/'
import store from './store/'
import './config/http'
import './config/flexible'
import './config/fastclick'
// import VueLazyload from 'vue-lazyload'
// import loadingImg from './assets/img/loading.gif'
// import errorImg from './assets/img/error.jpg'
import 'mint-ui/lib/style.css'
import ElLoading from 'element-loading'
// import 'element-theme-default/dist/loading.css'
Vue.use(ElLoading)
// Vue.use(VueLazyload, {
//   preLoad: 1.3,
//   error: errorImg,
//   loading: loadingImg,
//   attempt: 3
// })
if ('addEventListener' in document) {
  document.addEventListener('DOMContentLoaded', function() {
    FastClick.attach(document.body);
  }, false);
}
Number.prototype.retoFixed=function(len){
    var add = 0;
    var s,temp;
    var s1 = this + "";
    var start = s1.indexOf(".");
    if(s1.substr(start+len+1,1)>=5)add=1;
    var temp = Math.pow(10,len);
    s = Math.floor(this * temp) + add;
    return s/temp;
}

Vue.prototype.changedollor = function (value) {
  let flag =  window.localStorage.getItem("DOLLORFLAG");
  let rate =  window.localStorage.getItem("EXCHANGERATE");
  if(flag&&typeof flag == 'string'&&flag.length==1){
    if(flag == "d"){
      return value
    }else if(flag == "c"){
      return parseFloat(value*rate).retoFixed(2)
    }
  }else{
    window.localStorage.setItem("DOLLORFLAG","d");
    return value
  }

}
Vue.prototype.changedollorflag = function () {
  let flag =  window.localStorage.getItem("DOLLORFLAG");
  if(flag&&typeof flag == 'string'&&flag.length==1){
    if(flag == "d"){
      return "$"
    }else if(flag == "c"){
      return "￥"
    }
  }else{
    window.localStorage.setItem("DOLLORFLAG","d");
    return "$"
  }

}
window.onload=function () {
    document.addEventListener('touchstart',function (event) {
        if(event.touches.length>1){
            event.preventDefault();
        }
    })
    var lastTouchEnd=0;
    document.addEventListener('touchend',function (event) {
        var now=(new Date()).getTime();
        if(now-lastTouchEnd<=300){
            event.preventDefault();
        }
        lastTouchEnd=now;
    },false)
}

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})

