<script setup>
import axios from 'axios'
import {ref, onMounted} from 'vue'
import {loadPlayer} from '../PlayerIndex'
const karaokes = ref({})

onMounted(async ()=>{
  const response = await axios.get('http://127.0.0.1:8000/')
  karaokes.value = response.data
  // console.log(karaokes.value)

})
async function playPlayer(track){

  // const cdgControls = document.getElementById('cdg-controls')
  // const cdgWrapper = document.getElementById('cdg-wrapper')
  let playerContainer = document.querySelector('cdg_wrapper[id="player-container"]')
  // if(cdgControls.length > 0){
  //   cdgControls.array.forEach(element => {
  //     element.remove()
      
  //   });
  // }
  // if(cdgVideoPlayer.length > 0){
  //   cdgVideoPlayer.array.forEach(element =>{
  //     element.remove()
  //   })
  // }
  
    // cdgControls.remove()
    // cdgWrapper.remove()
    console.log(playerContainer)
 playerContainer.remove()
  

  console.log(cdgControls)

    // const response = await fetch("http://127.0.0.1:8000/media/music/A 5/1403_Supervisor_De_Tus_Sueños_Pop.zip");
    const response = await fetch(track);
    console.log(response)
    const kar = await response.arrayBuffer()
    loadPlayer(kar)

}


defineProps({
  msg: {
    type: String,
    required: true
  }
})

</script>

<template>
  <div class="greetings">
    <div class="row bg-primary">
      <div class="card col-4 p-2 m1 text-center"
        v-for="karaoke in karaokes"
        :key="karaoke.name">
        <div class="col-12">
          <div class="card-body">
                   <div class="card-header">
                       {{ karaoke.name }}
                   </div>
                  {{ karaoke.slug }}
                  {{ karaoke.track }}                  
                  {{ karaoke.img }}    
                  <img :src="karaoke.img" alt="karaoke">              
           </div>
           <div class="card-footer">
               <button :value="karaoke.name" @click="pauseKar"  className="btn btn-warning m-1 play">Pause</button>
               <button :value="karaoke.name" @click="playKar"  className="btn btn-warning m-1 play">Play</button>
               <button @click="playPlayer(karaoke.track)" className="btn btn-outline-success m-1">Play</button>
           </div>
       </div>
      
      </div>
    </div>



    <div id="file-select-container">

      <input id="file-select" type="file" name="fileselect[]" />
      hello
      <button id="file-select2" class="play-btn"  name="btn-play">Play Karaoke</button>
  </div>
  <div class="cdg-player">
      <div id="cdg_controls"></div>
      <div id="cdg_wrapper"></div>
  </div>
    <h1 class="green">{{ msg }}</h1>

  </div>
    
  
</template>


