import Vue from 'vue'
import Router from 'vue-router'
import App from '../App'
import {getCookie} from '@/config/mUtils'
if (process.env.NODE_ENV !== 'production') {
  var home = require('@/components/home/home')
  var city = require('@/components/home/city/city')
  var discovery = require('@/components/discovery/discovery')
  var cart = require('@/components/cart/cart')
  var pay = require('@/components/pay/pay')
  var hot = require('@/components/hot/hot')

  var search = require('@/components/commen/search/search')
  var searchlist = require('@/components/searchlist/searchlist')
  var category = require('@/components/category/category')
  var subCategory = require('@/components/category/subCategory/subCategory')
  var news = require('@/components/news/news')
  var newslist = require('@/components/newslist/newslist')
  var newsdetail = require('@/components/newslist/newsdetail/newsdetail')
  var newscomment = require('@/components/newslist/newsdetail/newscomment/newscomment')
  var team = require('@/components/team/team')
  var teamdetail = require('@/components/team/teamdetail/teamdetail')
  var otherpartner = require('@/components/team/otherpartner/otherpartner')
  var allcomment = require('@/components/commen/allcomment/allcomment')
  var partner = require('@/components/partner/partner')
  var map = require('@/components/commen/map/map')
  var baidumap = require('@/components/commen/baidumap/baidumap')
  var translate = require('@/components/translate/translate')
  var strategy = require('@/components/strategy/strategy')
  var strategydetail = require('@/components/strategy/strategydetail/strategydetail')
  var message = require('@/components/message/message')
  var setmessage = require('@/components/message/setmessage/setmessage')
  var messagelist = require('@/components/message/messagelist/messagelist')
  var messagedetail = require('@/components/message/messagelist/messagedetail/messagedetail')

  var login = require('@/components/login/login')
  var findpassword = require('@/components/findpassword/findpassword')
  var setPassword = require('@/components/findpassword/setPassword/setPassword')

  var admin = require('@/components/admin/admin')
  var collect = require('@/components/admin/collect/collect')
  var order = require('@/components/order/order')
  var comment = require('@/components/order/comment/comment')
  var orderDetail = require('@/components/order/orderDetail/orderDetail')
  var orderRefund = require('@/components/order/orderDetail/orderRefund/orderRefund')
  var orderProgress = require('@/components/order/orderDetail/orderProgress/orderProgress')

  var bankCard = require('@/components/admin/bankCard/bankCard')
  var addCard = require('@/components/admin/bankCard/addCard/addCard')
  var changeCard = require('@/components/admin/bankCard/changeCard/changeCard')

  var address = require('@/components/admin/address/address')
  var addAddress = require('@/components/admin/address/addAddress/addAddress')
  var changeAddress = require('@/components/admin/address/changeAddress/changeAddress')

  var balance = require('@/components/admin/balance/balance')
  var explain = require('@/components/admin/balance/explain/explain')
  var recharge = require('@/components/admin/balance/recharge/recharge')
  var detail = require('@/components/admin/balance/detail/detail')

  var setUp = require('@/components/admin/setUp/setUp')
  var personalData = require('@/components/admin/setUp/personalData/personalData')
  var changeName = require('@/components/admin/setUp/personalData/changeName/changeName')
  var acountManage = require('@/components/admin/setUp/acountManage/acountManage')
  var currency = require('@/components/admin/setUp/currency/currency')
  var retel = require('@/components/admin/setUp/acountManage/retel/retel')
  var remail = require('@/components/admin/setUp/acountManage/remail/remail')
  var repassworld = require('@/components/admin/setUp/acountManage/repassworld/repassworld')

  var feedback = require('@/components/admin/feedback/feedback')
  var ticket = require('@/components/admin/ticket/ticket')
  var refund = require('@/components/admin/ticket/refund/refund')
  var refDetails = require('@/components/admin/ticket/refund/refDetails/refDetails')
  var refDescription = require('@/components/admin/ticket/refund/refDetails/refDescription/refDescription')

  var cardholder = require('@/components/admin/cardholder/cardholder')
  var coupon = require('@/components/admin/coupon/coupon')
}
else{
  var home = r => require.ensure([], () => r(require('@/components/home/home')), 'home')
  var city = r => require.ensure([], () => r(require('@/components/home/city/city')), 'city')
  var discovery = r => require.ensure([], () => r(require('@/components/discovery/discovery')), 'discovery')
  var cart = r => require.ensure([], () => r(require('@/components/cart/cart')), 'cart')
  var pay = r => require.ensure([], () => r(require('@/components/pay/pay')), 'pay')
  var hot = r => require.ensure([], () => r(require('@/components/hot/hot')), 'hot')

  var search = r => require.ensure([], () => r(require('@/components/commen/search/search')), 'search')
  var searchlist = r => require.ensure([], () => r(require('@/components/searchlist/searchlist')), 'searchlist')
  var category = r => require.ensure([], () => r(require('@/components/category/category')), 'category')
  var subCategory = r => require.ensure([], () => r(require('@/components/category/subCategory/subCategory')), 'subCategory')
  var news = r => require.ensure([] , () => r(require('@/components/news/news')), 'news')
  var newslist = r => require.ensure([] , () => r(require('@/components/newslist/newslist')), 'newslist')
  var newsdetail = r => require.ensure([], () => r(require('@/components/newslist/newsdetail/newsdetail')), 'newsdetail')
  var newscomment = r => require.ensure([], () => r(require('@/components/newslist/newsdetail/newscomment/newscomment')), 'newscomment')
  var team = r => require.ensure([], () => r(require('@/components/team/team')), 'team')
  var teamdetail = r => require.ensure([], () => r(require('@/components/team/teamdetail/teamdetail')), 'teamdetail')
  var otherpartner = r => require.ensure([], () => r(require('@/components/team/otherpartner/otherpartner')), 'otherpartner')
  var allcomment = r => require.ensure([], () => r(require('@/components/commen/allcomment/allcomment')), 'allcomment')
  var partner = r => require.ensure([], () => r(require('@/components/partner/partner')), 'partner')
  var map = r => require.ensure([], () => r(require('@/components/commen/map/map')), 'map')
  var baidumap = r => require.ensure([], () => r(require('@/components/commen/baidumap/baidumap')), 'baidumap')
  var translate = r => require.ensure([] , () => r(require('@/components/translate/translate')), 'translate')
  var strategy = r => require.ensure([] , () => r(require('@/components/strategy/strategy')), 'strategy')
  var strategydetail = r => require.ensure([], () => r(require('@/components/strategy/strategydetail/strategydetail')), 'strategydetail')
  var message = r => require.ensure([] , () => r(require('@/components/message/message')), 'message')
  var setmessage = r => require.ensure([], () => r(require('@/components/message/setmessage/setmessage')), 'setmessage')
  var messagelist = r => require.ensure([], () => r(require('@/components/message/messagelist/messagelist')), 'messagelist')
  var messagedetail = r => require.ensure([], () => r(require('@/components/message/messagelist/messagedetail/messagedetail')), 'messagedetail')

  var login = r => require.ensure([], () => r(require('@/components/login/login')), 'login')
  var findpassword = r => require.ensure([], () => r(require('@/components/findpassword/findpassword')), 'findpassword')
  var setPassword = r => require.ensure([], () => r(require('@/components/findpassword/setPassword/setPassword')), 'setPassword')

  var admin = r => require.ensure([], () => r(require('@/components/admin/admin')), 'admin')
  var collect = r => require.ensure([], () => r(require('@/components/admin/collect/collect')), 'collect')
  var order = r => require.ensure([], () => r(require('@/components/order/order')), 'order')
  var comment = r => require.ensure([], () => r(require('@/components/order/comment/comment')), 'comment')
  var orderDetail = r => require.ensure([], () => r(require('@/components/order/orderDetail/orderDetail')), 'orderDetail')
  var orderRefund = r => require.ensure([], () => r(require('@/components/order/orderDetail/orderRefund/orderRefund')), 'orderRefund')
  var orderProgress = r => require.ensure([], () => r(require('@/components/order/orderDetail/orderProgress/orderProgress')), 'orderProgress')

  var bankCard = r => require.ensure([], () => r(require('@/components/admin/bankCard/bankCard')), 'bankCard')
  var addCard = r => require.ensure([], () => r(require('@/components/admin/bankCard/addCard/addCard')), 'addCard')
  var changeCard = r => require.ensure([], () => r(require('@/components/admin/bankCard/changeCard/changeCard')), 'changeCard')

  var address = r => require.ensure([], () => r(require('@/components/admin/address/address')), 'address')
  var addAddress = r => require.ensure([], () => r(require('@/components/admin/address/addAddress/addAddress')), 'addAddress')
  var changeAddress = r => require.ensure([], () => r(require('@/components/admin/address/changeAddress/changeAddress')), 'changeAddress')

  var balance = r => require.ensure([], () => r(require('@/components/admin/balance/balance')), 'balance')
  var explain = r => require.ensure([], () => r(require('@/components/admin/balance/explain/explain')), 'explain')
  var recharge = r => require.ensure([], () => r(require('@/components/admin/balance/recharge/recharge')), 'recharge')
  var detail = r => require.ensure([], () => r(require('@/components/admin/balance/detail/detail')), 'detail')

  var setUp = r => require.ensure([], () => r(require('@/components/admin/setUp/setUp')), 'setUp')
  var personalData = r => require.ensure([], () => r(require('@/components/admin/setUp/personalData/personalData')), 'personalData')
  var changeName = r => require.ensure([], () => r(require('@/components/admin/setUp/personalData/changeName/changeName')), 'changeName')
  var acountManage = r => require.ensure([], () => r(require('@/components/admin/setUp/acountManage/acountManage')), 'acountManage')
  var currency = r => require.ensure([], () => r(require('@/components/admin/setUp/currency/currency')), 'currency')
  var retel = r => require.ensure([], () => r(require('@/components/admin/setUp/acountManage/retel/retel')), 'retel')
  var remail = r => require.ensure([], () => r(require('@/components/admin/setUp/acountManage/remail/remail')), 'remail')
  var repassworld = r => require.ensure([], () => r(require('@/components/admin/setUp/acountManage/repassworld/repassworld')), 'repassworld')

  var feedback = r => require.ensure([], () => r(require('@/components/admin/feedback/feedback')), 'feedback')
  var ticket = r => require.ensure([], () => r(require('@/components/admin/ticket/ticket')), 'ticket')
  var refund = r => require.ensure([], () => r(require('@/components/admin/ticket/refund/refund')), 'refund')
  var refDetails = r => require.ensure([], () => r(require('@/components/admin/ticket/refund/refDetails/refDetails')), 'refDetails')
  var refDescription = r => require.ensure([], () => r(require('@/components/admin/ticket/refund/refDetails/refDescription/refDescription')), 'refDescription')

  var cardholder = r => require.ensure([], () => r(require('@/components/admin/cardholder/cardholder')), 'cardholder')
  var coupon = r => require.ensure([], () => r(require('@/components/admin/coupon/coupon')), 'coupon')

}

Vue.use(Router)

const routes = [
    {
      path: '/',
      component: App,
      children: [
      {
        path: '',
        redirect: '/home'
      },
      {
        path: 'search',
        component: search
      },
      {
        path: 'hot',
        component: hot
      },
      {
        path: 'searchlist',
        component: searchlist
      },
      {
        path: '/home',
        component: home,
        children:[
          {
            path:'city',
            component:city
          }
        ]
      },
      {
        path: '/translate',
        component: translate
      },
      {
        path: '/strategy',
        component: strategy,
        children:[
        {
          path:'strategydetail',
          component:strategydetail
        }
        ]
      },
      {
        path: '/message',
        component: message,
        children:[
          {
            path:'setmessage',
            component:setmessage
          },
          {
            path:'messagelist',
            component:messagelist,
            children:[
              {
                path:'messagedetail',
                component:messagedetail
              }
            ]
          },
        ]
      },
      {
        path: 'category',
        component: category,
        children:[
        {
          path:'subCategory',
          component:subCategory
        }
        ]
      },
      {
        path: 'news',
        component: news,
      },
      {
        path: '/newslist',
        component: newslist,
        children:[
        {
          path:'newsdetail',
          component:newsdetail,
          children:[
          {
            path:'newscomment',
            component:newscomment
          }
          ]
        }
        ]
      },
      {
        path: '/team',
        component: team,
        children:[
        {
          path:'teamdetail',
          component:teamdetail
        },
        {
          path:'allcomment',
          component:allcomment
        },
        {
          path:'otherpartner',
          component:otherpartner
        }
        ]
      },
      {
        path: '/partner',
        component: partner,
        children:[
        {
          path:'allcomment',
          component:allcomment
        },
        {
          path:'map',
          component:map
        },
        {
          path:'baidumap',
          component:baidumap
        }
        ]
      },
      {
        path: '/discovery',
        component: discovery
      },
      {
        path: '/cart',
        component: cart,
        meta: {
            requireAuth: true,
        }
      },
      {
        path: '/pay',
        component: pay
      },
      {
        path: '/admin',
        component: admin,
        meta: {
            requireAuth: true,
        },
        children:[
        {
          path:'ticket',
          component:ticket,
          children:[
          {
            path:'refund',
            component:refund,
            children:[
            {
              path:'refDetails',
              component:refDetails,
              children:[
              {
                path:'refDescription',
                component:refDescription,
              }
              ]
            }
            ]
          }
          ]
        },
        {
          path: 'coupon',
          component: coupon,
        },
        {
          path: 'cardholder',
          component: cardholder,
        },
        {
          path: 'feedback',
          component: feedback,
        },
        {
          path: 'setUp',
          component: setUp,
          children: [
          {
            path: 'personalData',
            component: personalData,
            children:[
            {
              path:'changeName',
              component:changeName
            }]
          },
          {
            path: 'acountManage',
            component: acountManage,
            children:[
            {
              path:'retel',
              component:retel,
            },
            {
              path:'remail',
              component:remail,
            },
            {
              path:'repassworld',
              component:repassworld,
            }
            ]
          },
          {
            path: 'currency',
            component: currency,
          }
          ]
        },
        ]
      },
      {
        path: '/order',
        component: order,
        children:[
        {
          path:'comment',
          component:comment,
        },
        {
          path:'orderDetail',
          component:orderDetail,
          children:[
          {
            path:'allcomment',
            component:allcomment
          },
          {
            path:'teamdetail',
            component:teamdetail
          },
          {
            path:'comment',
            component:comment,
          },
          {
            path:'orderRefund',
            component:orderRefund,
          },
          {
            path:'orderProgress',
            component:orderProgress,
            children:[
            {
              path:'refDescription',
              component:refDescription,
            }
            ]
          }
          ]
        },
        {
          path:'orderRefund',
          component:orderRefund,
        },
        {
          path:'orderProgress',
          component:orderProgress,
          children:[
          {
            path:'refDescription',
            component:refDescription,
          }
          ]
        }
        ]
      },
      {
        path:'collect',
        component: collect,
      },
      {
        path: 'bankCard',
        component: bankCard,
        children: [
        {
          path: 'addCard',
          component: addCard,
        },
        {
          path: 'changeCard',
          component: changeCard,
        }
        ]
      },
      {
        path: 'address',
        component: address,
        children: [
        {
          path: 'addAddress',
          component: addAddress,
        },
        {
          path: 'changeAddress',
          component: changeAddress,
        }
        ]
      },
      {
        path: 'balance',
        component: balance,
        children:[
        {
          path:'explain',
          component:explain,
        },
        {
          path:'recharge',
          component:recharge,
        },
        {
          path:'detail',
          component:detail,
        }]
      },


      {
        path: 'login',
        component: login
      },
      {
        path: 'findpassword',
        component: findpassword,
        children: [
        {
          path: 'setPassword',
          component: setPassword,
        }]
      }]
    }
];
const router =  new Router({
  routes: routes,
  mode: 'hash',
  strict: process.env.NODE_ENV !== 'production'
})
router.beforeEach((to, from, next) => {
  if (to.matched.some(r => r.meta.requireAuth)) {
      if (getCookie("USERToken")) {
          next();
      }
      else {
        next({
            path: '/login',
            query: {redirect: to.fullPath}
        })
      }
  }
  else {
    next();
  }
})
export default router;
