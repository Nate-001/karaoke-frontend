<script setup>
import {ref, defineEmits} from 'vue'

const props = defineProps({
    folderList: Object,
    url: String
})

const emit = defineEmits(['sendId'])
function changeImg(img) {
  const bgImg = document.getElementById('card-bg-blured')
  bgImg.style.backgroundImage = `url("${img}")`;
  console.log(img)
}
const sendId = (id, img)=>{
    changeImg(img)
    emit('sendId', id)
}
</script>

<template>
    <!--#region CARD FOLDERS -->
    <div class="card-folders">
    
      <!-- <button class="btn btn-outline-primary btn-rounded" @click="moveToLeft()">&lt;</button> -->
      <template v-if="Object.keys(folderList).length != 0">

        <div class="cards-only">
          <div v-for="(folder, artist) in folderList" :key="folder[0].id" class="for"  @click="sendId(id=folder[0].id, img=url+folder[0].img )">
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
        </template>
        <template v-else>

          <div class="cards-only">
            <div>
              <div class="card move-card">
                  <div class="flip-card">
                    <div class="flip-card-inner">
                      <div class="flip-card-front">
                        <img class="img-front" src="http://localhost:8000/media/img/blue_logo.png" alt="artist">
                        <div class="containers">
                          <h6>
                            <small>{{artist}}</small>
                          </h6>
                        </div>
                      </div>
                      <div class="flip-card-back">
                        <img  class="img-back" src="http://localhost:8000/media/img/orange_logo.png" alt="vue community">
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
        </template>
    </div>
<!--#endregion CARD FOLDERS -->
</template>