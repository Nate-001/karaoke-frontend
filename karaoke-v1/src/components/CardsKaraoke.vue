<script setup>
import {ref, defineEmits} from 'vue'

const props = defineProps({
    folderList: Object,
    url: String
})

const emit = defineEmits(['sendId'])

const sendId = (id)=>{
    emit('sendId', id)
}
</script>

<template>
    <!--#region CARD FOLDERS -->
    <div class="card-folders">
 
      <!-- <button class="btn btn-outline-primary btn-rounded" @click="moveToLeft()">&lt;</button> -->
          <div class="cards-only">
              <div v-for="(folder, artist) in folderList" :key="folder[0].id" class="for"  @click="sendId(folder[0].id)">
                <div :id="'card-'+folder[0].id" class="card move-card"  @click="console.log(folder[0].artist, folder[0].id)">
                  <div class="flip-card">
                    <div class="flip-card-inner">
                      <div class="flip-card-front">
                        <img class="img-front" :src="url+folder[0].img" alt="artist">
                        <div class="containers">
                          <h6>
                            <small>{{artist}}</small>
                          </h6>
                        </div>
                      </div>
                      <div class="flip-card-back">
                        <img  class="img-back" :src="url+folder[0].img" alt="artist">
                        <div class="containers">
                          <h6>
                            <small>{{artist}}</small>
                          </h6>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          </div>
      <!-- <button id="top-btn" class="btn btn-outline-primary  btn-rounded" @click="moveToRight()">&gt;</button> -->
    </div>
<!--#endregion CARD FOLDERS -->
</template>