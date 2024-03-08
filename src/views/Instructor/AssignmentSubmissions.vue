<template>
  
  <div>
    <template v-if="!initialized">
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
                  <!-- Assignment Title -->
                  <v-col
                  cols="auto">
                    <h1 class="text-h1 font-weight-medium pt-xs-0 pt-sm-5">
                      {{ assignment.name }}
                    </h1>
                  </v-col>
                  
                  <!-- Assignment Attribution -->
                  <v-col 
                  style="flex-direction: column;"
                  cols="auto"
                  class="align-bottom">
                    <h3 class="text-h3 font-weight-light"> 
                      Instructor: 
                      <span class="font-weight-black">
                        # {{ assignment.instructorID }} 
                      </span>
                    </h3>
                    <h4 class="font-weight-light">
                      Class Id: # {{ classData.id }}
                    </h4>
                  </v-col>
                </v-row>

                <!-- assignment Desc. -->
                <v-row>
                  <v-col>
                    <div
                    :class="{
                      'text-h4': $vuetify.breakpoint.smAndUp,
                      'text-center': $vuetify.breakpoint.smAndDown,
                      'text-subtitle-1': $vuetify.breakpoint.xs,
                    }"
                    class="font-weight-light mb-3 mt-6"
                    >
                      Due: {{ assignment.dueDate ? new Date(assignment.dueDate).toLocaleString() : 'No Due Date' }}
                    </div>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            
          </v-container>

        </v-container>
      </header>

      <!-- Assignment Submission Sections -->
      <v-tabs
        centered
        dark
        background-color="#3f3d56"
        v-model="currentTab"
        :fixed-tabs="!$vuetify.breakpoint.xs"
      >
        <v-tab key="0">Submissions</v-tab>
        <!-- This could be a tab to view student responses
          aggregated by individual activity in the course instance 
          of this assignment -->
        <v-tab key="1">Activities</v-tab>
      </v-tabs>

      <!-- Toolbar -->
      <!-- @TODO, use v-toolbar element -->
      <v-container class="mb-6">
        <v-row align="center" justify="end">
          <v-col cols="auto">
            
            <!-- Navigate to instructor Submission Button -->
            <v-btn 
            @click="navigateToUserSubmission"
            class="ma-0" 
            color="#b8860b"
            >
              <v-icon left> mdi-account-eye </v-icon>
              View as Student
            </v-btn>
          </v-col>
        </v-row>
      </v-container>

      <v-tabs-items v-model="currentTab"
      >
      <!-- Submissions Assignments -->
        <v-tab-item :value="0">
          <AssignmentBrowser
          ref="submissionsBrowser"
          :assignments="assignmentSubmissions"
          :headers="submissionsTableHeaders"
          :formatters="submissionTableFormatters"
          :clickHandler="assingmentClickHandler">
          </AssignmentBrowser>   
        </v-tab-item>
        
        <!-- Activities -->
        <v-tab-item :value="1"> 
          <h1> Hello World, Tab 1</h1>   
          <AssignmentBrowser
          :assignments="[]"
          :clickHandler="assingmentClickHandler"
          :autoHeaders="true">
          </AssignmentBrowser> 
        </v-tab-item>

      </v-tabs-items>

    </template>
  </div>
</template>

<script>
import { defineComponent } from '@vue/runtime-dom';

import {utc } from 'moment';


import Loading from '@/components/Loading.vue';
import AssignmentBrowser from '@/components/class/AssignmentBrowser';
import api from '@/api'
import classHeaderImage1 from '@/assets/course_1.svg'
import classHeaderImage2 from '@/assets/course_2.svg'

/**
 * @todo check if the user an instructor or owns the assignment.
 * if not, navigate back and set a toast message noting unauthorized
 * access.
 */
export default defineComponent({
  name: 'AssignmentSubmissions',
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
      loading: true,
      assignment: null,
      course: null,
      assignmentSubmissions: null,
      /** 
       * Whether the user is the owner of the assignment associated with the 
       * submissions
       */
      ownsAssignment: false,
      /**
       * A list of headers for the submissions table. 
       * This should be formatted according to the v-data-table-headers
       * prop formatting
       */
      submissionsTableHeaders: [
        {
          text: 'Student',
          align: 'center',
          value: 'userID',
        },
        {
          text: 'Progress',
          align: 'center',
          value: 'submitted',
        },
        {
          text: 'Date Submitted',
          align: 'center',
          value: 'timeSubmitted',
        },
        {
          text: 'Grade',
          align: 'center',
          value: 'grade',
        },
      ],
      /**
       * An object of formatter functions for the entries in
       *  the submissions table. {@see AssignmentBrowser.formatters}
       */
      submissionTableFormatters: {
        submitted: (val) => val ? `Submitted` : 'Un-Submitted',
        /**
         * use the date formatter defined in the assignment browser component
         * to format the time submitted value
         * @todo, this doesn't work
         */
        timeSubmitted: (val) => {
          return  this.submissionsBrowser ?
          this.submissionsBrowser.formatDate(val) : this.formatDate(val);
        },
        userID: (val) => {
          return val === this.user.id ? 'You' : `Student ${val}`;
        },
      }
    }
  },
  computed: {
    submissionsBrowser() {
      return this.$refs.submissionsBrowser
    },
    initialized() {
      return this.assignment && this.course && this.classData && this.assignmentSubmissions;
    },
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

    // set header image
    this.headerImage = this.user.type === 'instructor' || this.user.type === 'admin' ?
      classHeaderImage2 : classHeaderImage1;

    // set default tab to assignments for teachers
    this.currentTab = this.isInstructorOrAdmin ? 1 : 0;

    // get assignment id from url params
    const { assignmentID } = this.$route.params;

    // fetch the assignment info,
    // @todo, check if loading assignment data failed
    this.assignment = await this.getAssignment(assignmentID, true);
    // fetch all assignment submissions
    this.assignmentSubmissions = await this.getAssignmentSubmissions(assignmentID);
    // fetch the related course
    this.course = await this.getCourse(this.assignment.courseID);
    // fetch the related classroom
    this.classData = await this.getClassData(this.assignment.classID);
  },
  methods: {
    /**
     * retrieve the data for a classroom instance
     * @param {number} classID ID of the class
     * @returns a promise that resolves to the classroom data object
     */
    async getClassData(classID) {
      let responseData = await api.fetchClass(classID);
      // console.log(`response data ${JSON.stringify(responseData)}`);

      let classData;
      if (responseData instanceof Array) {
        classData = responseData[0];
      }

      return Promise.resolve(classData);
    },
    // /**
    //  * Retrieve assignments data for this class
    //  * @param {number} classID the ID of the class
    //  */
    // async getClassAssignments(classID) {

    //   let assignmentData = await api.fetchClassAssignments(classID);
    //   if (assignmentData instanceof Array) {
    //     this.assignments = assignmentData;
    //   }
      
    //   // console.log(assignmentData);

    // },
    /**
     * Performs appropriate actions when the user clicks an entry in 
     *    the AssignmentBrowser component. Teachers are navigated to the 
     *    assignment submission page for the student submission item clicked
     * @param {Object} item a v-data-table item as returned by the click:row event 
     * of v-data-table component
     *    {@see https://v2.vuetifyjs.com/en/api/v-data-table/#events}
     * @param {Object} props props object as passed to item slot of v-data-table row
     * @param {Object} mouseEvent js MouseEvent
     */
    assingmentClickHandler(item, props, mouseEvent) {
      // console.log(item, props, mouseEvent);
      
      // check if row data was given
      if (!item || isNaN(item.userID)) {
        return;
      }

      // get id of the user for the submission item clicked
      let userID = item.userID;

      // navigate to the submission page of the user for this assignment
      this.navigateToUserSubmission(userID)
    },
    /**
     * Navigate to the assignment submission of a specified user ID.
     * @param {number} userID user id of user whose submission to navigate to
     */
    navigateToUserSubmission(userID) {
      this.$router.push({
          path: `/assignment/${this.assignment.id}/?userID=${userID}`
        })
    },
    /**
     * Retrieve assignment data for a specified ID 
     * @param {number} assignmentID ID of the assignment to fetch 
     * @param {boolean} load whether to show the loader component while awaiting the assignment data
     * @returns a promise that resolves to the assignment object
     */
     async getAssignment(assignmentID, load = false) {
      // this.currentTab = 0;
      if (load) {
        this.loading = true;
      }

      let assignment = await api.fetchSingleAssignment(assignmentID);

      // check if user owns assignment
      if (this.user.id === assignment.instructorID) {
        this.ownsAssignment = true;
       }
      
      this.loading = false;
      
      return Promise.resolve(assignment);
    },
    /**
     * Retrieve course data for a specified ID and update the {@link ownsAssignment}
     * property accordingly
     * @param {number} courseID ID of the course 
     * @param {boolean} load whether to show the loader component while awaiting the course data
     */
    async getCourse(courseID, load = false) {
      this.currentTab = 0;
      if (load) {
        this.loading = true;
      }

      let course = await api.fetchSingleCourse(courseID);

      this.loading = false;
      
      return Promise.resolve(course);
    },
    /**
     * fetch all submissions for this assignment
     * @param {number} assignmentID ID of the related assignment 
     */
    async getAssignmentSubmissions(assignmentID) {
      // request assignment submissions for the assignmentID
      let submissions = await api.fetchAllAssignmentSubmissions(assignmentID);
      return Promise.resolve(submissions);
    },
    //////////// Formatters /////////////
    
    /**
     * Generate a local time formatted date string from an ISO
     * UTC datatime string
     * - example: Dec 24, 2023 12:00 AM
     * @param {object} dateString ISO UTC formatted datetime string
     */
     formatDate(dateString) {
       if (dateString === '' ||
         dateString === null ||
         dateString === undefined) {
        return '';
      } else {
        return utc(dateString).local().format('lll');
        // return utc(dateString).format('MMM Do [\n] LT');
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