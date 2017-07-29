import Vue from 'vue'
import Vuex from 'vuex'

import mutations from './mutations'
import actions from './action'
import getters from './getters'

Vue.use(Vuex)

const state = {
  userInfo: null, //用户信息
  // login: false,//是否登陆
  bancard:'',//银行列表
  address:'',//地址列表
  regtelephone:null,//验证的手机号
  commentbox:{},//评论相关
  longitude:'',//经度
  latitude:'',//纬度
  tickets:{},//券
  newslist:[],//新闻评论
  country:'CN',//默认地图
  message:'',//单个站内信
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
