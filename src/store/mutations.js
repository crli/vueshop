import {
	GET_USERINFO,
  RECORD_USERINFO_Token,
  RECORD_USERINFO,
  ADD_BANCARD,
  GET_BANCARD,
  GET_ADDRESS,
  ADD_ADDRESS,
  SET_REGPHONE,
  OUT_LOGIN,
  SET_LOG_AND_LAT,
  GET_TICKTS,
  CHANGE_USERINFOR,
  SAVE_NEWS_COM,
  ADD_NEWS_COM,
  SET_COUNTRY,
  SET_MSG,

} from './mutation-types.js'

import {setCookie,removeStore,delCookie,setStore} from '../config/mUtils'

export default {
  // 记录用户Token
  [RECORD_USERINFO_Token](state,token){
    setCookie("USERToken",token,7)
  },
  // 记录用户信息
  [RECORD_USERINFO](state, info) {
    state.userInfo = info;
    // state.login = true;
  },
	//获取用户信息
	[GET_USERINFO](state, info) {
    if (state.userInfo && (state.userInfo.AccountName !== info.AccountName   )) {
      return;
    };

    if (info&&!info.Msg) {
      state.userInfo = info;
      state.login = true;
    } else {
      state.userInfo = null;
    }
	},

  //退出登录
  [OUT_LOGIN](state) {
    state.userInfo = null;
    // state.login = false;
    removeStore("UWUSER")
    delCookie("USERToken")
  },
  //获得银行列表
  [GET_BANCARD](state, newBancard) {
    state.bancard = newBancard
  },
  //增加银行卡
  [ADD_BANCARD](state, obj) {
    state.bancard = [...state.bancard, obj];
  },
  //获得地址列表
  [GET_ADDRESS](state, newAddress) {
    state.address = newAddress
  },
  //增加地址
  [ADD_ADDRESS](state, obj) {
    state.address.Items = [...state.address.Items, obj];
  },
  //验证是否可以重设密码
  [SET_REGPHONE](state,phone){
    state.regtelephone = phone
  },
  //存储经纬度
  [SET_LOG_AND_LAT](state,obj){
    state.longitude = obj.longitude;
    state.latitude = obj.latitude;
  },
  [GET_TICKTS](state,obj){
    state.tickets = obj;
  },
  [CHANGE_USERINFOR](state,obj){
    state.userInfo = Object.assign({}, state.userInfo, obj)
    setStore("UWUSER",state.userInfo)
  },
  //存储评论列表
  [SAVE_NEWS_COM](state,comment){
    state.newslist = comment;
  },
  //添加评论
  [ADD_NEWS_COM](state,comment){
    state.newslist.unshift(comment);
  },
  //设置城市
  [SET_COUNTRY](state,country){
    state.country = country
  },
  //存储消息
  [SET_MSG](state,obj){
    state.message = obj
  },
}
