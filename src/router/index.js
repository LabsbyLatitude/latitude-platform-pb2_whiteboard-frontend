import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    component: () => import('@/views/main/Index'),
    children: [
      {
        name: 'Home',
        path: '/',
        component: () => import('@/views/main/Home'),
      },
      {
        path: '/login',
        name: 'login',
        component: () => import('@/views/main/Login'),
      },
      {
        path: '/register',
        name: 'register',
        component: () => import('@/views/main/Register'),
      },
      {
        path: '/manage',
        name: 'manage',
        component: () => import('@/views/Admin/Manage'),
      },
      {
        path: '/feed',
        name: 'feed',
        component: () => import('@/views/Learner/Feed'),
      },
      {
        path: '/labs',
        name: 'labs',
        component: () => import('@/views/Learner/Courses'),
      },
      {
        path: '/course/:courseId',
        name: 'course',
        component: () => import('@/views/main/Course'),
      },
      {
        path: '/assignment/:assignmentID',
        name: 'assignment',
        component: () => import('@/views/main/Assignment'),
      },
      {
        path: '/myprofile',
        name: 'myprofile',
        component: () => import('@/views/Learner/MyProfile'),
      },
      {
        path: '/class/:classID',
        name: 'class',
        component: () => import('@/views/main/Class'),
      },
      {
        path: '/assignment/:assignmentID/submissions',
        name: 'assignment-submissions',
        component: () => import('@/views/Instructor/AssignmentSubmissions'),
      },
    ],
  },
  {
    path: '*',
    redirect: '/',
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
