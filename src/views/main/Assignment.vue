<template>
  <div class="single-course-container">
    <!--loader Until request finishes-->
    <Loading v-if="loading || !initialized"></Loading>

    <!--Single Assignment Page After Fetching Data-->
    <template v-else>
      <!--Name and Intro section-->
      <v-container fluid class="IntroSection pt-0 pb-0">
        <!-- inner container to constrain max width of hero section -->
        <v-container class="new-container">
          <v-row justify="center" class="mt-5 mb-3">
            <!-- Header Image -->
            <v-col
              :class="{
                'col-4': $vuetify.breakpoint.mdAndUp,
                'col-10': $vuetify.breakpoint.smAndDown,
                'px-10': $vuetify.breakpoint.smAndUp,
              }"
            >
              <v-img :src="image"></v-img>
            </v-col>
            <!-- Header Text -->
            <v-col
              :class="{
                'col-8': $vuetify.breakpoint.mdAndUp,
                'col-12': $vuetify.breakpoint.smAndDown,
                'px-10': $vuetify.breakpoint.smAndUp,
              }"
              class="white--text"
            >
              <v-row :justify="$vuetify.breakpoint.smAndDown ? 'center' : 'start'">
                
                <!-- Assignment Name -->
                <v-col cols="auto">
                  <h3 class="text-h3 font-weight-black mb-xs-0 mb-sm-n4 text-uppercase grey--text text--lighten-1"> 
                      Assignment
                  </h3>
                  <h2
                    :class="{
                      'mt-5': $vuetify.breakpoint.smAndUp,
                      'mt-0': $vuetify.breakpoint.xs,
                    }"
                    class="font-weight-medium mb-3 text-h1"
                  >
                    {{ assignment.name }}
                  </h2>
                </v-col>
                <!-- Assignment Attribution -->
                <v-col 
                  style="flex-direction: column;"
                  cols="auto"
                  class="align-bottom">
                    <h3 v-if="user.type !== 'student'"
                    class="text-h3 font-weight-light "> 
                      <span class="grey--text text--lighten-1">
                        User: 
                      </span>
                      <span class="font-weight-black">
                        # {{ user.id }} 
                      </span>
                    </h3>
                    <h4 class="font-weight-light">
                      <span class="grey--text text--lighten-1">
                      Class Id: # 
                      </span>
                      {{ assignment.classID }}
                    </h4>
                  </v-col>
              </v-row>

              <!-- Assignment Difficulty -->
              <!-- <div
                :class="{
                  'text-center': $vuetify.breakpoint.smAndDown,
                }"
              >
                <v-chip class="px-5" text-color="white" color="deep-purple">
                  {{ course.difficulty }}
                </v-chip>
              </div> -->
              
              <!-- Dates -->
              <v-row>
                <!-- Assignment Due Date -->
                <v-col cols="12" md="auto">
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
                <!-- Assignment Submission Date -->

                <v-col v-if=" assignmentSubmission && assignmentSubmission.submitted " cols="12" md="auto">
                    <div
                    :class="{
                      'text-h4': $vuetify.breakpoint.smAndUp,
                      'text-center': $vuetify.breakpoint.smAndDown,
                      'text-subtitle-1': $vuetify.breakpoint.xs,
                    }"
                    class="font-weight-light mb-3 mt-6"
                  >
                    Submitted: {{new Date(assignmentSubmission.timeSubmitted).toLocaleString()}}
                  </div>
                </v-col>
              </v-row>

            </v-col>
          </v-row>
        </v-container>
      </v-container>

      <!-- Toolbar -->
      <v-container>
        <v-row align="center" justify="end">
          <v-col cols="auto">
            
            <!-- Submit Assignment Button -->
            <v-btn 
            @click="udpateAssignmentSubmissionState(!assignmentSubmission.submitted)"
            class="ma-0" 
            color="#b8860b"
            >
              <v-icon left> {{!assignmentSubmission.submitted ? 'mdi-check' : 'mdi-arrow-u-right-bottom'}} </v-icon>
              {{!assignmentSubmission.submitted ? 'Mark as Complete' : 'Unsubmit'}}
            </v-btn>
          </v-col>
        </v-row>
      </v-container>

      <!-- "Content", "Threads", and "Activity" Tabs -->
      <!-- <v-tabs
        centered
        dark
        background-color="#3f3d56"
        v-model="currentTab"
        :fixed-tabs="!$vuetify.breakpoint.xs"
      >
        <v-tab key="0">Content</v-tab>
        hiding these tabs as they're not yet needed for courses,
        only instructor created assignments
        <v-tab key="1" v-if="false">Threads</v-tab>
        <v-tab key="2" v-if="ownsAssignment && false">Add Activity</v-tab>
      </v-tabs> -->

      <!-- "Content" Tab Container -->
      <v-container class="new-container py-8">
        <template v-if="currentTab == 0">
          <div class="text-h1 text-center">Assignment Activities</div>
          <CourseContent
            @refetch="getCourse(false)"
            :activities="course.activities"
            v-if="course && course.activities.length"
          />
          <div v-else class="text-overline my-6 text-center">
            Oops, It appears that there is no content yet.
          </div>
        </template>

        <!-- Course Threads (chat messages) Tab -->
        <template v-else-if="currentTab == 1">
          <div class="text-h1 text-center">Threads</div>
          <CourseThreads />
        </template>
        
        <!-- Create Activity Tab -->
        <template v-else-if="currentTab == 2">
          <div class="text-h1 text-center">Create Activity</div>
          <CreateActivity @refetch="getCourse" />
        </template>
      </v-container>
    </template>

  </div>
</template>

<script>
import Loading from '@/components/Loading.vue';
import CourseContent from '@/components/course/courseContent.vue';
import CreateActivity from '@/components/course/createActivity.vue';
import CourseThreads from '@/components/course/CourseThreads.vue';
import AssignCourse from '@/components/assignment/AssignCourse.vue';
import img1 from '@/assets/course_1.svg';
import img2 from '@/assets/course_2.svg';
import img3 from '@/assets/course_3.svg';
import api from '@/api';
import { defineComponent } from '@vue/runtime-dom';

export default defineComponent({
  components: {
    Loading,
    CourseContent,
    CreateActivity,
    CourseThreads,
    AssignCourse,
  },
  props: {
    /**
     * ID of a user account whose submission data to fetch for this assignment
     * component
     */
    userID: {
      type: Number,
      required: false
    }
  },
  data() {
    return {
      loading: true,
      user: null,
      assignment: null,
      course: null,
      assignmentSubmission: null,
      image: null,
      currentTab: 0,
      ownsAssignment: false,
    };
  },
  computed: {
    initialized() {
      return this.assignment && this.course && this.assignmentSubmission;
    },
  },
  methods: {
    initializeImage(courseId) {
      if (parseInt(courseId, 10) % 3 === 0) {
        this.image = img1;
      } else if (parseInt(courseId, 10) % 3 === 1) {
        this.image = img2;
      } else {
        this.image = img3;
      }
    },
    /**
     * Retrieve assignment data for this page
     * @param {boolean} load whether to show the loader component while awaiting the assignment data
     */
    async getAssignment(load = false) {
      // this.currentTab = 0;
      if (load) {
        this.loading = true;
      }

      const { assignmentID } = this.$route.params;
      this.assignment = await api.fetchSingleAssignment(assignmentID);

      this.loading = false;
    },
    /**
     * Retrieve course data for this assignment
     * @param {boolean} load whether to show the loader component while awaiting the course data
     */
    async getCourse(load = false) {
      this.currentTab = 0;
      if (load) {
        this.loading = true;
      }

      this.course = await api.fetchSingleCourse(this.assignment.courseID);

      // check if user owns assignment
      if (this.user.id === this.assignment.instructorID) {
        this.ownsAssignment = true;
      }
      this.loading = false;
    },
    /**
     * Try and fetch an existing submission of this user
     * for this assignment, creating one if none exists
     */
    async getAssignmentSubmission() {
      // request assignment submission for current user
      await api.fetchSingleAssignmentSubmission(this.assignment.id, this.user.id)
        .then((res) => {
          // check if server responded with a valid submission
          if (res) {
            // console.log('found existing submission');
            return res;
          }
          // create new submission if none was found
          else {
            // console.log('no submission yet');
            let newSubmissionDetails = {
              assignmentID: this.assignment.id,
              userID: this.user.id
            }
            return api.createAssignmentSubmission(newSubmissionDetails);
          }
        })
        .then((submission) => {
          // console.log('submission data: ', submission);
          this.assignmentSubmission = submission;
        });
    },
    /**
     * Update the submission state of the assignment submission
     * @param {boolean} submitted whether to mark the assignment complete or incomplete
     */
    async udpateAssignmentSubmissionState(submitted) {

      let submissionEdits = {
        id: this.assignmentSubmission.id,
        submitted,
      };

      // update assignment submission on server
      await api.updateAssignmentSubmission(submissionEdits).then((res) => {


        if (res !== false) {
          // update the local assignment submission with the server response
          this.assignmentSubmission = res;
          // notify the user of successful assignment update
          this.$store.state.snackbarMessage = `Assignment ${submitted ? 'submitted' : 'unsubmitted'}`;
          this.$store.state.snackbar = true;
          this.$store.state.snackbarColor = submitted ? 'success' : 'info';
        }
        else {
          // notify the user of an unsuccessful assignment update
          this.$store.state.snackbarMessage = `Unable to ${submitted ? 'submit' : 'unsubmit'} assignment`;
          this.$store.state.snackbar = true;
          this.$store.state.snackbarColor = 'error';
        }
      });
    },
  },
  async created() {

    /////// get user info

    /**
     * check if user ID is specified as a prop, then fetch user info
     * @todo, replace  this  with a query for the actual user data from the backend
     */
    if (this.userID !== undefined) {
      this.user = {
        id: this.userID,
        type: 'instructor',
      }
      // console.log(`assignment submission user ID received as a prop: ${this.userID}`)
    }
    /**
     * check if user ID is specified as a query param, then fetch user info
     * @todo, replace  this  with a query for the actual user data from the backend
     */
    else if ( !isNaN(parseInt(this.$route.query.userID, 10))) {
      this.user = {
        id: parseInt(this.$route.query.userID, 10),
        type: 'instructor',
      }
      // console.log(`assignment submission user ID received as query param: ${this.user.id}`)
    } 
    /**
     * fetch user info from local storage of the  current browser
     * @todo, replace  this  with a query for the actual user data from the backend
     */
    else {
      this.user = JSON.parse(localStorage.getItem('userData'));
      // console.log(`assignment submission user ID being read from local storage user data: ${this.user}`)
    }

    //////// get submission assignment info

    // fetch the assignment info,
    // the related course,
    // and any existing user submission
    await this.getAssignment(true)
      .then(() => this.getCourse())
      .then(() => this.getAssignmentSubmission());

    // console.log('Assignment Submission: \n' + JSON.stringify(this.assignmentSubmission));

    this.initializeImage(this.course._id);
  },
  beforeRouteEnter(to, from, next) {
    if (!localStorage.getItem('userData')) {
      next({ name: 'login' });
    } else {
      next();
    }
  },
});
</script>

<style scoped>
.iframe-container {
  overflow: hidden;
  padding-top: 56.25%; /* 16:9*/
  position: relative;
}

.iframe-container iframe {
  border: 0;
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
}
.border-small {
  border: 1px solid #000;
}
.IntroSection {
  background-color: #3f3d56;
  opacity: 0.95;
}

.align-bottom {
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

@media (min-width: 1904px) {
  .new-container {
    max-width: 1440px;
  }
}
</style>
