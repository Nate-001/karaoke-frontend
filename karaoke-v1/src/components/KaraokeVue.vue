<script setup>
// import logFiles from '../index'
// import '../index'
import { onMounted, ref, reactive, watch } from 'vue';
import { CDGPlayer, CDGControls } from '/node_modules/cdgplayer/dist/cdgplayer.js';
import OnScreenKeyboard from './OnScreenKeyboard.vue';

const karaokes = ref([])
const currentKaraoke = ref([])
const reproductionList = ref([])
const hideClass = ref(false)
const searchString = ref('A')

defineProps({
  msg: {
    type: String,
    required: false
  }
})

// #region ON MOUNTED
onMounted(()=>{
  karaokes.value = logFiles();
  // let playbtn = document.getElementById('play-karaoke')
  let divPlayer = document.getElementById('cdg_wrapper').getElementsByTagName("canvas")
  let screen = document.getElementById('full-screen')
  //! FULL SCREEN
  screen.addEventListener('click', () =>{
    if (divPlayer.requestFullscreen) {
      divPlayer[0].requestFullscreen();
    } else if (divPlayer[0].webkitRequestFullscreen) { /* Safari */
    divPlayer[0].webkitRequestFullscreen();
    } else if (screen.msRequestFullscreen) { /* IE11 */
    divPlayer[0].msRequestFullscreen();
    }

  })

});
// #endregion ON MOUNTED

watch(reproductionList.value, (newValue, oldValue) => {
  hideClass.value =true
  console.log(newValue, oldValue)})

// #region FUNCTIONS
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

    let pause = document.getElementById('pause-karaoke');
    player.start();
    // let divPlayer = document.getElementById('cdg_wrapper').getElementsByTagName("canvas")
    // // divPlayer[0].style.width = "250px";
    // divPlayer[0].style.height = "25rem";
    // pause.addEventListener(click, (e)=>{
    //   console.log('si entra pero no hay reaccion')
    //   player.pause()
    // });

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
  console.log("reproduction length: "+reproductionList.value.length)
  console.log("***********")
  console.log(currentKaraoke.value["data"].track)
  console.log("***********")
  
  const response = await fetch(currentKaraoke.value["data"].track);
  console.log(currentKaraoke, "si este es")
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
// function setCurrentPlay(track){
//   console.log('esta es el track: '+ track)
//   const btnPlay = document.getElementById('play-karaoke')  
//   currentKaraoke.value = track
//   btnPlay.click()
  
// }
const addToReproductionList = (index) => {
  reproductionList.value.push(karaokes.value[index]);
  let i = reproductionList.value.length-1
  if(currentKaraoke.value.length < 1){
    currentKaraoke.value = {"index":i, "data":reproductionList.value[0]}
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

function prevKaraoke() {
  let prev = currentKaraoke.value["index"] -1
  console.log("Prev: "-prev)
  console.log("Reproduction Length: ",reproductionList.value.length-1)
  if(reproductionList.value.length-1 > 1 && prev > reproductionList.value.length-1){
    
    currentKaraoke.value={"index": prev, "data":reproductionList.value[prev]}
    console.log('--------------')
    console.log(currentKaraoke)
    console.log('--------------')
    
  }
  else {
    currentKaraoke.value={"index": reproductionList.value.length-1, "data":reproductionList.value[reproductionList.value.length-1]}
    
  }
  clickPlay()
}

function nextKaraoke () {
  let next = currentKaraoke.value["index"] +1
  console.log("next: "+next)
  console.log("reproduction length: ",reproductionList.value.length-1)
  if(reproductionList.value.length-1 > 0 && next <= reproductionList.value.length-1){
    
    currentKaraoke.value={"index": next, "data":reproductionList.value[next]}
    console.log('--------------')
    console.log(currentKaraoke)
    console.log('--------------')
    
  }
  else {
    currentKaraoke.value={"index": 0, "data":reproductionList.value[0]}
    
  }
  clickPlay()

}
function pausePlay(){
  let btnPause = document.getElementsByClassName('playButton')
  btnPause[0].click()
}

// #endregion FUNCTIONS

</script>

<template>
<div class="main-player">

  <div className="greetings" id="player-container">
    <div className="cdg-player" style="visiblility: visible">
      <div :class="{'hide': hideClass}" id="img-cover"></div>
      <div id="cdg_controls"></div>
      <div id="cdg_wrapper"></div>
    </div>  
    <div className="buttons-controls">
      <div className="btn-inside-controls">
        <button className="btn btn-outline-info" @click="prevKaraoke()" id="prev-karaoke">&lt; &lt;</button>
        <button className="btn btn-outline-success" @click="getKaraoke()" id="play-karaoke">Play</button>
        <button className="btn btn-outline-info" @click="nextKaraoke()" id="next-karaoke">&gt;  &gt;</button>
        <button className="btn btn-outline-primary" @click="pausePlay()" id="pause-karaoke">Pause</button>
      </div>
      <button className="btn btn-outline-warning" id="full-screen">Full Screen</button>
      
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
            <td>{{karaoke.artist}} <svg style="color:white;" xmlns="http://www.w3.org/2000/svg" height="22" width="24" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm64 192c17.7 0 32 14.3 32 32v96c0 17.7-14.3 32-32 32s-32-14.3-32-32V256c0-17.7 14.3-32 32-32zm64-64c0-17.7 14.3-32 32-32s32 14.3 32 32V352c0 17.7-14.3 32-32 32s-32-14.3-32-32V160zM320 288c17.7 0 32 14.3 32 32v32c0 17.7-14.3 32-32 32s-32-14.3-32-32V320c0-17.7 14.3-32 32-32z"/></svg></td>
            <td className="d-grid"><button @click="deleteElement(index)" className="btn btn-outline-danger m-1">Delete</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <div class="all-songs">
    <div class="search">
      {{ searchString }}
      <OnScreenKeyboard />  
   
    </div>
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


