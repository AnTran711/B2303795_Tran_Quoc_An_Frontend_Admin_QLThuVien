import { createRouter, createWebHistory } from 'vue-router';

import DefaultLayout from '@/layouts/DefaultLayout.vue';
import BookManagement from '@/views/BookManagement.vue';

const routes = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      {
        path: 'quan-ly-sach',
        component: BookManagement
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
