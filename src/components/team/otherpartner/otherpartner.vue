<template>
  <div class="wrap">
    <headTop :noneHome="noneHome" :headTitle="titleName"></headTop>
    <div class="box">
      <div class="title">{{otherstore.length}}店可用</div>
      <div class="box-warp">
        <div class="item" v-for="item in otherstore" >
          <div class="left"@click="routerpushPart(item.PartnerId)">
            <div class="name"><span>{{item.Title}}</span><span class="dis">{{item.Distance}}</span></div>
            <div class="add">{{item.Addr}}</div>
          </div>
          <div class="right"><a :href="'tel:'+item.Tel"><i class="iconfont icon-phone"></i></a></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import headTop from '@/components/commen/header/head'
import {GetTeamOtherStore} from '@/service/getData'
import {mapState,mapMutations} from 'vuex'
export default {
  name: 'otherpartner',
  data () {
    return {
      noneHome:true,
      titleName:"全部门店",
      otherstore:[],
      TeamId:null
    }
  },
  beforecreate(){

  },
  created(){
    document.body.setAttribute("class","hid");
    this.TeamId = this.$route.query.id
    if(!this.longitude){
      this.getLocation()
    }else{
      this.init()
    }
  },
  mounted(){

  },
  methods:{
    ...mapMutations([
      'SET_LOG_AND_LAT'
    ]),
    init(){
      GetTeamOtherStore(this.TeamId,this.longitude,this.latitude).then((response)=>{
        this.otherstore = response.data
      })
    },
    getLocation(){
      if (navigator.geolocation){
        navigator.geolocation.getCurrentPosition((position)=>{
          let lat = position.coords.latitude.toFixed(7);
          let long = position.coords.longitude.toFixed(7);
          this.SET_LOG_AND_LAT({longitude:lat,latitude:long});
          this.init()
        },(error)=>{
          this.init()
        });
      }
    },
    routerpushPart(id){
      this.$router.push("/partner?id="+id+"&type=p")
    }
  },
  destroyed(){
    if(this.$route.path == "/team"){
      document.body.removeAttribute("class","hid");
    }
  },
  computed:{
    ...mapState([
      'longitude','latitude'
    ])
  },
  components:{headTop}
}
</script>

<style scoped lang="scss">
 @import '../../../style/mixin';
.wrap{
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  z-index: 0;
  background:#fff;
  overflow: auto;
  .box{
    padding-top: 1.093333rem;
    width:100%;
    height:100%;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }
  .title{
    line-height: 1.04rem;
    background:#eee;
    padding: 0 0.266667rem;
    @include font-dpr(14px)
  }
  .item{
    padding:0.266667rem 0 0.266667rem 0.266667rem;
    display:flex;
    justify-content:space-between;
    align-items:center;
    border-bottom: 1px solid #eee;
    .left{
      flex:1;

    }
    .name{
      @include font-dpr(13px)
      display:flex;
      justify-content:space-between;line-height: 0.72rem;
      span:first-child{width:5rem;@include ellipsis(1);}
    }
    .add{
      line-height: 0.533333rem;@include font-dpr(12px)
    }
    i{margin:0 0.666667rem;color: $ic;@include font-dpr(26px);}
  }
}
</style>
