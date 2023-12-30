<script setup>
import { RouterLink, RouterView } from 'vue-router'
// import HelloWorld from './components/HelloWorld.vue'
import KaraokeVue from './components/KaraokeVue.vue';
// import MediaPlayer from './components/MediaPlayer.vue';
</script>

<template>
  <div class="player-container">

    <header>    
    <div class="wrapper">
      <!-- <media-player /> -->
      <!-- <HelloWorld msg="You did it!" /> -->
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
      <karaoke-vue />
    </div>
  </header>
  
</div>  

</template>

<style scoped>

</style>
