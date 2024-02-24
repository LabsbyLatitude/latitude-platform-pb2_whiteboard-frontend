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
                        # {{ classData.ownerID }} 
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
        <!-- hide this until grading is implemented -->
        <!-- could also bin closed assignments here -->
        <v-tab key="3" v-if="isInstructorOrAdmin">Grades</v-tab>
      </v-tabs>

      <v-tabs-items v-model="currentTab"
      v-if="assignments !== null"
      >
      <!-- Scheduled Assignments -->
        <v-tab-item :value="isInstructorOrAdmin ? 0 : -1">
          <AssignmentBrowser
          :assignments="scheduledAssignments"
          :clickHandler="assingmentClickHandler">
          </AssignmentBrowser>    
        </v-tab-item>
        
        <!-- Open Assignments -->
        <v-tab-item :value="isInstructorOrAdmin ? 1 : 0">
          <AssignmentBrowser
          :assignments="openAssignments"
          :clickHandler="assingmentClickHandler">
          </AssignmentBrowser>    
        </v-tab-item>

        <!-- Closed Assignments -->
        <v-tab-item :value="isInstructorOrAdmin ? 2 : 1">
          <AssignmentBrowser
          :assignments="closedAssignments"
          :clickHandler="assingmentClickHandler">
          </AssignmentBrowser>              
        </v-tab-item>
      </v-tabs-items>


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
    },
    /**
     * return assignments with an open date in the future
     */
    scheduledAssignments() {
      return this.assignments.filter((assignment) => {
        let scheduled;
        let now = Date.now();
        
        // if no open date, then this assignment is scheduled
        if (!assignment.openDate) {
          scheduled = true
        } else {
          let openDate = new Date(assignment.openDate);
          scheduled = openDate > now; 
        }
        
        return scheduled;
      });
    },
    /**
     * return assignments with an open date in the past
     * and a due date in the future
     */
    openAssignments() {
      return this.assignments.filter((assignment) => {
        let closed, scheduled;
        let now = Date.now();
        // if no due date, then this assignment isn't closed
        if (!assignment.dueDate) {
          closed = false;
        } else {
          let dueDate = new Date(assignment.dueDate);
          closed = dueDate < now;
        }

        // if no open date, then this assignment is scheduled
        if (!assignment.openDate) {
          scheduled = true
        } else {
          let openDate = new Date(assignment.openDate);
          scheduled = openDate > now; 
        }
        
        return !scheduled && !closed;
      });
    },
    /**
     * return assignments with a due date in the past
     */
    closedAssignments() {
      return this.assignments.filter((assignment) => {
        let closed;
        let now = Date.now();
        // if no due date, then this assignment isn't closed
        if (!assignment.dueDate) {
          closed = false;
        } else {
          let dueDate = new Date(assignment.dueDate);
          closed = dueDate < now;
        }

        return closed;
      });
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
    // console.log(`Class ID ${id}`);
    this.getClassAssignments(id);

  },
  methods: {
    async getClassData() {
      const { classID } = this.$route.params;
      let responseData = await api.fetchClass(classID);
      // console.log(`response data ${JSON.stringify(responseData)}`);
      if (responseData instanceof Array) {
        this.classData = responseData[0];
      }

      return Promise.resolve(this.classData);
    },
    /**
     * Retrieve assignments data for this class
     * @param {number} classID the ID of the class
     */
    async getClassAssignments(classID) {

      let assignmentData = await api.fetchClassAssignments(classID);
      if (assignmentData instanceof Array) {
        this.assignments = assignmentData;
      }
      
      // console.log(assignmentData);

    },
    /**
     * Performs appropriate actions when the user clicks an entry in 
     *    the AssignmentBrowser component. Students are navigated to their
     *    submission for the assingnment, teachers are navigated to the 
     *    assignment submission page for that assignment.
     * @param {Object} item a v-data-table item as returned by the click:row event 
     * of v-data-table component
     *    {@see https://v2.vuetifyjs.com/en/api/v-data-table/#events}
     * @param {Object} props props object as passed to item slot of v-data-table row
     * @param {Object} mouseEvent js MouseEvent
     */
    assingmentClickHandler(item, props, mouseEvent) {
      // console.log(item, props, mouseEvent);
      
      // check if row data was given
      if (!item || isNaN(item.id)) {
        return;
      }

      // get id of the assignment table row item clicked
      let assignmentID = item.id;

      // for students, navigate to the assignment page
      if (!this.isInstructorOrAdmin) {
        this.$router.push({
          path: `/assignment/${assignmentID}`
        })
      }
      // for instructors, navigate to the assignment submissions page
      else {
        this.$router.push({
          path: `/assignment/${assignmentID}`
        })
      }
    }
  },
},)
</script>

<style scoped>

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

::v-deep .theme--light.v-tabs-items {
  background-color: var(--v-background-base, #F1F2F4);
}
</style>