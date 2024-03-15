<script setup> 
// import MyButton from './MyButton.vue';
import {ref} from 'vue'
const searchString = ref('')

const props = defineProps({
    headers: Array,
    karaokes: Array
})

const emit = defineEmits(['addTrack'])
const addToList = (id) =>{
    emit('addTrack', id)
}
</script>

<template>
    <div class="all-songs">
      <h2 class="text-center">Artist and Albums</h2>
    <table calss="d-grid">
      <thead >
        <tr>
          <th v-for="(header, index) in headers" :key="index" class="d-flex">{{header}}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(karaoke, index) in karaokes" :key="index">
          <td>{{karaoke.title}}</td>
          <td>{{karaoke.artist}}</td>
          <td className="d-grid"><button @click="addToList(index)" className="btn btn-outline-success mt-1">Add</button></td>
        </tr>
       
      </tbody>
    </table>
    </div>
</template>