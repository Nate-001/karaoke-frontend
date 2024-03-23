import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

import 'jszip/dist/jszip.min.js'
import 'jszip-utils/dist/jszip-utils.min.js'
import 'jsmediatags/dist/jsmediatags.min.js'

import './assets/main.css'
import './assets/cards.css'
import './assets/keyboard.css'
import './assets/flipcards.css'
// import './assets/style.css'
// import './assets/mediaPlayer.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from   'axios'
import VueAxios from 'vue-axios'

const app = createApp(App)

app.use(router)
app.use(VueAxios, axios)
app.mount('#app')
