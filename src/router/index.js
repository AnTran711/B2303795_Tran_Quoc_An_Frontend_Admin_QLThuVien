import { createRouter, createWebHistory } from 'vue-router';

import DefaultLayout from '@/layouts/DefaultLayout.vue';
import BookManagement from '@/views/BookManagement.vue';
import PublisherManagement from '@/views/PublisherManagement.vue';

const routes = [
  {
    path: '/',
    redirect: '/quan-ly-sach'
  },
  {
    path: '/',
    component: DefaultLayout,
    children: [
      {
        path: 'quan-ly-sach',
        component: BookManagement
      },
      {
        path: 'nha-xuat-ban',
        component: PublisherManagement
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
