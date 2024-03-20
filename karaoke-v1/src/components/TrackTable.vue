<script setup> 
// import MyButton from './MyButton.vue';
import {ref} from 'vue'
const searchString = ref('')

const props = defineProps({
    headers: Array,
    karaokes: Array,
    url: String
})

const emit = defineEmits(['addTrack'])
const addToList = (id) =>{
  
    emit('addTrack', id)
}
</script>

<template>
  <span>

    <h6 class="text-center">Artist and Albums</h6>
    <div class="all-songs">
      <table id="x-table">
        <thead>
          <tr class="t-headers">
            <th v-for="(header, index) in headers" :key="index">{{header}}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(karaoke, index) in karaokes" :key="index" @click="addToList(index)">
            <td class="text-center" v-if="karaoke.img">
              <img width="35" height="25" :src="url+karaoke.img" alt="album">
            </td>
            <td>{{karaoke.title}}</td>
            <td>{{karaoke.artist}}</td>
            <td>{{karaoke.media_type}}</td>
            <td className="d-x">
              <button className="btn btn-outline-success">
                Add
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

  </span>
    <!-- <div class="all-songs">
      <h2 class="text-center">Artist and Albums</h2>
      <table calss="d-grid">
      <thead>
        <tr class="t-headers">
          <th v-for="(header, index) in headers" :key="index" class="d-flex">{{header}}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(karaoke, index) in karaokes" :key="index">
         
          <td class="text-center" v-if="karaoke.img">
            <img width="35" height="25" :src="url+karaoke.img" alt="album">
          </td>
          <td>{{karaoke.title}}</td>
          <td>{{karaoke.artist}}</td>
          <td className="d-grid"><button @click="addToList(index)" className="btn btn-outline-success mt-1">Add</button></td>
        </tr>
       
      </tbody>
    </table>
    </div> -->
</template>