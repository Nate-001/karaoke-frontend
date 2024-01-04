<script setup> 
import MyButton from './MyButton.vue';
import {defineEmits,ref} from 'vue'
const searchString = ref('')
//#region BUTTONS
const qButtons = [
    {btnClass:'btn',btnLabel:"Q"}, 
        {btnClass:'btn',btnLabel:"W"},
        {btnClass:'btn',btnLabel:"E"},
        {btnClass:'btn',btnLabel:"R"},
        {btnClass:'btn',btnLabel:"T"},
        {btnClass:'btn',btnLabel:"Y"},
        {btnClass:'btn',btnLabel:"U"},
        {btnClass:'btn', btnLabel:"I"},
        {btnClass:'btn',btnLabel:"O"},
        {btnClass:'btn',btnLabel:"P"}]
const aButtons = [
    {btnClass:'btn ',btnLabel:"A"}, 
        {btnClass:'btn ',btnLabel:"S"},
        {btnClass:'btn ',btnLabel:"D"},
        {btnClass:'btn ',btnLabel:"F"},
        {btnClass:'btn ',btnLabel:"G"},
        {btnClass:'btn ',btnLabel:"H"},
        {btnClass:'btn ',btnLabel:"J"},
        {btnClass:'btn ',btnLabel:"K"},
        {btnClass:'btn ',btnLabel:"L"}]
const zButtons = [
    {btnClass:'btn ',btnLabel:"Z"}, 
        {btnClass:'btn ',btnLabel:"X"},
        {btnClass:'btn ',btnLabel:"C"},
        {btnClass:'btn ',btnLabel:"V"},
        {btnClass:'btn ',btnLabel:"B"},
        {btnClass:'btn ',btnLabel:"N"},
        {btnClass:'btn ',btnLabel:"M"}]
//#endregion BUTTONS 
const emit = defineEmits(['sendString', 'sendBackSpace'])

function setInput(e){
    console.log(e.btnLabel)
    searchString.value += e.btnLabel
    emit('sendString', searchString.value)
}
function backSpace(value){
    if(value == 'erase'){
        searchString.value = ''

    }else{
        searchString.value = searchString.value.slice(0,-1)
    }

    emit('sendBackSpace', searchString.value)
    console.log(value)
    
}


</script>

<template>
    <div class="main-keyboard">

            
        <div class="first-row text-center">
            <button class="btn btn-outline-success number-button m-1" 
                @click="setInput(button)"
                v-for="button in qButtons" 
                :class="button.btnClass"
                :key="button">{{button.btnLabel}}
            </button>
        </div>
        <div class="second-row text-center">
            <button class="btn btn-outline-info number-button m-1" 
                @click="setInput(button)"
                v-for="button in aButtons" 
                :class="button.btnClass"
                :key="button">{{button.btnLabel}}
            </button>
        </div>
        <div class="third-row text-center">
            <button class="btn btn-outline-primary number-button m-1" 
                @click="setInput(button)"
                v-for="button in zButtons" 
                :class="button.btnClass"
                :key="button">{{button.btnLabel}}
            </button>
        </div>
        <div class="fourth-row text-center">
            <button  
                @click="backSpace('backspace')"  
                class="btn btn-outline-warning number-button m-1">
                Back Space
            </button>
            <button  
                @click="backSpace('erase')" 
                class="btn btn-outline-danger number-button m-1">
                Erase
            </button>
        </div>
  

    </div>
</template>