<template>
  <div>
    <!-- Page Header -->
    <header>
      <!-- header container with background color and centering -->
      <v-container fluid class="header-section pt-0 pb-0">
        <!-- header inner container to constrain max width of header elements-->
        <v-container class="header-details">
          <v-row class=" mt-5 mb-3"
          justify="center">
            <!-- Header Image -->
            <v-col 
            cols="12" sm="4" 
            class="header-details-image px-sm-10">
              <v-img :src="headerImage">
              </v-img>
            </v-col>
            
            <!-- Header Text -->
            <v-col 
            cols="12" sm="8"
            class="px-sm-10 white--text">
              <!-- Header Title -->
              <v-row 
              class="ga-10 mb-3"
              justify="center" justify-sm="start">
                <!-- Class Title -->
                <v-col
                cols="auto">
                  <h1 class="text-h1 font-weight-medium pt-xs-0 pt-sm-5">
                    {{ classData.title }}
                  </h1>
                </v-col>
                
                <!-- Class Attribution -->
                <v-col 
                cols="auto"
                class="align-bottom">
                  <h3 class="text-h3 font-weight-light"> 
                    Instructor: 
                    <span class="font-weight-black">
                      # {{ classData.instructorID }} 
                    </span>
                  </h3>
                </v-col>
              </v-row>

              <!-- Header Desc. -->
              <v-row>

              </v-row>
            </v-col>
          </v-row>
          
        </v-container>

      </v-container>
    </header>

  </div>
</template>

<script>
import { defineComponent } from '@vue/runtime-dom';

import Footer from '@/components/core/Footer';
import api from '@/api'
import classHeaderImage1 from '@/assets/course_1.svg'
import classHeaderImage2 from '@/assets/course_2.svg'

export default defineComponent({
  components: {
  },
  data() {
    return {
      user: null,
      classData: {
        title: 'My Class Title',
        instructorID: 1,
      },
      headerImage: null,  
    }
  },
  computed: {
  },
  created() {
    this.user = JSON.parse(localStorage.getItem('userData'));
    this.headerImage = this.user.type === 'instructor' || this.user.type === 'admin' ?
      classHeaderImage2 : classHeaderImage1;
  }
})
</script>

<style>

.header-section {
  background-color: #3f3d56;
  opacity: .95;
}

.header-details{
  max-width: 1440px;
}

.align-bottom {
  display: flex;
  align-items: flex-end;
  justify-content: start;
}

@media (min-width: 1904px) {
  .new-container {
    max-width: 1440px;
  }
}
</style>