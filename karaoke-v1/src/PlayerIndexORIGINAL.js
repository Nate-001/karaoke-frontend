import { CDGPlayer, CDGControls } from '/node_modules/cdgplayer/dist/cdgplayer.js';

function setState(state) {
  switch (state) {
    case 'loading':
      document.querySelector('#file-select-container').style.visibility =
        'visible';
      document.querySelector('.cdg-player').style.visibility = 'hidden';
      break;
    case 'cdg':
      document.querySelector('#file-select-container').style.visibility =
        'hidden';
      document.querySelector('.cdg-player').style.visibility = 'visible';
      break;
    default:
      alert('unknown state');
  }
}

function loadPlayer(filename) {
  const player = new CDGPlayer('#cdg_wrapper');
  const controls = new CDGControls('#cdg_controls', player, {
    position: 'top',
  });
  const statusChanged = player.props.on('status', (val) => {
    console.log('Status: ', val);
    if (val === 'File Loaded') {
      player.start();
    }
  });
  player.load(filename);
}


// (function () {
//   const fileReader = new FileReader();
//   setState('loading');
//   fileReader.onload = (fileEvent) => loadPlayer(fileEvent.target.result);
//   document.querySelector('#file-select').addEventListener('change', (event) => {
//     const files = event.target.files;
//     try {
//       fileReader.readAsArrayBuffer(files[0]);
//       setState('cdg');
//     } catch (error) {
//       alert(error);
//     }
//   });
// })();
// (function () {
//   const fileReader = new FileReader();
//   setState('loading');
//   fileReader.onload = (fileEvent) => loadPlayer(fileEvent.target.result);
//   document.querySelector('#file-select').addEventListener('change', (event) => {
//     const files = event.target.files;
//     try {
//       fileReader.readAsArrayBuffer(files[0]);
//       setState('cdg');
//     } catch (error) {
//       alert(error);
//     }
//   });
// })();
// window.addEventListener('load', () =>{
//     (function () {
//     const btn = document.getElementById('file-slect2')
//     console.log(typeof( btn.value))  
//     btn.addEventListener('click', ()=>{
//         loadPlayer('http://127.0.0.1:8000/media/music/Alejandro Montaner/0353_Dimelo_Pop.zip')
//       })
//   })();
// })


// (async function (){
//   const response = await fetch("http://127.0.0.1:8000/media/music/A 5/1403_Supervisor_De_Tus_Sueños_Pop.zip");
//   console.log(response)
//   const kar = await response.arrayBuffer()
//   loadPlayer(kar)
// })();
const playKaraoke = async function (){
    const response = await fetch("http://127.0.0.1:8000/media/music/A 5/1403_Supervisor_De_Tus_Sueños_Pop.zip");
    console.log(response)
    const kar = await response.arrayBuffer()
    loadPlayer(kar)
}

document.addEventListener('DOMContentLoaded', () =>{
  console.log("hello")
  let buttons = document.querySelectorAll(".play-btn")
  console.log(buttons)
  for(let i =0; i<buttons.length; i++){
    console.log(buttons)
    buttons[i].addEventListener('click', ()=>{
      console.log(buttons[i])
      playKaraoke()
    })
  }
})

export default loadPlayer