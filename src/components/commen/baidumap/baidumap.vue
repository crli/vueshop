<template>
  <div class="wrap">
    <baidu-map class="map" :center="center":zoom="15" ak="rviqw5ullWhzp0gWa4Sx7G4f6ctat02t"@ready="handler">
      <bm-marker :key="index"v-for="(m, index) in markers":position="m.position" :clickable="true" :dragging="true" animation="BMAP_ANIMATION_BOUNCE" @click="center=m.position"></bm-marker>
      <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
    </baidu-map>
  </div>

</template>

<script>
  import {BaiduMap,BmMarker,BmNavigation} from 'vue-baidu-map'
  export default {
    data () {
      return {
        center: {lat: '', lng: ''},
        markers: [{
          position: {lat: '', lng: ''}
        }]
      }
    },
    created(){;
      document.body.setAttribute("class","hid");
    },

    destroyed(){
      document.body.removeAttribute("class","hid")
    },
    methods:{
      handler ({BMap, map}) {
        this.latlng()
      },
      latlng(){
        this.center.lat = Number(parseFloat(this.$route.query.lat));
        this.center.lng = Number(parseFloat(this.$route.query.lng));
        this.markers[0].position.lat = Number(parseFloat(this.$route.query.lat));
        this.markers[0].position.lng = Number(parseFloat(this.$route.query.lng));
      }
    },
    components: {
      BaiduMap,BmNavigation,BmMarker
    }
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
  z-index: 5000;
  background:#eee;
  overflow: auto;
  .map {
    width: 100%;
    height: 100%;
  }
}

</style>
