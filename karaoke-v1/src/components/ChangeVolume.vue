<template>
  <div>
    <audio ref="audioElement" src="your-audio-file.mp3"></audio>
    <input type="range" min="0" max="1" step="0.01" v-model="volume" @input="updateVolume" />
    <input type="range" min="-1" max="1" step="0.01" v-model="balance" @input="updateBalance" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const volume = ref(1); // Default volume (100%)
const balance = ref(0); // Default balance (center)
const audioElement = ref(null);

let audioContext;
let sourceNode;
let gainNode;
let pannerNode;

onMounted(() => {
  audioContext = new AudioContext();
  sourceNode = audioContext.createMediaElementSource(audioElement.value);
  gainNode = audioContext.createGain();
  pannerNode = audioContext.createStereoPanner();

  sourceNode.connect(gainNode).connect(pannerNode).connect(audioContext.destination);

  updateVolume();
  updateBalance();
});

function updateVolume() {
  gainNode.gain.value = volume.value;
}

function updateBalance() {
  pannerNode.pan.value = balance.value;
}
</script>
