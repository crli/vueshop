import Vue from 'vue'
import store from '../store'
import router from '../router'
import axios from 'axios'
import {getCookie} from './mUtils'
import {OUT_LOGIN} from '@/store/mutation-types.js'
import { Indicator } from 'mint-ui';
import { Toast } from 'mint-ui';
axios.defaults.timeout = 30000;
// http request 拦截器
axios.interceptors.request.use(
    config => {
    //如果登录状态非如下接口
      let joggle = [
        "DelFavorites",
        "UserCartToOrder",
        "AddToFavorites",
        "AddToUserCart",
        "UserLikeNewsComment",
        "NewsComment",
        "PartnerIssues",
        "UserCouponRefund",
        "UserOrderRefund",
        "CreateTeamComment",
        "ModifyMobile",
        "ModifyPassword",
        "DelCartItem",
        "OrderPay"
      ];
      let loginjoggle = [
        "UserRegistration",
        "FindPassword"
      ];
      if (getCookie("USERToken")) {

          if(joggle.every((ele)=>{
            return config.url.indexOf(ele)<0
          })){
            Indicator.open({
              text: '加载中...',
              spinnerType: 'fading-circle'
            });
          }
      }else{
        if(loginjoggle.every((ele)=>{
            return config.url.indexOf(ele)<0
          })){
            Indicator.open({
              text: '加载中...',
              spinnerType: 'fading-circle'
            });
          }
      }
      return config;

    },
    err => {
      Indicator.close();
      Toast({
        message: '加载超时',
        position: 'middle',
        duration: 3000
      });
      return Promise.reject(err);
    });

// http response 拦截器
axios.interceptors.response.use(
    response => {
      let timetp = null;
      let timeerr = null;
      let timeredirect = null;
      if(router.currentRoute.path == '/team'||router.currentRoute.path == '/partner'){
        clearTimeout(timetp);
        timetp = setTimeout(()=>{
          Indicator.close();
          clearTimeout(timetp);
        },500)
      }else{
        clearTimeout(timetp);
        timetp = setTimeout(()=>{
          Indicator.close();
          clearTimeout(timetp);
        },300)
      }
      if(response.data.Ret == 1001){
        store.commit(OUT_LOGIN);
        clearTimeout(timeerr);
        timeerr = setTimeout(()=>{
          Toast({
            message: response.data.Msg,
            position: 'middle',
            duration: 1300
          });
          clearTimeout(timeerr)
        }, 1200)
        timeredirect = setTimeout(()=>{
          router.push('/login?redirect='+router.currentRoute.fullPath)

          clearTimeout(timeredirect)
        }, 2500)

      }else if(response.data.Ret >1002){
        clearTimeout(timeerr);
        timeerr = setTimeout(()=>{
          Toast({
            message: response.data.Msg,
            position: 'middle',
            duration: 2000
          });
          clearTimeout(timeerr)
        }, 1200)
      }else{

        return response;
      }

    },
    error => {
      if (error.response) {
        let errortime = null;
        if(error.response.status == 1001||error.response.status == 1002){
          store.commit(OUT_LOGIN);
          router.push('/login?redirect='+router.currentRoute.fullPath)
        }

        if(error.response.status == 500){
          clearTimeout(errortime);
          errortime = setTimeout(()=>{
            Toast({
              message: "服务器错误",
              position: 'middle',
              duration: 2000
            });
            clearTimeout(errortime)
          }, 0)
        }
    }
    Indicator.close();
    return Promise.reject(error)
});
Vue.prototype.$ajax = axios;

