<template>
  <div>
    <input type="range" min="0" max="1" step="0.01" v-model="volume" @input="updateVolume">
    <input type="range" min="-1" max="1" step="0.01" v-model="balance" @input="updateBalance">
  </div>
</template>

<script>
export default {
  data() {
    return {
      volume: 1, // Default volume (100%)
      balance: 0, // Default balance (center)
      audioContext: null,
      sourceNode: null,
      gainNode: null,
      pannerNode: null
    };
  },
  mounted() {
    this.audioContext = new AudioContext();
    this.sourceNode = this.audioContext.createMediaElementSource(this.$refs.audioElement);
    this.gainNode = this.audioContext.createGain();
    this.pannerNode = this.audioContext.createStereoPanner();

    this.sourceNode.connect(this.gainNode);
    this.gainNode.connect(this.pannerNode);
    this.pannerNode.connect(this.audioContext.destination);

    this.updateVolume();
    this.updateBalance();
  },
  methods: {
    updateVolume() {
      this.gainNode.gain.value = this.volume;
    },
    updateBalance() {
      this.pannerNode.pan.value = this.balance;
    }
  }
};
</script>
