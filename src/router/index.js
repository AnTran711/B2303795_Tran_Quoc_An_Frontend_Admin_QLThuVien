import { createRouter, createWebHistory } from 'vue-router';

import DefaultLayout from '@/layouts/DefaultLayout.vue';
import BookManagement from '@/views/BookManagement.vue';
import PublisherManagement from '@/views/PublisherManagement.vue';
import NotFound from '@/views/NotFound.vue';
import GenreManagement from '@/views/GenreManagement.vue';

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
      },
      {
        path: 'the-loai',
        component: GenreManagement
      }
    ]
  },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // Khi có savedPosition (ví dụ: bấm nút Back/Forward), Vue sẽ cuộn lại đúng vị trí cũ
    if (savedPosition) {
      return savedPosition
    } else {
      // Mặc định cuộn lên đầu trang
      return { top: 0 }
    }
  }
});

export default router;
