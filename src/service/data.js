import * as home from './data/home'
import * as discovery from './data/discovery'
import * as cart from './data/cart'
/**
 * 以下是临时数据
 */
const getpromise = data => {
  return new Promise((resolve, reject) => {
    resolve(data)
  })
}
// 获得用户信息
export const getUser = () => getpromise(home.getUser)

//获取版本信息
export const getHomeVersion = () => getpromise(home.getHomeVersion)

//首页猜你喜欢
export const getYouLike = () => getpromise(home.GetYouLike)

//获取首页内容
export const getHomeData = () => getpromise(home.getHomeData)

//获取附近页头部筛选条件
export const getNearTitle = () => getpromise(discovery.getNearTitle)

//热门搜索
export const getHotkeyWords = () => getpromise(discovery.getHotkeyWords)

//获取商家及团单列表~
export const getPartnerTeamList = (id) => getpromise(discovery.getPartnerTeamList+id)

//获取用户购物车数据
export const GetUserCartDataSource =  () => getpromise(cart.GetUserCartDataSource)

//添加进购物车
export const AddToUserCart =  () => getpromise(cart.AddToUserCart)

//删除购物车团单
export const DelCartItem = () => getpromise(cart.DelCartItem)

//签到
export const GetUserSignDays0 = () => getpromise()

//签到只获取状态
export const GetUserSignDays1 = () => getpromise(admin.GetUserSignDays1)

//获取团单列表（附近）头部查询条件
export const getTeamListHeader = () => getpromise(category.getTeamListHeader)

//获取新闻列表（商圈头条等）
export const GetNewsList = () => getpromise(category.GetNewsList)









//获取团单详情~
export const getTeamInfo = () => getpromise()

//获取商家详情
export const getPartnerInfo = () => getpromise()

//获取商家所有团单
export const getPartnerItems = () => getpromise()

//获取商家服务项目，包括推荐菜等
export const getPartnerTeams = () => getpromise()

//获取团单评论列表~
export const getTeamCommentList = () => getpromise()

//获取某团单（或商家）的评论标签
export const GetTeamCommentTagList = () => getpromise()

//购物车到订单
export const UserCartToOrder = () => getpromise()

//团单直接加入订单(立即购买、再来一单)
export const TeamToOrder = () => getpromise()

//支付信息
export const GetOrdersByPackageid = () => getpromise()

//支付提交
export const OrderPay = () => getpromise()

//充值
export const UserRecharge = () => getpromise()

//wx
export const GetWxOpenid = () => getpromise()

//wxop
export const GetWxOpenidStart = () => getpromise()

//支付宝
export const WapAliPay = () => getpromise()

//WebView
export const WebView = () => getpromise()

//本单详情
export const getOneTeamCont = () => getpromise()

//收藏
export const AddToFavorites = () => getpromise()

//删除收藏夹内容
export const DelFavorites = () => getpromise()

//收藏夹所有团单列表
export const FavTeamList = () => getpromise()

//根据输入关键字获取相关团单
export const GetTeamListByKeyworld = () => getpromise()

//wx支付
export const WapWxPay = () => getpromise()

// 获取手机验证码
export const getVerCode = () => getpromise()

//找回验证
export const checkVerCode = () => getpromise()

//登录
export const userLogin = () => getpromise()

//注册
export const userRegistration = () => getpromise()

//找回密码
export const FindPassword = () => getpromise()

//找回设置密码
export const ModifyPassword = () => getpromise()

//更换手机号
export const modifyMobile = () => getpromise()

//获取用户银行卡列表
export const getUserBankCardList = () => getpromise()

// 删除银行卡
export const delBankCard = () => getpromise()

// 添加银行卡
export const addBankCard = () => getpromise()

//获取用户收货地址列表
export const getUserAddressList = () =>getpromise()
//添加/修改/设默认 收货地址
export const addNewAddress = () => getpromise()

//删除 收货地址
export const deleteAddress = () => getpromise()

//上传图片
export const userUploadAtt = () => getpromise()

//获取个人定单
export const getUserOrders = () => getpromise()

//删除未付款订单
export const delUserNoPayOrders = () =>getpromise()

//提交团单评论
export const createTeamComment = () => getpromise()

//获取评论标签列表
export const getCommentTagsList = () => getpromise()

//获得券列表
export const getUserCouponList = () => getpromise()

//由我券退款
export const UserCouponRefund = () => getpromise()

//由我券原因列表
export const GetRefundReason = () => getpromise()

//获取由我券退款详细信息
export const GetRefundInfo = () =>getpromise()

//订单详情
export const GetOrderDetail = () => getpromise()

//团单退款
export const UserOrderRefund = () =>getpromise()

//获取团单所有门店~
export const GetTeamOtherStore = () => getpromise()


//获取附近页头部筛选条件
export const getNearTitle = () => getpromise()

//获取一张由我券信息
export const GetCouponInfo = () => getpromise()

//提交订单意见/反馈/举报
export const PartnerIssues = () =>getpromise()

//修改个人资料
export const UpdateUserInfo = () => getpromise()

export const CashFlow = () => getpromise()

//用户为新闻或评论点赞
export const UserLikeNewsComment = () => getpromise()

//获取新闻评论列表
export const getNewsCommentList = () =>getpromise()

//【头条】获取最新为您推荐数量
export const getNewHeadLineNum = () => getpromise()

//新闻评论
export const NewsComment = () => getpromise()

//翻译
export const Translate = () => getpromise()

//用户设置
export const UserSettings = () => getpromise()

//获取用户设置
export const GetUserSettings = () => getpromise()

//获取用户所在国家
export const GetUserCountry = () => getpromise()

//用户消息中心
export const UserMsgCenter = () => getpromise()

//消息提醒设置
export const MsgNoticeSetting = () => getpromise()

//用户消息列表
export const UserMsgList = () =>getpromise()


