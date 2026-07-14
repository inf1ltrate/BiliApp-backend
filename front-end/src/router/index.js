import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'Home', component: () => import('../views/Home.vue') },
  { path: '/video/:id', name: 'VideoDetail', component: () => import('../views/VideoDetail.vue') },
  { path: '/login', name: 'Login', component: () => import('../views/Login.vue') },
  { path: '/profile', name: 'Profile', component: () => import('../views/Profile.vue') },
  { path: '/categories', name: 'Categories', component: () => import('../views/Categories.vue') },
  { path: '/comments', name: 'Comments', component: () => import('../views/Comments.vue') },
  { path: '/likes', name: 'Likes', component: () => import('../views/Likes.vue') },
  { path: '/orders', name: 'Orders', component: () => import('../views/Orders.vue') },
  { path: '/reviews', name: 'Reviews', component: () => import('../views/Reviews.vue') }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router