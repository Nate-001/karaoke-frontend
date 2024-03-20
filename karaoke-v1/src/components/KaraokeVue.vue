<script setup>
// import getFolders from '../index'
// import '../index'
import { onMounted, ref, reactive, watch } from 'vue';
import { CDGPlayer, CDGControls } from '/node_modules/cdgplayer/dist/cdgplayer.js';
import OnScreenKeyboard from './OnScreenKeyboard.vue'
import CardsKaraoke from './CardsKaraoke.vue';
import TrackTable from './TrackTable.vue';


const url = ref('http://localhost:8000/')
const mediaBaseUrl = ref(`${url.value}media/`)
const currentKaraoke = ref([])
const currentFolder = ref('')
const currentTrackLength = ref(null)
const currentTrackTime = ref(null)
const fliper = ref(false)

const karaokes = ref([])
const folderList = ref([])
const tableHeaders = ref(["Title", "Artist","Type", "" ])


const timePlayed = ref(1)
const trackLength = ref(1)
const isPlaying = ref(false)

const pagination = ref([])
// const page_prev = ref(1)
// const page_next = ref(2)

const pageData = ref({page:1})

const reproductionList = ref([])
const hideClass = ref(false)
const searchArtist = ref('')
const searchByTitle = ref(false)

defineProps({
  msg: {
    type: String,
    required: false
  },

})

// #region ON MOUNTED
onMounted(()=>{
  // ******************************
  // karaokes.value = getFolders();
  getFolders()
  // ******************************
  // let playbtn = document.getElementById('play-karaoke')
  let divPlayer = document.getElementById('cdg_wrapper').getElementsByTagName("canvas")
  let screen = document.getElementById('full-screen')
  try {
      let tmp = JSON.parse(getCookie('reproductionlist'))
  // console.log(tmp, 'this is tmp')
    if(tmp.length > 0){
      reproductionList.value = tmp
      currentKaraoke.value = {"index":0, "data":reproductionList.value[0]}
      // console.log(currentKaraoke.value)

      getKaraoke()
      hideClass.value =true
    }
  } catch (error) {
    
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

//#region  ********WATCHERS******
watch(searchByTitle, (newSearchByTitle, oldSearchByTitle)=>{
    // folderList.value = []
    pagination.value = []
    pageData.value = {page:1}
    // karaokes.value = []
    if(searchByTitle.value == true){
      // alert(searchByTitle.value)
      tableHeaders.value=["", "Title","Artist", "Type", "" ]
      getTitles()
    }
    else{
      tableHeaders.value=["Title","Artist", "Type", "" ]
      getFolders()
    }

})
watch(isPlaying, (newIsPlaying, oldIsPlaying)=>{
  // console.log(isPlaying.value)
  // AUTOPLAY WATCHER makes player play all songs from playlist
  if(isPlaying){
    
    if(timePlayed.value >= trackLength.value){
      // console.log("se acabo la cancion")
      if(!isPlaying.value){
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
    }
  }
})

watch(reproductionList.value, (newValue, oldValue) => {
  hideClass.value =true
  // console.log(newValue, oldValue)
}
  )

watch(searchArtist, (newValue, oldValue) =>{
    // console.log(oldValue, newValue)
    // folderList.value = []
    console.log(searchArtist.value)
    pagination.value = []
    pageData.value = {page:1}
    karaokes.value = []
    if(searchByTitle.value == true){
        getTitles()
      }else{
        getFolders()
      }
  })
//#endregion  ********WATCHERS******

// #region FUNCTIONS
function loadPlayer(filename) {
  // This function loads a track and
  // starts the player

  if(currentKaraoke.value['data'].media_type == 'KAR'){
  //!! CODE TO DESTROY PLAYER
  //!! CODE TO DESTROY PLAYER
  try{
    // sets audio player with null src to stop it
    const audio_player = document.getElementById('audio-player');
    const cdg_controls = document.getElementById('cdg_controls');
    console.log(audio_player)
    audio_player.src = "" 
    audio_player.style.display = "none"
    cdg_controls.style.display = "block"
  }catch(error){

  }
  const btn = document.getElementById('play-karaoke')

  try {
   let clearWrapper = document.getElementById('cdg_wrapper');
    let clearControls = document.getElementById('cdg_controls')
    clearWrapper.innerHTML = '';
    clearControls.innerHTML ='';
   
  } catch (error) {
    console.log(error, " This is error from loadPlayer function line 161")
  }
  try {
    // this code Destroys karaoke player
    btn.addEventListener('click',()=>{
    player.destroy()
 
    // console.log('erased')
})
  } catch (error) {
    console.log(error, " This is error from loadPlayer function line 170")
  }
      //CREATE PLAYER 
    const player = new CDGPlayer('#cdg_wrapper');
    const controls = new CDGControls('#cdg_controls', player, {
        position: 'top',
      });
// #! ***************************************
      //CHECK STATUS OF PLAYER
      const statusChanged = player.props.on('status', (val) => {
        // console.log('Status: ', val);
        // console.log(player.props)
        if (val === 'File Loaded') {
          player.start();
        }
      });

      //CHECK LOADING OF PLAYER
      const onLoadingChange = player.props.on('loading', (val, prev) => {
        // console.log(val, prev)
          if (val !== prev) {

          }
      });
      // CHECK STATUS OF PLAYER
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
      // TIMEOUT TO SHOW ALL PROPS OF PLAYER
      // DEBUG PURPOSES
      setTimeout(() => {
          console.log(player)
          // console.log(player.props.timePlayed)
          // console.log(player.tag.APIC.data.data)
          let img = document.getElementById('img-cover')
        
          let mig = document.createElement('svg')
          mig.width = '100'
          mig.height = '100'
          img.appendChild(mig)
        },10000
        
        )
          let interval = setInterval(() => {
            isPlaying.value = player.props.isPlaying
          if (player.props.isPlaying){
            // console.log(player.props)
            // need seconds to compare when track is over
            // conversion of time to seconds
            let min = Number(player.props.trackLength.split(':')[0]) * 60 
            let sec =  Number(player.props.trackLength.split(':')[1])
            let seconds = min + sec-3
            let min_played = Number(player.props.timePlayed.split(':')[0]) * 60 
            let sec_played =  Number(player.props.timePlayed.split(':')[1])
            let seconds_played = min_played + sec_played
            // change the value of time played and total time of track 
            trackLength.value = seconds
            timePlayed.value = seconds_played


          }
        }, 1000);
        player.load(filename);
        // console.log('this are the props')
        // console.log(player.props)
// #! ***************************************



  }else{
    //  const player = new CDGPlayer('#cdg_wrapper');
    // const controls = new CDGControls('#cdg_controls', player, {
    //     position: 'top',
    //   });
    hideClass.value =false
  }
 



}

// #! GET KARAOKES TRACK BY CURRENT KARAOKE VALUE actual file as a arrayBuffer

async function getKaraoke() {
   console.log("currentKaraoke.value =  " + currentKaraoke.value["data"].track)
  //  if track is a karaoke we download as a buffer
  // to load it on CDGPLAYER
  if(currentKaraoke.value["data"].media_type=="KAR"){
  // console.log("THIS IS URL ",`http://localhost:8000/media/${currentKaraoke.value["data"].track}`, " THIS IS URL")
  try {
      const response = await fetch("http://localhost:8000/media/"+currentKaraoke.value["data"].track);
      // console.log(currentKaraoke, "si este es")
      const karaoke = await response.arrayBuffer()
      loadPlayer(karaoke)
  } catch (error) {
    console.log("Could not get media from server: ", error)
  }
  }
  else if(currentKaraoke.value["data"].media_type=="AUD"){
    // Get the audio file, load it on the player and play
    // hideClass.value = false
    console.log("currentKaraoke.value =  " + currentKaraoke.value["data"].track)
    const audio_player = document.getElementById('audio-player');
    const cdg_controls = document.getElementById('cdg_controls');
    console.log(audio_player)
    audio_player.style.display = "block"
    cdg_controls.style.display = "none"

    audio_player.src = `http://localhost:8000/media/${currentKaraoke.value["data"].track}` 
    audio_player.load()
    audio_player.play()
    audio_player.addEventListener('ended', nextKaraoke)
  }
};

// DELETE elements by index
function deleteElement(index){
  reproductionList.value.splice(index,1)
   // create cookie for reproduction list
   // after we delete a track
   let json_str = JSON.stringify(reproductionList.value)
  setCookie("reproductionlist", json_str, 1)
}

// PLAY KARAOKE
function clickPlay(e, event){
  const btnPlay = document.getElementById('play-karaoke')
  // This event destroys the karaoke player
  btnPlay.click(e,event);
  
  console.log(event)

}

// ADDS OBJECT TO REPRODUCTION LIST
const addToReproductionList = (index) => {
  
  reproductionList.value.push(karaokes.value[index]);
  console.log(reproductionList.value)
  // create cookie for reproduction list
  // after we add a track
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

// SETS THE COOKIE
function setCookie(cname, cvalue, exdays){
  // set the cookie
  const d = new Date()
  d.setTime(d.getTime() + (exdays*24*60*60*1000))
  let expires = "expires="+ d.toUTCString()
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";

}

// #region GET COOKIE
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
// #endregion GET COOKIE

async function getImage(imageUrl) {
let baseUrl = "http://localhost:8000/media/"
const response = await fetch(baseUrl+imageUrl);
const img = await response.blob()
 return img
// console.log(files)
};

//#region GETS ALL THE KARAOKES AND FILTERS IF THERE IS A SEARCH STRING
// ********************************************************************
async function getFolders() {
  // alert('DATA IS BEING FETCHED')

let baseUrl = `${url.value}api/show_artist/?sbt=${searchByTitle.value}&artist=${searchArtist.value}&page=${pageData.value.page}`
karaokes.value = [] // NEW CODE 3-15-24
folderList.value = []
const response = await fetch(baseUrl);
const files = await response.json()


// karaokes.value = files
folderList.value = Object.groupBy(files.data, ({artist}) => artist)
pagination.value = files.page
pageData.value.page = files.page.current

if (pageData.value.page == 0){
  page_prev.value = pagination.current
}

console.log("folderList groupeBy")
console.log(folderList.value)
console.log("folderList groupeBy")

};
async function getTitles() {
  // alert('DATA IS BEING FETCHED')
karaokes.value = [] // NEW CODE 3-15-24
let baseUrl = `${url.value}api/show_title/?sbt=${searchByTitle.value}&title=${searchArtist.value}&page=${pageData.value.page}`

const response = await fetch(baseUrl);
const files = await response.json()
console.log(files)

// karaokes.value = files
karaokes.value = files.data 
// Object.groupBy(files.data, ({artist}) => artist)
pagination.value = files.page
pageData.value.page = files.page.current

if (pageData.value.page == 0){
  page_prev.value = pagination.current
}

console.log("folderList TITLE")
console.log(titleList.value)
console.log("folderList TITLE")

};
//#endregion GETS ALL THE KARAOKES AND FILTERS IF THERE IS A SEARCH STRING


//#region PAGINATION FUNCTIONS
function selectedPage(page){
  console.log(page, "este es el page")
  pageData.value.page = page
  if(searchByTitle.value == true){
    return getTitles()
  }
  getFolders()
}
function nextPage(){
  if(pagination.value.has_next){
    pageData.value.page += 1
    if(searchByTitle){
      return getTitles()
    }
    getFolders()
  }
}
function previousPage(){
  if(pagination.value.has_previous){
    pageData.value.page -= 1
    if(searchByTitle){
      return getTitles()
    }
    getFolders()
  }
}
//#endregion PAGINATION FUNCTIONS

// handles click on folders to add information on table of karaokes
// ***************************
// FUNCTION TO FETCH KARAOKES from an artist ID 
// ***************************
async function folderSelected(folder){
  // console.log(folder)
  // return
  const response = await fetch(`http://localhost:8000/api/show_tracks/?id=${folder}`)
  const files = await response.json()
  karaokes.value = files.data
  console.log(karaokes.value.title)
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
  // alert(currentKaraoke.value['data'].track)
     
  let next = currentKaraoke.value["index"]  +1
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
  // Check for currrentKaraoke.value to: 
  // we select the button that the player has and 
  // perform a click on it OR click puase on audio
  const toggle_pause = document.getElementById('pause-karaoke');
  if(currentKaraoke.value["data"].media_type=="KAR"){
    let btnPause = document.getElementsByClassName('playButton')
    btnPause[0].click()
    if(isPlaying.value == false){
      toggle_pause.innerHTML = "Pause"
    }
    else(
      toggle_pause.innerHTML = "Play"

    )
    
  }else{
    const audio_player = document.getElementById('audio-player');

    if(!audio_player.paused){
      toggle_pause.innerHTML = "Play"
      return  audio_player.pause()
    }
    audio_player.play()
    toggle_pause.innerHTML = "Pause"

  }
}
//#endregion Karaoke PREVIOUS NEXT PAUSE PLAY

// #endregion FUNCTIONS

function updateSearch(e){
  console.log(e)
}
// #region x

// function moveToLeft(){
//   // let cards = document.querySelector("[class^=card-]")
//   let element = document.getElementById('card-1')
//   let element2 = document.getElementById('card-2')
//   let element3 = document.getElementById('card-3')
//   let element4 = document.getElementById('card-4')


  

//     let first1 = window.getComputedStyle(element)
//     let leftValue1 = first1.getPropertyValue('left').replace("px", "")
//     element.style.left = (Number(leftValue1)- 20) + "rem"

//     let first2 = window.getComputedStyle(element2)
//     let leftValue2 = first2.getPropertyValue('left').replace("px", "")
//     element2.style.left = (Number(leftValue2)- 20) + "rem"

//     let first3 = window.getComputedStyle(element3)
//     let leftValue3 = first3.getPropertyValue('left').replace("px", "")
//     element3.style.left = (Number(leftValue3)- 20) + "rem"

//     // let first4 = window.getComputedStyle(element4)
//     // let leftValue4 = first4.getPropertyValue('left').replace("px", "").replace("rem", "")
//     // element4.style.left = (Number(leftValue4)- 20) + "rem"

  

//   return 0
//   let cOne = document.getElementById('card-1'); 
//   let cTwo = document.getElementById('card-2'); 
//   let cThree = document.getElementById('card-3'); 
//   let cFour = document.getElementById('card-4');
//   let cFive = document.getElementById('phantom-card');
 
//   cOne.classList.add('move-desapear');
//   cTwo.classList.add('move-left');
//   cThree.classList.add('move-left');
//   cFour.classList.add('move-left');
//   cFive.classList.add('move-last');

//  setTimeout(()=>{
//   cOne.classList.remove('move-desapear');
//   cTwo.classList.remove('move-left');
//   cThree.classList.remove('move-left');
//   cFour.classList.remove('move-left');
//   cFive.classList.remove('move-last');
//   console.log('class removed')
//  },1000) 

// }
// function moveToRight(){
//     let element = document.getElementById('card-1')
//     let element2 = document.getElementById('card-2')
//     let element3 = document.getElementById('card-3')
//     let element4 = document.getElementById('card-4')

//     let first1 = window.getComputedStyle(element)
//     let leftValue1 = first1.getPropertyValue('right').replace("px", "")
//     element.style.left = (Number(leftValue1)+ 20) + "rem"

//     let first2 = window.getComputedStyle(element2)
//     let leftValue2 = first2.getPropertyValue('right').replace("px", "")
//     element2.style.left = (Number(leftValue2)+ 20) + "rem"

//     let first3 = window.getComputedStyle(element3)
//     let leftValue3 = first3.getPropertyValue('right').replace("px", "")
//     element3.style.left = (Number(leftValue3)+ 20) + "rem"

//     // let first4 = window.getComputedStyle(element4)
//     // let leftValue4 = first4.getPropertyValue('left').replace("px", "").replace("rem", "")
//     // element4.style.left = (Number(leftValue4)+ 20) + "rem"


// }
// #endregion x
</script>

<template>
<div class="main-player">
  <div className="greetings cdg-container" id="player-container">
    <!--#region AUDIOPLAYER -->
      <div class="audio-player">
        <div class="player m-1">
          <audio class="form-control bg-black text-white" id="audio-player" src="" controls controlsList="nodownload"></audio>
          <video ref="videoRef" src="" id="video-container" width="100%" controls controlsList="nodownload">here is videwo</video>
        </div>
      </div>
    <!--#endregion AUDIOPLAYER -->

    <!--#region CDGPLAYER -->
      <div class="cdg-player-container">
        <div className="cdg-player"  style="visibility: visible">
          <div :class="{'hide': hideClass}" id="img-cover"></div>
          <div id="cdg_controls"></div>
          <div id="cdg_wrapper"></div>
        </div>  
      </div>
      <!--#endregion CDGPLAYER -->

  </div>


  <div class="search-container">
      <!--#region search and keyboard-->
      <div class="search">
        <div class="search-string">
          <span class="text-warning">
            <label for="artist-check">Artist</label> 
            <input class="p-1" type="checkbox" name="artist" id="artist-check" @change="searchByTitle = !searchByTitle">      
            <label class="" for="artist-check">Title</label> 
            <p class="text-white">{{ searchArtist }}</p>
            </span>
          
        </div>
        <!-- ON SCREEN KEYBOARD -->
        <OnScreenKeyboard 
          @sendString="(value) => searchArtist = value" 
          @sendBackSpace="(value) => searchArtist = value"
          />  
      </div><!--#endregion search and keyboard-->




  </div>

  <div class="play-list-container">
      <div className="buttons-controls">
        <div className="btn-inside-controls">
          <button className="btn btn-outline-info" @click="prevKaraoke()" id="prev-karaoke">&lt; &lt;</button>
          <button className="btn btn-outline-success" @click="getKaraoke()" id="play-karaoke">Start</button>
          <button className="btn btn-outline-info" @click="nextKaraoke()" id="next-karaoke">&gt;  &gt;</button>
          <button className="btn btn-outline-primary" @click="pausePlay()" id="pause-karaoke">Pause</button>
        </div>
        <button className="btn btn-outline-warning" id="full-screen">Full Screen</button>  
      </div>

      <!--#region PLAY LIST  -->
      <template v-if="!reproductionList">LOADING...</template>
      <template v-else>

        <h6 className="text-center">PLAY LIST</h6>
        <div v-if="reproductionList.length > 0" class="play-list">
          <table calssName="d-grid">
            <thead>
              <tr>
                <th>Title</th>
                <th>Artist</th>
                <th>Type</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(karaoke, index) in reproductionList" :key="index">
                <td>{{karaoke.title}}</td>
                <td>{{karaoke.artist}}</td>
                <td>{{karaoke.media_type}}</td>
                <td v-if="currentKaraoke.data.title == karaoke.title">  
                  <img width="50" height="25" src="../assets/equalizer_white.gif" alt="shows playing equalizer">
                </td> 
                <td v-else></td>
                <td className="d-grid"><button @click="deleteElement(index)" className="btn btn-outline-danger m-1">Delete</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
      <!--#endregion PLAY LIST  -->

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
       
<!-- ---------------------------------- -->
  <!--#region ALL SONGS by ARTIST-->
        <template v-if="!searchByTitle">
          <TrackTable
          :headers="tableHeaders" 
          :karaokes="karaokes"
          :url="mediaBaseUrl"
          @addTrack="addToReproductionList"/>
        </template>
        <!--endregion all SONGS by ARTIST-->
        
        <!--#region ALL SONGS by TITLE-->
        <template v-else>
          <TrackTable
              :headers="tableHeaders" 
              :karaokes="karaokes"
              :url="mediaBaseUrl"
              @addTrack="addToReproductionList"/>
        </template>    
        <!--endregion all SONGS by TITLE-->
         
      <!-- !AQUI VAMOS A PONER EL CARD FOLDER COMPONENT -->
    
    <!--#region CARD FOLDERS -->
    <div v-if="!searchByTitle" class="card-folders mb-1 mt-1">
        <CardsKaraoke 
            :folderList="folderList" 
            :url="mediaBaseUrl" 
            @sendId="folderSelected" />
        <!-- <button class="btn btn-outline-primary btn-rounded" @click="moveToLeft()">&lt;</button> -->
          
        <!-- <button id="top-btn" class="btn btn-outline-primary  btn-rounded" @click="moveToRight()">&gt;</button> -->
    </div>
    <div v-else class="text-center">
      <h6>Best Karaoke Software</h6>
      <img style="margin: auto;" width="100" height="50" src="../assets/aqua_logo.png" alt="">
    </div>
  <!--#endregion CARD FOLDERS -->
   <!-- #region PAGINATION -->
  <!-- !!!!!!!  PAGINATION  !!!!!!!! -->
         <p class="text-center text-white">
          Current page: 
          <strong>{{ pagination.current }}
          </strong> of <strong>{{ pagination.num_pages }}</strong> 
          Total records: <strong>{{ pagination.total_records }}</strong>
        </p>
    <div class="pagination m-auto" style="max-width: 30rem;">
    
      <span v-if="pagination.has_previous">
      <button class="btn btn-primary me-1"  @click="selectedPage(1)"> 
          &laquo;First
        </button>
        <span >
          <button class="btn btn-primary me-1" @click="selectedPage(pagination.previous_page_number)"> 
            Previous
          </button>
          
        </span>
      </span>
      <span v-if="pagination.previous_page_number != 1">
        <button @click="selectedPage(pagination.previous_page_number)" 
        class="btn btn-primary me-2"><b>{{pagination.previous_page_number}}</b>
        </button> 
      </span>
      <span>
        <button 
        class="btn btn-outline-primary me-2"><b>{{pagination.current}}</b>
        </button> 
      </span>

      <span v-if="pagination.has_next">
          <button @click="selectedPage(pagination.next_page_number)" 
          class="btn btn-primary form-control me-1">{{pagination.next_page_number}}</button> 
      </span>
          <span v-if="pagination.current != pagination.num_pages">
              <button class="btn btn-primary me-1" 
              @click="selectedPage(pagination.next_page_number)">Next</button>
              <button class="btn btn-primary me-1" 
              @click="selectedPage(pagination.num_pages)">Last&raquo;</button>
          </span>
  </div>
  <!-- !!!!!!  END PAGINATION !!!!!!!!! -->
  <!-- #endregion PAGINATION -->
    </div> <!-- end all-songs-container -->
 </div> <!-- end main-player -->

</template>


