<script setup>
defineProps({
  msg: {
    type: String,
    required: true
  }
})

</script>

<template>
  <div class="greetings" id="player-container" style="background: Red; width: 800px; height: 500px">
  <div class="cdg-player" style="visiblility: visible">
      <div id="img-cover"></div>
      <div id="cdg_controls"></div>
      <div id="cdg_wrapper"></div>
      <div class="buttons-ctlr">
        <button id="play-karaoke">Play</button>
        <button id="full-screen">Screen+/-</button>
      </div>
  </div>
    <h1 class="green">{{ msg }}</h1>
  </div>
</template>


