<template>
  <div>
    <!-- App Header Bar (i.e., toolbar) -->
    <v-app-bar app clipped-left color="primary" height="70">
      <v-container class="fill-height pa-0">
        <!-- App Bar row -->
        <v-row no-gutters justify="space-between" align="center">
          <!-- Button to open nav menu on small screens -->
          <v-col :class="{
              'col-auto': $vuetify.breakpoint.mdAndUp,
              'col-4': $vuetify.breakpoint.sm,
              'col-2': $vuetify.breakpoint.xs,
            }" v-if="$vuetify.breakpoint.smAndDown">
            <v-btn icon @click="drawer = !drawer" text color="topbar"><v-icon color="white">mdi-menu</v-icon></v-btn>
          </v-col>
          <!-- App Logo, navigates to site root -->
          <v-col :class="{
              'col-auto': $vuetify.breakpoint.mdAndUp,
              'col-2': $vuetify.breakpoint.smAndDown,
              'pa-1': $vuetify.breakpoint.smAndDown,
              'mx-5': $vuetify.breakpoint.smAndDown,
            }">
            <router-link to="/">
              <v-avatar size="60" tile>
                <v-img height="45" src="@/assets/logo.png"></v-img>
              </v-avatar>
            </router-link>
          </v-col>

          <!-- Login Options & User menu -->
          <v-col cols="auto" class="center-horizontally center-vertically" v-if="$vuetify.breakpoint.mdAndUp">
            <!-- "Register" and "Login" buttons -->
            <template v-if="$store.state.currentUser === null">
              <v-btn width="150" x-large rounded to="/register" class="text-none text-h4" color="#48465E">
                Register
              </v-btn>
              <v-btn x-large rounded outlined to="/login" class="text-none text-h4" color="white">
                Login
              </v-btn>
            </template>
            <!-- User Menu Dropdown -->
            <v-menu v-else offset-y>
              <!-- open button for menu, passed as a slot -->
              <template v-slot:activator="{ on }">
                <v-btn color="white" outlined v-on="on" class="text-none pl-2 pr-2" x-large>
                  <!-- user icon -->
                  <v-avatar size="30" class="mr-1 ml-0">
                    <v-icon color="white">mdi-human-child</v-icon>
                  </v-avatar>
                  <v-spacer></v-spacer>
                  <!-- user first name -->
                  <div class="mr-5 ml-5 text-subtitle-1 font-weight-medium">
                    {{ $store.state.currentUser.firstName || 'John Doe' }}
                  </div>
                  <v-spacer></v-spacer>
                  <!-- open icon -->
                  <v-avatar size="20" class="mx-1">
                    <v-icon>mdi-chevron-down</v-icon>
                  </v-avatar>
                </v-btn>
              </template>

              <v-list dense color="topbar">

                <!-- "My Profile" menu item, for 'learners' -->
                <v-list-item :to="'/myprofile'"
                  v-if="$store.state.currentUser && $store.state.currentUser.type === 'learner'">
                  <v-list-item-title class="text-subtitle-1 font-weight-light white--text">
                    My Profile
                  </v-list-item-title>
                </v-list-item>

                <!-- "Manage Users" menu item, for 'admins' -->
                <v-list-item :to="'/manage'"
                  v-if="$store.state.currentUser && $store.state.currentUser.type === 'admin'">
                  <v-list-item-title class="text-subtitle-1 font-weight-light white--text">
                    Manage Users
                  </v-list-item-title>
                </v-list-item>

                <!-- "Log out" menu item -->
                <v-list-item @click="logOut">
                  <v-list-item-title class="text-subtitle-1 font-weight-light white--text">
                    Log out
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>

          </v-col>

        </v-row>
      </v-container>
    </v-app-bar>

    <!-- Sidebar Navigation Menu -->
    <v-navigation-drawer v-model="drawer" app clipped :mini-variant.sync="minimizeDrawer" color="topbar" class="pt-5">

      <!-- top border, to visually demarcate nav menu region from app bar -->
      <!-- <v-divider class="nt-5"></v-divider> -->

      <!-- Sidebar Nav Header, for logged-in user -->
      <template v-if="$store.state.currentUser !== null">
        <v-list>
          <!-- Nav Bar header/title -->
          <v-list-item class="px-2">

            <!-- Avatar -->
            <v-list-item-content>
              <!-- <v-list-item-avatar class="align-self-center" height="100" width="110"> -->
              <v-list-item-avatar>
                <v-icon size="40" color="white">mdi-human-child</v-icon>
              </v-list-item-avatar>
            </v-list-item-content>


            <!-- minimize nav bar button -->
            <v-list-item-action>
              <v-btn icon text normal right color="white" @click.stop="minimizeDrawer = !minimizeDrawer">
                <v-icon size="30">mdi-chevron-left</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>

          <!-- First Name -->
          <v-list-item class="white--text">
            <v-list-item-content>
              <v-list-item-title class="text-h3">
                {{ $store.state.currentUser.firstName }}
              </v-list-item-title>
              <v-list-item-subtitle class="background--text">
                {{ $store.state.currentUser.type }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-divider></v-divider>
        
      </template>
      
      <!-- Classroom List, for logged-in user -->
      <template v-if="$store.state.currentUser !== null">
        <ClassroomBrowser :userID="$store.state.currentUser.id">
        </ClassroomBrowser>

        <!-- bottom visual divider -->
        <v-divider></v-divider>

      </template>

      <!-- Sidebar Nav Links -->
      <v-list dense class="mt-3 mb-3">

        <!-- "My Profile" Nav Link, for 'learners' -->
        <v-list-item class="mt-2" :to="'/myprofile'"
          v-if="$store.state.currentUser && $store.state.currentUser.type === 'learner'">
          <v-list-item-icon>
            <v-icon color="white" class="mr-5">mdi-account-details</v-icon>
          </v-list-item-icon>
          <v-list-item-title class="text-subtitle-1 font-weight-light white--text">
            My Profile
          </v-list-item-title>
        </v-list-item>

        <!-- "Manage Users" Nav Link, for 'admins' -->
        <v-list-item class="mt-2" :to="'/manage'"
          v-if="$store.state.currentUser && $store.state.currentUser.type === 'admin'">
          <v-list-item-icon>
            <v-icon color="white" class="mr-5">mdi-cog</v-icon>
          </v-list-item-icon>
          <v-list-item-title class="text-subtitle-1 font-weight-light white--text">
            Manage Users
          </v-list-item-title>
        </v-list-item>

        <!-- "Log out" Nav Link -->
        <v-list-item @click="logOut" class="mt-2">
          <v-list-item-icon>
            <v-icon color="white" class="mr-5">mdi-login-variant</v-icon>
          </v-list-item-icon>
          <v-list-item-title class="text-subtitle-1 font-weight-light white--text">
            Log out
          </v-list-item-title>
        </v-list-item>
      </v-list>

      <!-- Sidebar Nav Links, for non-logged-in user -->
      <template v-if="$store.state.currentUser === null">
        <v-list expand color="topbar" class="mt-5">
          <v-list-item v-for="(item, i) in links" class="white--text" :key="i" :to="item.to">
            <v-list-item-title class="text-subtitle-1 font-weight-light white--text text-center">
              <v-icon color="white" class="mr-5">{{ item.icon }}</v-icon> {{ item.title }}
            </v-list-item-title>
          </v-list-item>
          <v-list-item class="white--text" to="/login">
            <v-list-item-title class="text-subtitle-1 font-weight-light white--text text-center">
              <v-icon color="white" class="mr-5">mdi-login</v-icon> Login
            </v-list-item-title>
          </v-list-item>
          <v-list-item class="white--text" to="/register">
            <v-list-item-title class="text-subtitle-1 font-weight-light white--text text-center">
              <v-icon color="white" class="mr-5">mdi-pencil</v-icon> Register
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </template>
    </v-navigation-drawer>

  </div>
</template>

<script>
import { defineComponent } from '@vue/runtime-dom';

import ClassroomBrowser from '../core/ClassroomBrowser.vue';

export default defineComponent({
  components: {
    ClassroomBrowser,
  },
  data: () => ({
    links: [
      {
        title: 'Home',
        to: '/',
        icon: 'mdi-home',
      },
    ],
    drawer: true,
    minimizeDrawer: false,
  }),
  methods: {
    logOut() {
      localStorage.removeItem('userData');
      localStorage.removeItem('userToken');
      this.$store.state.currentUser = null;
      if (this.$route.name !== 'Home') {
        this.$router.push('/');
      }
    },
  },
  created() {
    this.$store.state.currentUser = JSON.parse(localStorage.getItem('userData'));
  },
});
</script>
