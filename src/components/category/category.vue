<template>
  <section class="category">
    <search class="head" ref="searchhead"v-show="this.$route.path=='/category'">
      <div class="head-back"slot="headback" @click="routerto"><i class="iconfont icon-back"></i></div>
    </search>
    <swiper :options="swiperOption" class="swiper-wrap" ref="swiperwrap"v-show="this.$route.path=='/category'">
      <swiper-slide v-for="(slide,index) in group" :key="index">
        <div class="box">
          <div class="item" @click="twoStage(item.id)" v-for="item in slide">
            <div class="img">
              <img :src="icoPath+item.id+'.png'"/>
            </div>
            <span class="ellipsis">{{item.name}}</span>
          </div>
        </div>
      </swiper-slide>
      <div class="swiper-pagination" slot="pagination"></div>
    </swiper>
    <div class="headline" ref="headline">
      <div class="img">
        <img src="../../assets/img/hadline.png" alt="" />
      </div>
      <div class="h-banner">
        <div class="h-bannerBox" ref="hbanner" @click="newsto">
            <ul ref="ul1">
              <li v-for="value in Newlist">
                <div class="left">
                  <p>{{value.Hits}}位用户光顾过此店</p>
                  <p>{{value.Cont}}</p>
                </div>
                <div class="right">
                  <img :src="value.Img" alt="" />
                </div>
              </li>
            </ul>
            <ul>
              <li v-for="value in Newlist">
                <div class="left">
                  <p>{{value.Hits}}位用户光顾过此店</p>
                  <p>{{value.Cont}}</p>
                </div>
                <div class="right">
                  <img :src="value.Img" alt="" />
                </div>
              </li>
            </ul>
        </div>
      </div>
    </div>
    <div class="hack-header" id="hack-header" v-show="hackheader">

    </div>
    <aside class="filter" id="filter-box" ref="filterbox" v-if="ListHeader.Category">
      <div class="filter-header" id="filter-pid">
        <a href="javascript:":class="{now:now==i}"  v-for="(v,i) in categoryInit"  @click="filterhead(i)">
          <span>{{v}}</span>
          <i class="iconfont icon-down"></i>
        </a>
      </div>

      <section class="filter-category filter-extend" :class="{open:now ==0}">
        <div class="filer-scroll">
          <ul>
            <li :class="{active:active==i}" v-for="(v,i) in ListHeader.Category"  @click.prevent="select(i,v.id)"><span class="name">{{v.name}}</span><span class="count">{{v.num}}</span><i class="iconfont icon-arrow-right"></i></li>
          </ul>
          <ul id="categoryChild">
            <li :class="{active:childactive==i}"v-for="(v,i) in categoryChild"  @click="selecttwo(v.id,v.name,v.pid,i)" ><span class="name">{{v.name}}</span><span class="count">{{v.num}}</span></li>
          </ul>
        </div>
      </section>
      <section class="filter-category filter-extend" :class="{open:now ==1}">
        <div class="filer-scroll">
          <ul>
            <li :class="{active:cityactive==i}" v-for="(v,i) in city.Child"  @click.prevent="selectCity(i,v.Id,v.Name)"><span class="name">{{v.Name}}</span><span class="count">{{v.Num}}</span><i class="iconfont icon-arrow-right"></i></li>
          </ul>
          <ul id="categoryChild">
            <li :class="{active:citychildactive==i}"v-for="(v,i) in citycategoryChild"  @click="selectCitytwo(i,v.Name,v.Id)" ><span class="name">{{v.Name}}</span><span class="count">{{v.Num}}</span></li>
          </ul>
        </div>
      </section>
      <section class="filter-orderby filter-extend" :class="{open:now ==2}">
        <ul>
          <li :class="{byactive:byactive==index}"v-for="(v,index) in ListHeader.Orderby" @click="orderbyselect(index,v.Title,v.Val)">{{v.Title}}</li>
        </ul>
      </section>
      <section class="filter-other filter-extend" :class="{open:now ==3}">
        <div class="filter-other-wrap">
          <div class="filter-other-form">
            <div v-for="(item,index) in this.ListHeader.Filter" class="item">
              <input type="checkbox" :id="item.Val" :value="item.Val" v-model="filterboxdata">
              <label :for="item.Val">{{item.Title}}</label>
            </div>
            <div class="subitem" @click="submitother()"><button>完成</button></div>
          </div>
          <filterItem v-for="(item,index) in allhave" :aData="item" :key="index" ref="filterItem" :time="Math.random()"></filterItem>
          <div class="filter-item">
            <div class="item-title">{{labelbottom.Title}}</div>
            <div class="item-box">
              <span @click="filterselect(index,v.Val,'price')" :class="{active:priceactive==index}" v-for="(v,index) in labelbottom.Cont">{{v.Title}}</span>
            </div>
          </div>
        </div>
      </section>
      <section class="filter-wrap" :class="{open:now !== -1}" @click.stop="hidewrap()" ></section>
    </aside>
    <div class="discover-list" ref="discoverlist" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="20">
      <section class="list-item" v-for="item in teamlist">
        <div class="top" @click ="routerpushPart(item.Pid)">
          <div class="img">
            <img :src="item.Img" alt="" />
          </div>
          <div class="cont ellipsis">
            <p class="title ellipsis">{{item.Title}}</p>
            <p><span class="star-pic">
              <i :style="'width:' + item.Star*20 + '%'"></i>
            </span></p>
            <p class="ellipsis">{{item.Category}}</p>
            <p class="money">
              <span>{{changedollorflag()}}<span>{{changedollor(item.Percapita)}}</span>/人</span>
              <span>{{item.Distance}}</span>
            </p>
          </div>
        </div>
        <div class="center"></div>
        <div class="bot">
          <div class="item ellipsis" v-for="value in item.Team" @click="routerpush(value.TeamId)">{{value.Title}}</div>
        </div>
      </section>
      <footer class="loader-more" v-show="!loadernone">正在加载更多</footer>
      <footer class="loader-none" v-show="loadernone">已经全部加载完毕</footer>
    </div>
    <transition name="router-slid">
        <router-view></router-view>
    </transition>

  </section>
</template>

<script>

  import search from '@/components/commen/search/search'
  import filterItem from '@/components/commen/filtergroup/filtergroup'
  import {getStore,setStore,getCookie} from '@/config/mUtils'
  import { swiper, swiperSlide } from 'vue-awesome-swiper'
  import infiniteScroll from 'vue-infinite-scroll'
  import {mapState,mapMutations} from 'vuex'
  import {getHomeData,getTeamListHeader,getPartnerTeamList,GetNewsList} from '@/service/getData'
  export default {
    name: 'category',
    data () {
      return {
        icoPath:'',//图标路径
        group:[],//二级分类分组分类轮播数据
        swiperOption: {
          pagination: '.swiper-pagination',
          paginationClickable: true,
          spaceBetween: 0,
          centeredSlides: true,
        },

        busy: true,
        loadernone:false,//没有数据提示
        ListHeader:{},//头部数据
        categoryInit:['全部分类','城市','综合榜','智能筛选'],//头部选项卡初始化

        now:-1,//头部选项卡与子分类切换
        categoryflag:true,//头部选项卡显隐切换
        num:"",//头部选项卡显隐变量

        active:0,//全部分类一级分类选项卡切换
        categoryChild:[],//二级分类选项卡数据
        childactive:0,//二级子分类选项卡切换

        cityactive:0,//城市分类切换
        citycategoryChild:[],//城市二级分类选项卡数据
        citychildactive:-1,//城市二级子分类选项卡切换

        byactive:0,//综合分类切换

        pid:0,//智能筛选标志默认全部
        labeltop:{},//智能筛选上数据
        labelbottom:{},//智能筛选下数据

        teamlist:[],//总团单数据

        parameter:{//
          group_id:'',//一级分类
          label:'',//二级分类ID
          tags:'',//智能筛选里的项目，字符串形式，id用“,”分隔
          filter:'',//智能筛选里上边勾选的项目
          areaid:'',//地区ID
          orderby:'',//排序方式
          longitude:'',
          latitude:'',
          page:1//默认1页
        },
        minclass:true,//首次加载设置最小高度
        newarrSting:'',
        city:[],//城市数据
        m:0,//滚动m距离fixed
        hackheader:false,//占位

        cityName:"",
        Newlist:[],//新闻列表
        dValue :{//新闻滚动控制
          speed : 20,
          liHeight : 24,
          delay : 1500,
          n : 6
        },
        movetime:null,
        bannerper:null,
        myScrolla:null,

        allhave:[],//其他筛选数据
        filterboxdata:[],//免预约之类筛选
        price:'',//价格筛选
        priceactive:0,
      }
    },
    created(){
      // 处理pid智能筛选及参数时候使用
      if(this.$route.query.pid){
        this.pid = parseInt(this.$route.query.pid);
        this.parameter.group_id = this.pid;
      }
      if(!this.longitude){
        this.getLocation();
      }else{
        this.parameter.longitude = this.longitude;
        this.parameter.latitude = this.latitude;
        this.loadMore()
      }
    },
    beforeMount(){
      // 获得轮播分类图标地址
      let datas = getStore("homeData");
      if(datas&&datas.match("^\{(.+:.+,*){1,}\}$")){
        this.icoPath = JSON.parse(getStore("homeData")).SubCategoryIcoPath
      }else{
        getHomeData().then((response) => {
          let homeData = response.data;
          this.icoPath = response.data.SubCategoryIcoPath;
          setStore("homeData",homeData)
        })
      }
    },

    async mounted(){
      window.addEventListener('scroll', this.handleScroll);//监听筛选栏位置
      this.bannerper = this.$refs.hbanner;
      setTimeout(this.move,this.dValue.delay);//商圈头条
      let response = await getTeamListHeader();
      this.ListHeader = response.data;
      this.city = this.ListHeader.City;
      // 处理分类数据增加pid,为智能筛选使用
      this.ListHeader.Category.forEach( (element, index) =>{
        if(element.child){
          element.child.forEach( (ele, i) =>{
            ele.pid = element.id
          })
        }
        this.categoryChild = this.ListHeader.Category[this.active].child;//展示二级分类
      })
      let initelement = this.ListHeader.Category.filter((ele,index)=>{
        return ele.id == this.pid
      })[0]
      this.swiperdata(initelement);
      this.citycategoryChild = this.city.Child[this.cityactive].Child
      // 处理智能筛选数据
      this.labelbottom = this.ListHeader.Tags.filter((ele,index)=>{
        return ele.Id == '0'
      })[0].List[0];

      response = await GetNewsList(getCookie("USERToken"),735,10,1,'','');
      this.Newlist = response.data
    },
    destroyed(){
      clearTimeout(this.myScrolla);
      clearInterval(this.movetime);
      window.removeEventListener('scroll', this.handleScroll);
    },
    directives: {infiniteScroll},
    methods:{
      ...mapMutations([
        'SET_LOG_AND_LAT'
      ]),

      /**
       * [swiperdata description]
       * @param  {[type]} 二级分类对象 [description]
       * @return {[type]}         [description]
       */
      swiperdata(element){
        let data = [];
        let arrbox = element.child.slice().filter((ele,index)=>{
          return ele.icoshow == "Y"
        });
        let groupData = arrbox;
        let num = Math.ceil(groupData.length/8);
        for(let n = 0; n<num;n++){
          data.push([]);
          for(let i=n*8;i<groupData.length;i++){
            data[n].push(groupData[i]);
            if(i%8==7){
                break;
            }
          }
        }
        // 分类轮播数据
        this.group = data;
      },
      newsto(){
        this.$router.push("/newslist?cateid=735")
      },
      move(){
        clearTimeout(this.myScrolla)
        this.bannerper.scrollTop++;
        this.movetime = setInterval(this.scrollup,this.dValue.speed);
      },
      scrollup(){
        if(this.bannerper.scrollTop % ((2*parseInt(document.documentElement.style.fontSize))) == 0){
            clearInterval(this.movetime);
            this.myScrolla = setTimeout(this.move,this.dValue.delay);
          }else{
            this.bannerper.scrollTop ++;
            if(this.bannerper.scrollTop >= this.$refs.ul1.offsetHeight){
              this.bannerper.scrollTop = 0;
            }
          }
      },
      /**
       * [filterhead 头部选项卡切换]
       * @param  {[type]} i [横向索引]
       * @return {[type]}   [description]
       */
      filterhead(i){
        // 分类页设置列表最小高度
        if(this.minclass){
          let obj = this.$refs.discoverlist;
          obj.className = obj.className+' '+'min';
          this.minclass = false
        }
        //头部选项卡显隐切换
        if(this.categoryflag){
          this.num = i;
          this.hidfalg = true;
          this.categoryflag = !this.categoryflag ;
        }else{

          this.categoryflag = !this.categoryflag
          // 如果横向直接切换
          if(this.num!=i){
            this.categoryflag = !this.categoryflag
            this.num = i;
          // 如果第二次单击同一选项
          }else{
            this.num = -1
          }
        }
        this.now = this.num;
        window.scrollTo(0,this.m);
      },

      /**
       * [select 一级分类选项卡切换]
       * @param  {[type]} i  [横向切换索引]
       * @param  {[type]} id [一级分类id]
       * @return {[type]}    [description]
       */
      select(i,id){
        this.active = i;
        // 二级分类选项卡数据
        if(i==0){
          this.parameter.group_id = id;
          this.parameter.label = '';

          this.allhave = [];
          this.initall();
          this.loadernone = false;
          getPartnerTeamList(this.parameter).then((response)=>{
            this.initStart(response.data)
            this.categoryInit.splice(0, 1, "全部分类")
            this.pid = 0;
            this.childactive = -1;
            if (response.data.length < 20) {
              this.loadernone = true;
              return
            }
            this.busy = false;
          })
          this.hidewrap()

        }
        this.categoryChild = this.ListHeader.Category[i].child;
      },

      /**
       * [init 初始化总团单数据]
       * @return {[type]} [description]
       */
      init(){
        this.parameter.page = 1;
        this.teamlist = [];
        this.parameter.longitude = this.longitude;
        this.parameter.latitude = this.latitude;
        this.loadernone = false;
        this.busy = true;
      },

      /**
       * [initall 初始化所有]
       * @return {[type]} [description]
       */
      initall(){
        this.init();
        this.parameter.filter = '';
        this.filterboxdata = [];
        this.price = '';
        this.priceactive = 0;
        this.parameter.tags = "";
      },
      /**
       * [Intelligent 初始化筛选]
       * @param {[type]} id  [一级id]
       * @param {[type]} pid [二级id]
       */
      Intelligent(id,pid){
        this.allhave = [];
        let pidarr = [];
        let idarr = [];
        if(id>0){
          idarr = this.ListHeader.Tags.filter((ele,index)=>{
            return ele.Id == id
          });
          if(idarr.length){
            this.allhave.push(idarr[0].List[0]);
          }
        }
        if(pid>0){
          pidarr = this.ListHeader.Tags.filter((ele,index)=>{
            return ele.Id == pid
          });
          if(pidarr.length){
            this.allhave.push(pidarr[0].List[0]);
          }
        }
      },
      /**
       * [selecttwo 分类选项卡二级分类]
       * @param  {[type]} id    [二级分类id]
       * @param  {[type]} name  [二级分类名字]
       * @param  {[type]} pid   [一级分类id]
       * @param  {[type]} index [一级分类pid下的二级分类索引]
       * @return {[type]}       [description]
       */
      selecttwo(id,name,pid,index){
        let nid = id;
        window.scrollTo(0,this.m)
        this.initall();
        this.Intelligent(id,pid);

        this.pid = pid;
        if(this.pid!=0){
          let element = this.ListHeader.Category.filter((ele,index)=>{
            return ele.id == this.pid
          })[0]
          this.swiperdata(element);
          this.$router.push("/category?pid="+this.pid)
        }

        this.parameter.group_id = pid;
        this.parameter.label = id;
        getPartnerTeamList(this.parameter).then((response)=>{
          this.initStart(response.data)
          if(nid == 0){
            switch (pid) {
              case '209':
                this.categoryInit.splice(0, 1, '嗨玩美国')
                break;
              case '210':
                this.categoryInit.splice(0, 1, '美食折扣')
                break;
              case '211':
                this.categoryInit.splice(0, 1, '美发个护')
                break;
              case '212':
                this.categoryInit.splice(0, 1, '生活家政')
                break;
            }
          }else{
            this.categoryInit.splice(0, 1, name)
          }

          this.childactive = index;
          if (response.data.length < 20) {
            this.loadernone = true;
            return
          }
          this.busy = false;
        })
        this.hidewrap()
      },

      /**
       * [selectCity 城市类选项卡一级切换]
       * @param  {[type]} i  [城市选项索引]
       * @param  {[type]} id  [城市选项索引]
       * @param  {[type]} name  [城市选项索引]
       * @return {[type]}    [description]
       */
      selectCity(i,id,name){
        this.cityactive = i;
        if(i==0){
          this.parameter.areaid = id;
          this.initall();
          this.loadernone = false;
          getPartnerTeamList(this.parameter).then((response)=>{
            this.initStart(response.data)
            this.categoryInit.splice(1, 1, "全部")
            this.citychildactive = -1;
            if (response.data.length < 20) {
              this.loadernone = true;
              return
            }
            this.busy = false;
          })
          this.hidewrap()

        }else{
          this.parameter.areaid = id;
          this.cityName = name;
          this.citychildactive = -1;
          this.citycategoryChild = this.city.Child[i].Child;
        }

      },
      selectCitytwo(i,city,value){
        window.scrollTo(0,this.m)
        this.init();
        // 如果全部则选上一级id
        if(i!=0){
          this.parameter.areaid = value;
        }
        getPartnerTeamList(this.parameter).then((response)=>{
          this.initStart(response.data)
          this.citychildactive = i;
          if(value == 0){
            this.categoryInit.splice(1, 1, this.cityName)
          }else{
            this.categoryInit.splice(1, 1, city)
          }

          if (response.data.length < 20) {
            this.loadernone = true;
            return
          }
          this.busy = false;
        })
        this.hidewrap()
      },
      /**
       * [orderbyselect 榜单类选项卡切换]
       * @param  {[type]} i     [榜单选项索引]
       * @param  {[type]} title [榜单名字]
       * @param  {[type]} value [榜单值]
       * @return {[type]}       [description]
       */
      orderbyselect(i,title,value){
        window.scrollTo(0,this.m)
        this.initall()
        this.parameter.orderby = value;
        getPartnerTeamList(this.parameter).then((response)=>{
          this.initStart(response.data)
          this.byactive = i;
          this.categoryInit.splice(2, 1, title)
          if (response.data.length < 20) {
            this.loadernone = true;
            return
          }
          this.busy = false;
        })
        this.hidewrap()
      },
      /**
       * [filterselect 智能筛选价格选项卡切换]
       * @param  {[type]} i     [选项索引]
       * @param  {[type]} value [选项值]
       * @return {[type]}       [description]
       */
      filterselect(i,value){
        this.priceactive = i;
        this.price = value;
      },
      /**
       * [hidewrap 遮罩层隐藏]
       * @return {[type]} [description]
       */
      hidewrap(){
        this.now = -1;
        this.num = -1;
      },
      /**
       * [initStart 处理列表数据]
       * @param  {[type]} data [新数据]
       * @return {[type]}      [description]
       */
      initStart(data){
        this.parameter.page++
        this.teamlist = [...this.teamlist, ...data];
      },
      /**
       * [getfilterdata 取筛选组建个数据]
       * @return {[type]} [包含所选择数据的数组]
       */
      getfilterdata(){
        let arr = [];

        if(this.$refs.filterItem){
          for(var item of this.$refs.filterItem){
            arr.push(item.dataMode)
          }
        }
        return arr;
      },
      /**
       * [filterinit 结合默认的价格筛选,过滤未选中以及全部选项]
       * @return {[type]} [description]
       */
      filterinit(){
        this.parameter.filter = this.filterboxdata.join(",");
        let narr = this.getfilterdata();
        narr.push(this.price);

        narr = narr.filter((ele,index)=>{
          return ele.length&&ele!=0
        })

        this.parameter.tags = narr.join(",")
      },

      /**
       * [submitother 智能筛选提交]
       * @return {[type]} [description]
       */
      submitother(){
        window.scrollTo(0,this.m)
        this.init()
        this.filterinit()
        getPartnerTeamList(this.parameter).then((response)=>{
          this.initStart(response.data)
          if (response.data.length < 20) {
            this.loadernone = true;
            return
          }
          this.busy = false;
        })
        this.hidewrap()
      },

      /**
       * [loadMore 无限加载]
       * @return {[type]} [description]
       */
      loadMore() {
        //防止重复请求
        this.busy = true;
        this.loadernone = false;
        getPartnerTeamList(this.parameter).then((response)=>{
          if(response.data.length){
            this.initStart(response.data)
            if (response.data.length < 20) {
              this.busy = true;
              this.loadernone = true;
              return
            }
          }else{
            this.busy = true;
            this.loadernone = true;
            return
          }
          this.busy = false;
        })

      },
      /**
       * [routerpush 去商品详情页]
       * @param  {[type]} id [团单id]
       * @return {[type]}    [description]
       */
      routerpush(id){
        this.$router.push("/team?id="+id+"&type=t")
      },
      /**
       * [routerpushPart 去商家详情页]
       * @param  {[type]} pid [商家pid]
       * @return {[type]}    [description]
       */
      routerpushPart(pid){
        this.$router.push("/partner?id="+pid+"&type=p")
      },
      /**
       * [getLocation 获得经纬度存入vuex]
       * @return {[type]} [description]
       */
      getLocation(){
        if (navigator.geolocation){
          navigator.geolocation.getCurrentPosition((position)=>{
            let lat = position.coords.latitude.toFixed(7);
            let lng = position.coords.longitude.toFixed(7);
            this.SET_LOG_AND_LAT({longitude:lat,latitude:lng});
            this.parameter.longitude = this.longitude;
            this.parameter.latitude = this.latitude;
            this.loadMore()
          },(error)=>{
            this.loadMore()
          });
        }
      },
      /**
       * [twoStage 去二级分类页]
       * @param  {[type]} id [二级分类id]
       * @return {[type]}    [description]
       */
      twoStage(id){
        this.$router.push("category/subCategory?pid="+this.pid+"&id="+id+"")
      },
      handleScroll () {
        if(this.$refs.filterbox){
          if(document.body.scrollTop >= this.m){
            this.$refs.filterbox.setAttribute("class","filter hidcat")
            this.hackheader = true;
          }else{
            this.$refs.filterbox.setAttribute("class","filter")
            this.hackheader = false;
          }
        }

      },
      routerto(){
        if(this.$route.path=='/category'){
          this.$router.push('/home')
        }
      }
    },

    computed:{
      ...mapState([
        'longitude','latitude'
      ])
    },
    watch: {
      group: function (value){
          if (value.length) {
              this.$nextTick(() => {
                  let swiperh = parseFloat(this.$refs.swiperwrap.$el.clientHeight);
                  let headlineh = parseFloat(this.$refs.headline.clientHeight);
                  let searchh = parseFloat(this.$refs.searchhead.$el.clientHeight);
                  this.m = swiperh + headlineh - searchh;
              })
          }
        }
    },
    components:{search,swiper, swiperSlide,filterItem}
  }
</script>

<style scoped lang="scss">
  @import '../../style/mixin';
  .head{position: fixed;
    z-index: 3;
    left: 0;
    top: 0;
    width:100%
  }
  .min{
    min-height: 14rem;
  }
  .swiper-wrap{
    padding:1.36rem 0 1.36rem 0;
    @include wh(100%,5.76rem);
    background:#fff;
    border-bottom: 1px solid #eee;
    .box{
      display: flex;
      flex-flow:wrap;
      height:100%;
      .item{
        width:25%;
        text-align: center;
      }
      img{
        margin-top: .2rem;
        @include wh(1.066667rem,1.066667rem);

      }
      span{@include font-dpr(13px);}
    }
    .swiper-pagination{
      bottom:1px;
    }
  }
  .headline{
    @include wh(100%,2rem);
    background:#fff;
    // border-bottom: 1px solid #eee;
    display:flex;
    padding:0 0.266667rem;
    align-items:center;
    .img{
      @include wh(0.866667rem,0.893333rem);
      img{
        @include wh(0.866667rem,0.893333rem);
      }
    }
    .h-banner{
      flex:1;
      height:100%;
      margin-left: 0.266667rem;
      .h-bannerBox{
        @include wh(100%,2rem)
        overflow: hidden;
        li{
          display:flex;
        justify-content:space-between;@include wh(100%,2rem)
        }

        .left{
          width:5.2rem;
          padding:0.4rem 0;
          p{line-height: .6rem;@include ellipsis(1);}
        }
        .right{
          position: relative;
          width:1.6rem;
          img{
            @include wh(1.6rem,1.6rem);
            @include ct;
          }

        }
      }
    }

  }
  .filter{
    position: relative;
    margin:0.426667rem 0;
    @include wh(100%,1.146667rem);
    .filter-header{
      @include wh(100%,1.146667rem);
      line-height: 1.146667rem;
      border-bottom: 0.013333rem solid #eee;
      display:flex;
      background:#fff;
      position: absolute;
      z-index: 0;
      a{
        width:25%;text-align: center;height: 1.14667rem;
        span{
          @include font-dpr(14px);
          display:inline-block;
        }
        i{@include font-dpr(11px);display:inline-block;vertical-align: top}
        &:first-child{
          span{
            max-width: 2rem;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
          }
        }
        &:nth-child(2){
          span{
            max-width: 2rem;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
          }
        }
      }
    }

    .filter-extend{
      left: 0;
      right: 0;
      top: 100%;
      position: absolute;
      max-height: 0;
      background-color: #fff;
      transition: all .2s ease-in-out;
      visibility: hidden;
      overflow: auto;
      opacity: 0;
      z-index: 3;
      box-shadow:1px 2px 2px #ccc;
      &.open{
        opacity: 1;
        visibility: visible;
        max-height: 1000%;
      }

    }
    .filter-category{
      height: 1000%;
      .filer-scroll{
        height:100%;
        display:flex;
      }
      ul{
        flex:1;
        list-style: none;
        -webkit-overflow-scrolling: touch;
        overflow:auto;
        li{
          padding:0 0.2rem 0 0.3rem;
          @include font-dpr(13px);
          line-height: 1.04rem;
          position: relative;
        }
        .count{
          position: absolute;
          right: 0.7rem;
          line-height: 0.373333rem;
          top: 50%;
          margin-top: -0.186667rem;
          border-radius: 0.266667rem;
          color: #fff;
          background-color: #ccc;
          padding: 0 0.133333rem;
          @include font-dpr(12px);
        }
        &:first-child{
          background:#f5f5f5;
          li{
            i{margin-right: 0.24rem}

            .icon-arrow-right{
              position: absolute;
              right: 0;
              top: 50%;
              line-height: 0.373333rem;
              margin-top: -0.186667rem;
              @include font-dpr(11px);
              color:#999
            }
            &.active{
              background:#fff;
              i:first-child,.name{
                color:$ic;
              }

            }
          }
        }
        &:last-child{

          background:#fff;
          li{
            border-bottom: 0.013333rem solid #eee;margin:0 0.2rem 0 0.3rem;padding:0;
            &.active .name{
              color:$ic!important
            }
          }
          .count{
            right: 0;
            background-color: transparent;
            color: #999;
          }
        }
      }
    }
    .filter-city{
      height: 1000%;
      .city-scroll{
        height: 100%;
        display:flex;
          ul{
          flex: 1;
          list-style: none;
          -webkit-overflow-scrolling: touch;
          overflow: auto;
        }
      }
      .city-item{
        padding:0 0.2rem 0 0.3rem;
        @include font-dpr(13px);
        line-height: 1.04rem;
        position: relative;
        border-bottom: 1px solid #eee;
        &.byactive{
          color:$ic;
        }
      }
    }
    .filter-orderby{
      li{
        padding:0 0.2rem 0 0.3rem;
        @include font-dpr(13px);
        line-height: 1.04rem;
        position: relative;
        &.byactive{
          color:$ic;
        }
      }
    }
    .filter-other{
      width:100%;
      background:#f5f5f5;
      .filter-other-wrap{
        background:#fff;
        .filter-other-form{
          display:flex;
          height:1.066667rem;
          align-items:center;
          padding:0 0.3rem 0 0.3rem;
          .item{
            width:25%;
            height:1.066667rem;
            line-height: 1.066667rem;
            position: relative;
            @include font-dpr(13px)
            label,input{vertical-align: middle;}
          }
          .subitem{
              width:25%;
              height:1.066667rem;
              line-height: 1.066667rem;
              position: relative;
              @include font-dpr(13px);
              button{
                position: absolute;
                right:0rem;
                top:50%;
                margin-top: -0.306667rem;
                @include wh(1.333333rem,0.613333rem)
                background:$ic;
                color:#fff;
                @include font-dpr(13px)
              }
            }
        }
        .filter-item{
          padding:0 0.3rem 0 0.3rem;
          background:#f5f5f5;
          border-bottom: 1px solid #eee;
          .item-title{
            height:1rem;line-height: 1rem;
            @include font-dpr(13px)
          }
          .item-box{
            display:flex;
            flex-wrap:wrap;
            span{
              width:25%;
              display:block;
              height:0.586667rem;
              line-height: 0.586667rem;
              background:transparent;
              box-sizing:border-box;
              text-align: center;
              margin-bottom: 0.2rem;
              border-radius: 0.106667rem;
              &.active{
                border:1px solid $ic;
                color:$ic;
                background:#fff;
              }
            }
          }
        }
      }
    }
    .filter-wrap{
      position: fixed;
      left: 0;
      right: 0;
      top: 0;
      bottom: -1.28rem;
      z-index: 1;
      background: rgba(0, 0, 0, .2);
      visibility: hidden;
      opacity: 0;
      transition: all .3s ease-in-out;
      &.open{
        opacity: 1;
        visibility: visible;
      }
    }
  }
  .hack-header{
    position: relative;
    margin: 0.426667rem 0;
    width: 100%;
    height: 1.14667rem;
  }
  .discover-list{
    position: relative;
    width:100%;
    height:auto;

    .star-pic{
      @include wh(2.173333rem, 0.346667rem);
      background: url('../../assets/img/star0.png') no-repeat;
      background-size: 100% 100%;
      display: inline-block;
      vertical-align: middle;
      margin-right: 0.133333rem;
      i{
        background: url('../../assets/img/star.png')no-repeat;
        display: inline-block;
        height: 0.346667rem;
        overflow: hidden;
        vertical-align: top;
        background-size: auto 100%;}
    }
    .list-item{
      background:#fff;
      padding:0.266667rem 0.266667rem 0;
      margin-top:0.426667rem;
      .top{
        display:flex;
        .img{
          @include wh(2.666667rem,2.373333rem);
          img{@include wh(2.666667rem,2.373333rem);}
          margin-right:0.4rem;
        }
        .cont{
          flex:1;
          display:flex;
          flex-direction:column;
          justify-content:space-between;
          p{line-height: 0.613333rem;@include font-dpr(13px);}
          p.title{
            @include font-dpr(14px);
          }
          p.money{
            display:flex;
            justify-content:space-between;
          }
        }
      }
      .center{
        height:0.773333rem;
        line-height: 0.773333rem;
        border-bottom: 1px solid #eee;
        @include font-dpr(13px);
        color:$ic;
      }
      .bot{
        .item{
          height: 0.906667rem;
          line-height: 0.906667rem;
          margin-left:3.06667rem;
          position: relative;
          padding-left: 0.666667rem;
          @include font-dpr(13px);
          &:before{
            content:'';
            position: absolute;
            background:url('../../assets/img/tuan.png');
            background-size: 100%,100%;
            @include wh( 0.373333rem,0.373333rem);
            top:0.25rem;
            left:0
          }
        }
      }
    }

  }
  .loader-more,.loader-none{ width: 100%; height:1.28rem;text-align: center;line-height: 1.28rem}
  .router-slid-enter-active, .router-slid-leave-active {
      transition: all .4s;
  }
  .router-slid-enter, .router-slid-leave-active {
      transform: translateX(100%);
  }
</style>
