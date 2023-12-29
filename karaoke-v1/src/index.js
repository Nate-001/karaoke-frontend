import { CDGPlayer, CDGControls } from '/node_modules/cdgplayer/dist/cdgplayer.js';
let baseUrl = "http://localhost:8000/media/karaoke/" 
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
  setTimeout(() => {
    console.log(player)
    console.log(player.props.timePlayed)
    console.log(player.tag.APIC.data.data)
    let img = document.getElementById('img-cover')

    let mig = document.createElement('svg')
    mig.width = '100'
    mig.height = '100'
    img.appendChild(mig)
  },10000
    
  )
}


async function logKaraoke() {
  const response = await fetch(baseUrl+"SF365-01 - Kungs vs Cookin' on 3 Burners - This Girl.zip");
  const karaoke = await response.arrayBuffer()
  setState('loading')
  loadPlayer(karaoke)
    const files = karaoke;
    try {
      karaoke[0];
      setState('cdg');
    } catch (error) {
      alert(error);
    }

};
async function logFiles() {
  const response = await fetch(baseUrl);
  const files = await response.arrayBuffer()
  console.log(files)
};

window.addEventListener('load',() => {
  
  let playbtn = document.getElementById('play-karaoke')
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


  // !PLAY BUTTON
  playbtn.addEventListener('click', () =>{
    console.log('button pressed')
    logKaraoke()
    console.log("PLAYER: "+divPlayer.props)
  })
} )

// (function () {
//   playbtn = document.getscreenentById('play-karaoke')
//   playbtn.addEventListener('click', () =>{
//     console.log('button pressed')
//     logKaraoke()
//   })
  // logKaraoke()
  // console.log('file read')
  // const fileReader = new FileReader();
  // setState('loading');
  // fileReader.onload = (fileEvent) => loadPlayer(fileEvent.target.result);
  // loadPlayer(file)
  // document.querySelector('#file-select').addEventListener('change', (event) => {
  //   const files = event.target.files;
  //   try {
  //     fileReader.readAsArrayBuffer(files[0]);
  //     setState('cdg');
  //   } catch (error) {
  //     alert(error);
  //   }
  // });
// })();
