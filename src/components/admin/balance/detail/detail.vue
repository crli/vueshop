<template>
  <div class="wrap">
    <headTop :noneHome="noneHome" :headTitle="titleName"></headTop>
    <div class="box">
      <div class="discover-list" v-infinite-scroll="loadMore" id="discover-list" infinite-scroll-disabled="busy" infinite-scroll-distance="20">
        <div class="item" v-for="item in teamlist">
          <div class="left">
            <p>{{item.Type}}</p>
            <p>{{item.Time}}</p>
          </div>
          <div class="right">{{item.Money}}</div>
        </div>
        <footer class="loader-more" v-show="!loadernone">正在加载更多...</footer>
        <footer class="loader-none" v-show="loadernone">已经全部加载完毕</footer>
      </div>
    </div>
  </div>
</template>

<script>
import headTop from '@/components/commen/header/head'
import {CashFlow} from '@/service/getData'
import infiniteScroll from 'vue-infinite-scroll'
import {getCookie} from '@/config/mUtils'
export default {
  name: 'detail',
  data () {
    return {
      titleName:'余额明细',
      noneHome:true,
      busy: false,
      loadernone:false,//没有数据提示
      page:1,
      teamlist:[]
    }
  },
  components:{headTop},
  mounted(){

  },
  directives: {infiniteScroll},
  methods:{
    /**
     * [loadMore 无限加载]
     * @return {[type]} [description]
     */
    loadMore() {
      //防止重复请求
      this.busy = true;
      this.loadernone = false;
      CashFlow(getCookie("USERToken"),this.page,20).then((response)=>{
        if(response.data.length){
          this.initStart(response.data)
          if (response.data.length < 20) {
            this.loadernone = true;
            return
          }
        }else{
          this.loadernone = true;
          return
        }
        this.busy = false;
      })

    },
    initStart(data){
      this.page++;
      this.teamlist = [...this.teamlist, ...data];
    }
  }
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
    z-index: 0;
    background:#eee;
    overflow: auto;
    .box{
      padding-top: 1.093333rem;
      width:100%;
      height:100%;
      overflow: auto;
    -webkit-overflow-scrolling: touch;
    }
    .discover-list{
      background:#fff;
    }
    .item{
      display:flex;
      align-items:center;
      justify-content:space-between;
      padding: 0.266667rem;
      border-bottom: 1px solid #eee;
      p{line-height: 0.586667rem}
    }
  }

</style>
