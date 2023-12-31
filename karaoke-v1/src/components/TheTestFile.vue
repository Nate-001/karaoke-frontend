<script setup>
// import logFiles from '../index'
// import '../index'
import { onMounted, ref, reactive } from 'vue';
import { CDGPlayer, CDGControls } from '/node_modules/cdgplayer/dist/cdgplayer.js';
const karaokes = ref([])
defineProps({
  msg: {
    type: String,
    required: false
  }
})
onMounted(()=>{
  karaokes.value = logFiles();
  // let playbtn = document.getElementById('play-karaoke')
  let divPlayer = document.getElementById('cdg_wrapper')
  let screen = document.getElementById('full-screen')
  //! FULL SCREEN
  screen.addEventListener('click', () =>{
    if (divPlayer.requestFullscreen) {
      divPlayer.requestFullscreen();
    } else if (divPlayer.webkitRequestFullscreen) { /* Safari */
    divPlayer.webkitRequestFullscreen();
    } else if (screen.msRequestFullscreen) { /* IE11 */
    divPlayer.msRequestFullscreen();
    }
  })

});

function loadPlayer(filename) {
    //!! CODE TO DESTROY PLAYER
  const btn = document.getElementById('play-karaoke')
  try {
   let clearWrapper = document.getElementById('cdg_wrapper');
    let clearControls = document.getElementById('cdg_controls')
    clearWrapper.innerHTML = '';
    clearControls.innerHTML ='';
   
  } catch (error) {
    console.log(error)
  }
  try {
    btn.addEventListener('click',()=>{
    player.destroy()
    console.log('erased')
})
  } catch (error) {
    console.log(error)
  }
    //!! CODE TO DESTROY PLAYER

    //CREATE PLAYER 
  const player = new CDGPlayer('#cdg_wrapper');
  const controls = new CDGControls('#cdg_controls', player, {
  position: 'top',
});


// CHECK STATUS OF PLAYER
const statusChanged = player.props.on('status', (val) => {
  console.log('Status: ', val);
  if (val === 'File Loaded') {
    player.start();
    
  }
});
const onLoadingChange = player.props.on('loading', (val, prev) => {
  console.log(val, prev)
    if (val !== prev) {
        // loading changed, so now do something
        // player.props.off(onLoadingChange);
        // player.destroy();
        console.log(val, prev)
        console.log('current value: ' + val, 'previus value: ' + prev)
    }
});
const onStatusChange = player.props.on('status', (val, prev) =>{
  console.log("st val: "+val, "ST prev: "+prev)
  if(val == 'Loading File...'){
    console.log('afirmativo carnal')
    try {
      // player.destroy()
    } catch (error) {
      console.log(error)
    }
  }else{
    console.log('negativo carnal')
  }
})
setTimeout(() => {
    console.log(player)
    console.log(player.props.timePlayed)
    // console.log(player.tag.APIC.data.data)
    let img = document.getElementById('img-cover')
  
    let mig = document.createElement('svg')
    mig.width = '100'
    mig.height = '100'
    img.appendChild(mig)
  },10000
  
  )



  player.load(filename);
  console.log('this are the props')
  console.log(player.props)
}


async function getKaraoke(link, event) {
  // let baseUrl = "http://localhost:8000/media/music/"; 
  // const response = await fetch(baseUrl+"Alejandro Montaner/0353_Dimelo_Pop.zip");
  const response = await fetch(link);
  const karaoke = await response.arrayBuffer()
// setState('loading')
console.log('***********')
console.log(event.target)  
console.log('***********')
  loadPlayer(karaoke)

  
  // const files = karaoke;
  // try {
  //   karaoke[0];
  //   setState('cdg');
  // } catch (error) {
  //   alert(error);
  // }

};



async function logFiles() {
let baseUrl = "http://localhost:8000"
const response = await fetch(baseUrl);
const files = await response.json()
karaokes.value = files.results
console.log(files)
};

</script>

<template>
  <div class="greetings" id="player-container" style="background: Red; width: 800px; height: 500px">
  <div class="cdg-player" style="visiblility: visible">
      <div id="img-cover"></div>
      <div id="cdg_controls"></div>
      <div id="cdg_wrapper"></div>
      <div class="buttons-ctlr">
        <button @click="getKaraoke" id="play-karaoke">Play</button>
        <button id="full-screen">Screen+/-</button>
      </div>
  </div>
  <p>Here is where the kar goes</p>
    <ul>
      <li v-for="karaoke in karaokes" :key="karaoke.slug">
        {{karaoke.title}}
         <button :id="karaoke.slug" className="btn btn-info" @click="getKaraoke(karaoke.track, $event)">Play</button>
         {{ karaoke.track }}
        {{ karaoke.artist }}
      </li>
    </ul>
  </div>
</template>


