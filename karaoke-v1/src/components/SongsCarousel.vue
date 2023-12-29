<template>
<div class="container ">
      <h4 class="mb-0 text-center text-secondary">
        <strong>Math</strong> 
         User: {{ theUser }}
      </h4>
      <div class="scroll">
        <table class="table table-striped m-auto text-center">
        <thead class="text-white bg-primary">
            <tr>
                <th>Avatar</th>
                <th>User</th>
                <th>Score</th>
                <th>Game</th>
                <th>Operation</th>
                <th>Max Num</th>
                <th>Created</th>
            </tr>
        </thead>
        <tbody class="table-group-divider">
            <tr v-for="item in math" :key="item.user_id">
                <td v-if="item.user__avatar"><img :src="`${path + item.user__avatar}`" alt="avatar"></td>
                <td v-else><img src="@/assets/logo.png" alt="logo"></td>
                <td v-if="item.user__username == theUser" class="text-primary">
                    My Score
                </td>
                <td v-else> {{ item.user__username }}</td>
                <td>{{ item.score }}</td>
                   
                <td>{{ item.game }}</td>
                <td>{{ item.operation }}</td>
                <td>{{ item.max_number }}</td>
                <td>{{ getDateTime(Date.parse(item.created)) }}</td>
            </tr>
        </tbody>
        </table>
      </div>
      <!-- #! PAGINATION -->
      <p class="text-center">

  Current page: <strong>{{ pagination.current }}
        </strong> of <strong>{{ pagination.num_pages }}</strong> 
      </p>
       
<div class="pagination m-auto" style="max-width: 30rem;">
  
     <span v-if="pagination.has_previous">
     <button class="btn btn-primary" @click="selectedPage(1)"> 
        &laquo;First
      </button>
     <button class="btn btn-primary" @click="previousPage()"> 
        Previous
      </button>
     </span>
        <button @click="selectedPage(page_prev)" 
        class="btn btn-primary">{{page_prev}}</button> 

     <span v-if="pagination.has_next">
        <button @click="selectedPage(page_next)" 
        class="btn btn-primary form-control">{{page_next}}</button> 
     </span>
        <span v-if="pagination.current != pagination.num_pages">
            <button class="btn btn-primary" 
            @click="nextPage()">Next</button>
            <button class="btn btn-primary" 
            @click="selectedPage(pagination.num_pages)">Last&raquo;</button>
        </span>
</div>
       <div class="divider" style="margin:5rem"></div>
</div>
</template>

<script>
export default {
  name: "SongsCarousel",
  
    data: function(){
      return {
            // items:[],
            searchText: '',
            math:[],
            sort:'score',
            sortAsc: true,
            theUser: '',
            path: '/../media/',
            pagination:[],
            page: 1,
            page_prev: 1,
            page_next: 2,
        }
    },
    methods: {
            async scores(){
            const response = (await this.axios.post("/api/leader-board/",
                  {page:this.page, order:this.sort, asc:this.sortAsc, game:"MATH", search:this.searchText})).data;
            
            // this.items = response.data
            this.math = response.data
            if (this.page_prev == 0){
              this.page_prev = this.pagination.current
            }

            this.page_next = response.page.current + 1
            this.page_prev = this.page_next - 1  
            this.pagination = response.page
            this.theUser = response.user
      
        },
        nextPage(){
          if (this.pagination.has_next){
            // console.log('si pasa por aqui')
            this.page++
      
            this.scores()
          }else{
            alert('hi ' + this.pagination.has_next)
          }
        },
        previousPage(){
          if (this.pagination.has_previous){
            this.page--
            this.scores()
          }else{
            alert('hi' + this.pagination.has_next)
          }
        },
        selectedPage(page){
          this.page = page
          this.scores()
        },
    
    getDateTime(time){
      let options = {
        year: 'numeric', month: 'numeric', day: 'numeric',
        hour12: true, hour: 'numeric', minute: 'numeric'
      } 
      let date = new Date(time)
      return(date.toLocaleDateString("en-US", options))
    },
    getTextValue(){
        const searchText = document.getElementById('searchText')
        const searchButton  = document.getElementById('searchButton')

        this.searchText = searchText.value
        searchText.addEventListener('change', () => {
          this.searchText = searchText.value
          this.scores()
          })

        searchButton.addEventListener('click', (e) => {
          e.preventDefault()
          this.scores()
          
        })
    }
    },

    mounted() {
        this.getTextValue()
        this.scores()
    }

}
</script>

