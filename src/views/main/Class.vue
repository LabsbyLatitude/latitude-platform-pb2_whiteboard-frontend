<template>
  
  <div>
    <template v-if="!classData">
      <Loading></Loading>
    </template>
    
    <template v-else>
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
                  style="flex-direction: column;"
                  cols="auto"
                  class="align-bottom">
                    <h3 class="text-h3 font-weight-light"> 
                      Instructor: 
                      <span class="font-weight-black">
                        # {{ classData.instructorID }} 
                      </span>
                    </h3>
                    <h4 class="font-weight-light">
                      Class Id: # {{ classData.id }}
                    </h4>
                  </v-col>
                </v-row>

                <!-- Class Desc. -->
                <v-row>
                  
                </v-row>
              </v-col>
            </v-row>
            
          </v-container>

        </v-container>
      </header>

      <!-- Assignment Sections -->
      <v-tabs
        centered
        dark
        background-color="#3f3d56"
        v-model="currentTab"
        :fixed-tabs="!$vuetify.breakpoint.xs"
      >
        <v-tab key="0" v-if="isInstructorOrAdmin">Scheduled</v-tab>
        <v-tab key="1">Assignments</v-tab>
        <v-tab key="2" v-if="!isInstructorOrAdmin">Completed</v-tab>
        <v-tab key="3" v-if="isInstructorOrAdmin">Grades</v-tab>
      </v-tabs>

      <AssignmentBrowser 
      v-if="assignments !== null"
      :assignments="assignments">
      </AssignmentBrowser>    

    </template>
  </div>
</template>

<script>
import { defineComponent } from '@vue/runtime-dom';

import Loading from '@/components/Loading.vue';
import AssignmentBrowser from '@/components/class/AssignmentBrowser';
import api from '@/api'
import classHeaderImage1 from '@/assets/course_1.svg'
import classHeaderImage2 from '@/assets/course_2.svg'

export default defineComponent({
  components: {
    Loading,
    AssignmentBrowser
  },
  data() {
    return {
      user: null,
      classData: null,
      assignments: [],
      headerImage: null,
      currentTab: 0,
    }
  },
  computed: {
    isInstructorOrAdmin() {
      return api.isInstructorOrAdmin(this.user);
    }
  },
  async created() {
    // get user info from local storage
    this.user = JSON.parse(localStorage.getItem('userData'));

    // set class header image
    this.headerImage = this.user.type === 'instructor' || this.user.type === 'admin' ?
      classHeaderImage2 : classHeaderImage1;

    // set default tab to assignments for teachers
    // @todo, doesn't work
    this.currentTab = this.isInstructorOrAdmin ? 1 : 0;

    // fetch class and assignments data
    // @todo, check if loading class data failed
    let { id } = await this.getClassData();
    this.getClassAssignments(id);

  },
  methods: {
    async getClassData() {
      const { classID } = this.$route.params;
      let responseData = await api.fetchClass(classID);
      if (responseData instanceof Array) {
        this.classData = responseData;
      }
      //@TODO DELETE THIS
      this.classData = {
        id: 1,
        title: 'My Class Title',
        instructorID: 1,
      };

      return Promise.resolve(this.classData);
    },
    /**
     * Retrieve assignments data for this class
     * @param {boolean} load whether to show the loader component while awaiting the assignment data
     */
    async getClassAssignments(classID) {

      let responseData = await api.fetchClassAssignments(classID);
      if (responseData instanceof Array) {
        this.assignments = responseData;
      }
      
      //@TODO DELETE THIS
      let assignmentData = await api.fetchAllAssignments();
      console.log(assignmentData);
      this.assignments = assignmentData.data;
      

    },
  },
},)
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
  justify-content: flex-end;
}

@media (min-width: 1904px) {
  .new-container {
    max-width: 1440px;
  }
}
</style>