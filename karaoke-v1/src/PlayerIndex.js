import { CDGPlayer, CDGControls } from '/node_modules/cdgplayer/dist/cdgplayer.js';

export function loadPlayer(filename) {


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

