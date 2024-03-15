<script setup> 
// import MyButton from './MyButton.vue';
import {ref} from 'vue'
const searchString = ref('')

const props = defineProps({
    headers: Array,
    karaokes: Array
})
//#region BUTTONS
// const numbers =[
//     {btnClass:'btn',btnLabel:"1"},
//         {btnClass:'btn',btnLabel:"2"},
//         {btnClass:'btn',btnLabel:"3"},
//         {btnClass:'btn',btnLabel:"4"},
//         {btnClass:'btn',btnLabel:"5"},
//         {btnClass:'btn',btnLabel:"6"},
//         {btnClass:'btn', btnLabel:"7"},
//         {btnClass:'btn',btnLabel:"8"},
//         {btnClass:'btn',btnLabel:"9"},
//         {btnClass:'btn',btnLabel:"0"}
// ]
// const qButtons = [
//     {btnClass:'btn',btnLabel:"Q"}, 
//         {btnClass:'btn',btnLabel:"W"},
//         {btnClass:'btn',btnLabel:"E"},
//         {btnClass:'btn',btnLabel:"R"},
//         {btnClass:'btn',btnLabel:"T"},
//         {btnClass:'btn',btnLabel:"Y"},
//         {btnClass:'btn',btnLabel:"U"},
//         {btnClass:'btn', btnLabel:"I"},
//         {btnClass:'btn',btnLabel:"O"},
//         {btnClass:'btn',btnLabel:"P"}]
// const aButtons = [
//     {btnClass:'btn ',btnLabel:"A"}, 
//         {btnClass:'btn ',btnLabel:"S"},
//         {btnClass:'btn ',btnLabel:"D"},
//         {btnClass:'btn ',btnLabel:"F"},
//         {btnClass:'btn ',btnLabel:"G"},
//         {btnClass:'btn ',btnLabel:"H"},
//         {btnClass:'btn ',btnLabel:"J"},
//         {btnClass:'btn ',btnLabel:"K"},
//         {btnClass:'btn ',btnLabel:"L"}]
// const zButtons = [
//     {btnClass:'btn ',btnLabel:"Z"}, 
//         {btnClass:'btn ',btnLabel:"X"},
//         {btnClass:'btn ',btnLabel:"C"},
//         {btnClass:'btn ',btnLabel:"V"},
//         {btnClass:'btn ',btnLabel:"B"},
//         {btnClass:'btn ',btnLabel:"N"},
//         {btnClass:'btn ',btnLabel:"M"}]
//#endregion BUTTONS 

// const emit = defineEmits(['sendString', 'sendBackSpace'])

// function setInput(e){
//     console.log(e.btnLabel)
//     searchString.value += e.btnLabel
//     emit('sendString', searchString.value)
// }

// function backSpace(value){
//     if(value == 'erase'){
//         searchString.value = ''

//     }else if(value=='space'){
//         searchString.value += " "
//     }else{
//         searchString.value = searchString.value.slice(0,-1)
//     }

//     emit('sendBackSpace', searchString.value)
//     console.log(value)
    
// }

const emit = defineEmits(['addTrack'])
const addToList = (id) =>{
    emit('addTrack', id)
}
</script>

<template>
    <div class="all-songs">
      <h2 class="text-center">Artist and Albums</h2>
    <table calss="d-grid">
      <thead v-for="(header, index) in headers" :key="index">
        <tr style="background:red;" class="d" >
          <th class="d-flex">{{header}}</th>
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