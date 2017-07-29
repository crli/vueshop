<template>
<div class="wrap">
  <gmap-map :center="center":zoom="15"style="width: 100%; height: 100%">
    <gmap-marker :key="index"v-for="(m, index) in markers":position="m.position":clickable="true":draggable="true"@click="center=m.position"
    ></gmap-marker>
  </gmap-map>
</div>

</template>

<script>
  import * as VueGoogleMaps from 'vue2-google-maps';
  import Vue from 'vue';

  Vue.use(VueGoogleMaps, {
    load: {
      key: 'AIzaSyBzlLYISGjL_ovJwAehh6ydhB56fCCpPQw',
      v: '3.26',
    }
  });

  export default {
    data () {
      return {
        center: {lat: null, lng: null},
        markers: [{
          position: {lat: null, lng: null}
        }]
      }
    },
    created(){;
      document.body.setAttribute("class","hid");
    },
    mounted(){
      this.center.lat = parseFloat(this.$route.query.lat);
      this.center.lng = parseFloat(this.$route.query.lng);
      this.markers[0].position.lat = parseFloat(this.$route.query.lat);
      this.markers[0].position.lng = parseFloat(this.$route.query.lng);
    },

    destroyed(){
      document.body.removeAttribute("class","hid")
    },
    watch: {
      '$route'(to, from) {
        // Call resizePreserveCenter() on all maps
        Vue.$gmapDefaultResizeBus.$emit('resize')
      }
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
}

</style>
