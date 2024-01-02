<script setup>
// import logFiles from '../index'
// import '../index'
import { onMounted, ref, reactive, watch } from 'vue';
import { CDGPlayer, CDGControls } from '/node_modules/cdgplayer/dist/cdgplayer.js';
const karaokes = ref([])
const currentKaraoke = ref('')
const reproductionList = ref([])
const hideClass = ref(false)

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
watch(reproductionList.value, (newValue, oldValue) => {
  hideClass.value =true
  console.log(newValue, oldValue)})


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


async function getKaraoke() {
  const response = await fetch(currentKaraoke.value);
  const karaoke = await response.arrayBuffer()
// setState('loading')
console.log('***********')
// console.log(event.target)  
console.log('***********')

  loadPlayer(karaoke)

};

function deleteElement(index){
  reproductionList.value.splice(index,1)
}

function clickPlay(e, event){
  const btnPlay = document.getElementById('play-karaoke')
  btnPlay.click(e,event);
  console.log(event)

}
function setCurrentPlay(track){
  const btnPlay = document.getElementById('play-karaoke')  
  currentKaraoke.value = track
  btnPlay.click()
  
}
const addToReproductionList = (index) => {
  reproductionList.value.push(karaokes.value[index]);
  if(currentKaraoke.value == ''){
    currentKaraoke.value = reproductionList.value[0].track
    getKaraoke()
  }
}
async function logFiles() {
let baseUrl = "http://localhost:8000"
const response = await fetch(baseUrl);
const files = await response.json()
karaokes.value = files.results
console.log(files)
};

</script>

<template>
<div class="main-player">

  <div className="greetings" id="player-container">
    <div className="cdg-player" style="visiblility: visible">
      <div :class="{'hide': hideClass}" id="img-cover"></div>
      <div id="cdg_controls"></div>
      <div id="cdg_wrapper"></div>
      <div className="buttons-controls">
        <div className="btn-inside-controls">
          <button className="btn btn-outline-info"  id="next-karaoke">Next</button>
          <button className="btn btn-outline-success" @click="getKaraoke()" id="play-karaoke">Play</button>
          <button className="btn btn-outline-info"  id="prev-karaoke">previous</button>
        </div>
        <button className="btn btn-outline-warning" id="full-screen">Full Screen</button>
        
      </div>
    </div>
    <div class="play-list">
  
      <h1 className="display-4 text-center">PLAY LIST</h1>
     
      <table calssName="d-grid">
        <thead>
          <tr>
            <th>Title</th>
            <th>Artist</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr @click="deleteElement(index)" v-for="(karaoke, index) in reproductionList" :key="index">
            <td>{{karaoke.title}}</td>
            <td>{{karaoke.artist}}</td>
            <td className="d-grid"><button @click="deleteElement(index)" className="btn btn-outline-danger m-1">Delete</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <div class="all-songs">

    <h2 className="text-center display-4">All Songs</h2>
   
    <table calssName="d-grid">
      <thead>
        <tr>
          <th>Title</th>
          <th>Artist</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr @click="addToReproductionList(index)" v-for="(karaoke, index) in karaokes" :key="index">
          <td>{{karaoke.title}}</td>
          <td>{{karaoke.artist}}</td>
          <td className="d-grid"><button className="btn btn-outline-success mt-1">Add</button></td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

</template>


