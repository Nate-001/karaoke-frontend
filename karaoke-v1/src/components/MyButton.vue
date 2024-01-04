<script setup>
    const porps = defineProps({
        btnclass: String,
        label: String
        })
</script>

<template>
    <div class="row">
        <div >
         <button 
            :class="btnclass"
            @click="$emit('le-button-click')">
            {{label}}
        </button>
        </div>
    </div>
</template>
    