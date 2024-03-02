<script setup>
// import logFiles from '../index'
// import '../index'
import { onMounted, ref, reactive, watch } from 'vue';
import { CDGPlayer, CDGControls } from '/node_modules/cdgplayer/dist/cdgplayer.js';
import OnScreenKeyboard from './OnScreenKeyboard.vue'

const mediaBaseUrl = ref('http://localhost:8000/media/')
const currentKaraoke = ref([])
const currentFolder = ref('')
const currentTrackLength = ref(null)
const currentTrackTime = ref(null)

const karaokes = ref([])
const folderList = ref([])

const reproductionList = ref([])
const hideClass = ref(false)
const searchString = ref('')

defineProps({
  msg: {
    type: String,
    required: false
  },

})

// #region ON MOUNTED
onMounted(()=>{
  karaokes.value = logFiles();
  // let playbtn = document.getElementById('play-karaoke')
  let divPlayer = document.getElementById('cdg_wrapper').getElementsByTagName("canvas")
  let screen = document.getElementById('full-screen')

  let tmp = JSON.parse(getCookie('reproductionlist'))
  console.log(tmp, 'this is tmp')
  if(tmp.length > 0){
    reproductionList.value = tmp
    currentKaraoke.value = {"index":0, "data":reproductionList.value[0]}
    // console.log(currentKaraoke.value)

    getKaraoke()
    hideClass.value =true
  }

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
  // console.log(newValue, oldValue)
}
  )

watch(searchString, (newValue, oldValue) =>{
    // console.log(oldValue, newValue)
    logFiles()
  })

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
    // console.log('erased')
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
  // console.log('Status: ', val);
  // console.log(player.props)
  if (val === 'File Loaded') {
    player.start();
  }
});
const onLoadingChange = player.props.on('loading', (val, prev) => {
  // console.log(val, prev)
    if (val !== prev) {

    }
});
const onStatusChange = player.props.on('status', (val, prev) =>{
  // console.log("st val: "+val, "ST prev: "+prev)
  if(val == 'Loading File...'){
    // console.log('afirmativo carnal')
    try {
      // player.destroy()
    } catch (error) {
      console.log(error)
    }
  }else{
    // console.log('negativo carnal')
  }
})
setTimeout(() => {
    // console.log(player)
    // console.log(player.props.timePlayed)
    // console.log(player.tag.APIC.data.data)
    let img = document.getElementById('img-cover')
  
    let mig = document.createElement('svg')
    mig.width = '100'
    mig.height = '100'
    img.appendChild(mig)
  },10000
  
  )
  
  player.load(filename);
  // console.log('this are the props')
  // console.log(player.props)
}

// #! GET KARAOKES TRACK BY CURRENT KARAOKE VALUE
async function getKaraoke() {

  const response = await fetch("http://localhost:8000/media/"+currentKaraoke.value["data"].track);
  // console.log(currentKaraoke, "si este es")
  const karaoke = await response.arrayBuffer()
  loadPlayer(karaoke)

};

function deleteElement(index){
  reproductionList.value.splice(index,1)
   // create cookie for reproduction list
   let json_str = JSON.stringify(reproductionList.value)
  setCookie("reproductionlist", json_str, 1)
}

function clickPlay(e, event){
  const btnPlay = document.getElementById('play-karaoke')
  btnPlay.click(e,event);
  // console.log(event)

}


const addToReproductionList = (index) => {
  reproductionList.value.push(karaokes.value[index].fields);

  // create cookie for reproduction list
  let json_str = JSON.stringify(reproductionList.value)
  setCookie("reproductionlist", json_str, 1)

  let i = reproductionList.value.length-1
  if(currentKaraoke.value.length < 1){
    currentKaraoke.value = {"index":i, "data":reproductionList.value[0]}
  console.log("========")
  
    console.log(currentKaraoke.value)
  console.log("========")
    
    getKaraoke()
  }
};

function setCookie(cname, cvalue, exdays){
  const d = new Date()
  d.setTime(d.getTime() + (exdays*24*60*60*1000))
  let expires = "expires="+ d.toUTCString()
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";

}

function getCookie(cname){
  let name = cname + "="
  // let decodedCookie = docodeURIComponent(document.cookie)
  let ca = document.cookie.split(';')
  
  for (let i =0; i<ca.length; i++){
    let c = ca[i].trim();
    if((c.indexOf(name))==0){
      return c.substring(name.length)
    }
  }

}
async function getImage(imageUrl) {
let baseUrl = "http://localhost:8000/media/"
const response = await fetch(baseUrl+imageUrl);
const img = await response.blob()
 return img
// console.log(files)
};

// GETS ALL THE KARAOKES AND FILTERS IF THERE IS A SEARCH STRING
async function logFiles() {
  // alert('DATA IS BEING FETCHED')
let baseUrl = `http://localhost:8000/api/show_artist/?artist=${searchString.value}`
const response = await fetch(baseUrl);
const files = await response.json()
// karaokes.value = files
folderList.value = Object.groupBy(files, kar => kar.fields.artist)

};

// handles click on folders to add information on table of karaokes
function folderSelected(folder){
  let newList = []
  folderList.value[folder].forEach(element =>{
    newList.push(element)
    // console.log(karaokes.value)
  }
  )
  karaokes.value = newList
  // console.log(karaokes.value)
  }
//#region Karaoke PREVIOUS NEXT PAUSE PLAY
function prevKaraoke() {
  let prev = currentKaraoke.value["index"]
  prev -= 1
  console.log("Prev: " + prev)
  console.log("Reproduction Length: ",reproductionList.value.length-1)
  if(reproductionList.value.length > 0 && prev >= 0){
    
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

// PLAY NEXT KARAOKE
function nextKaraoke () {
  let next = currentKaraoke.value["index"] +1
  console.log("next: "+next)
  
  if(reproductionList.value.length-1 > 0 && next < reproductionList.value.length){
    
    currentKaraoke.value={"index": next, "data":reproductionList.value[next]}
  }
  else {
    currentKaraoke.value={"index": 0, "data":reproductionList.value[0]}
  }
  clickPlay()
}
// PAUSE PLAYER
function pausePlay(){
  let btnPause = document.getElementsByClassName('playButton')
  btnPause[0].click()
}
//#endregion Karaoke PREVIOUS NEXT PAUSE PLAY

// #endregion FUNCTIONS
function updateSearch(e){
  console.log(e)
}

function moveToLeft(){
  let cOne = document.getElementById('card-1'); 
  let cTwo = document.getElementById('card-2'); 
  let cThree = document.getElementById('card-3'); 
  let cFour = document.getElementById('card-4');
  let cFive = document.getElementById('phantom-card');
 
  cOne.classList.add('move-desapear');
  cTwo.classList.add('move-left');
  cThree.classList.add('move-left');
  cFour.classList.add('move-left');
  cFive.classList.add('move-last');

 setTimeout(()=>{
  cOne.classList.remove('move-desapear');
  cTwo.classList.remove('move-left');
  cThree.classList.remove('move-left');
  cFour.classList.remove('move-left');
  cFive.classList.remove('move-last');
  console.log('class removed')
 },1000) 

}
</script>

<template>
<div class="main-player">

  <div className="greetings" id="player-container">
    <!-- CDGPLAYER -->
    <div className="cdg-player" style="visibility: visible">
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
    <!-- PLAY LIST  -->
    <div class="play-list">
      <h1 className="text-center">PLAY LIST</h1>
      <table calssName="d-grid">
        <thead>
          <tr>
            <th>Title</th>
            <th>Artist</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(karaoke, index) in reproductionList" :key="index">
            <td>{{karaoke.title}}</td>
            <td>{{karaoke.artist}} 
            </td>
            <td v-if="currentKaraoke.data.title == karaoke.title">  
            <img width="50" height="25" src="../assets/equalizer_white.gif" alt="shows playing equalizer">
            </td> 
            <td v-else></td>
            <td className="d-grid"><button @click="deleteElement(index)" className="btn btn-outline-danger m-1">Delete</button></td>
          </tr>
        </tbody>
      </table>
    </div>
    <p class="text-center text-primary m-1">
      <img 
        class="pr-1"
        width="25" 
        height="15" 
        src="../assets/logo.png" 
        alt="logo">
              ALFCOMPUTACION.COM &#169;
    </p>
  </div>
  <div class="all-songs-container">
    <div class="search">
      <div class="search-string">
         <span class="text-secondary">Searching by: </span><strong>{{ searchString }}</strong>
      </div>
      <!-- ON SCREEN KEYBOARD -->
      <OnScreenKeyboard 
        @sendString="(value) => searchString = value" 
        @sendBackSpace="(value) => searchString = value"
        />  
    </div>
    <!-- CARD FOR FOLDERS -->
    <div class="text-white">
      <div v-for="(folder, index) in folderList" :key="index">
        {{ folder[index] }}
      </div>
    </div>
    
<!-- CARD FOLDERS -->
    <div class="card-folders">
      <button class="btn btn-outline-primary btn-rounded" @click="moveToLeft()">&lt;</button>
          <div class="cards-only">
              <div v-for="(folder, index) in folderList" :key="index" class="for"  @click="folderSelected(folder[0]['fields'].artist)">

                <div :id="'card-'+index[0]" class="card move-card"  @click="console.log(folder[0]['fields'].artist)">
                  <div class="flip-card">
                    <div class="flip-card-inner">
                      <div class="flip-card-front">
                        <img class="img-front" :src="mediaBaseUrl+folder[0]['fields'].img" alt="artist">
                        <div class="containers">
                          <h6>
                            <small>{{folder[0]['fields'].artist}}</small>
                          </h6>
                        </div>
                      </div>
                      <div class="flip-card-back">
                        <img class="img-back" :src="mediaBaseUrl+folder[0]['fields'].img" alt="artist">
                        <div class="containers">
                          <h6>
                            <small>{{folder[0]['fields'].artist}}</small>
                          </h6>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-for="(folder, index) in folderList" :key="index" class="for"  @click="folderSelected(folder[0]['fields'].artist)">

                <div :id="'card-'+index[0]" class="card move-card"  @click="console.log(folder[0]['fields'].artist)">
                  <div class="flip-card">
                    <div class="flip-card-inner">
                      <div class="flip-card-front">
                        <img class="img-front" :src="mediaBaseUrl+folder[0]['fields'].img" alt="artist">
                        <div class="containers">
                          <h6>
                            <small>{{folder[0]['fields'].artist}}</small>
                          </h6>
                        </div>
                      </div>
                      <div class="flip-card-back">
                        <img class="img-back" :src="mediaBaseUrl+folder[0]['fields'].img" alt="artist">
                        <div class="containers">
                          <h6>
                            <small>{{folder[0]['fields'].artist}}</small>
                          </h6>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          </div>

      <button id="top-btn" class="btn btn-outline-primary  btn-rounded" @click="moveToLeft()">&gt;</button>
    </div>
      <!-- !!!!!!!!!!!!!!! -->
    
    <!-- ALL SONGS -->

    <div class="all-songs">
      <h2 className="text-center">All Songs</h2>
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
          <td>{{karaoke.fields.title}}</td>
          <td>{{karaoke.fields.artist}}</td>
          <td className="d-grid"><button className="btn btn-outline-success mt-1">Add</button></td>
        </tr>
       
      </tbody>
    </table>
    </div>
    <!-- all SONGS -->
    
  </div>
 
</div>

</template>


