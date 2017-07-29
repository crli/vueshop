import Vue from 'vue'
import {
  getUser,getUserBankCardList,getUserAddressList,getUserCouponList
} from '../service/getData'
import {
  GET_USERINFO,GET_BANCARD,GET_ADDRESS,GET_TICKTS
} from './mutation-types.js'
import {baseUrl} from '../config/env'
import {getCookie} from '@/config/mUtils'
export default {
  getUserInfo({commit,state}) {
    let Token = getCookie("USERToken")
    getUser(Token).then((response) => {
      if(response&&response.data){
        commit(GET_USERINFO,response.data)
      }
    })
  },
  getBancard({commit,state}){
    getUserBankCardList(getCookie("USERToken")).then((response)=>{
      commit(GET_BANCARD, response.data);
    })
  },
  getAddress({commit,state}){
    getUserAddressList(getCookie("USERToken")).then((response)=>{
      commit(GET_ADDRESS, response.data);
    })
  },
  getUserCouponList({commit},OrderId){
    getUserCouponList(getCookie("USERToken"),OrderId).then((response)=>{
      commit(GET_TICKTS, response.data);
    })
  }
}
