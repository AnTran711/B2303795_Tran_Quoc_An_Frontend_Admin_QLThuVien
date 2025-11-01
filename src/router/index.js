import { createRouter, createWebHistory } from 'vue-router';

import DefaultLayout from '@/layouts/DefaultLayout.vue';
import BookManagement from '@/views/BookManagement.vue';
import PublisherManagement from '@/views/PublisherManagement.vue';
import NotFound from '@/views/NotFound.vue';
import GenreManagement from '@/views/GenreManagement.vue';
import BookBorrowingManagement from '@/views/BookBorrowingManagement.vue';

const routes = [
  {
    path: '/',
    redirect: '/book-management'
  },
  {
    path: '/',
    component: DefaultLayout,
    children: [
      {
        path: 'book-management',
        component: BookManagement
      },
      {
        path: 'publisher-management',
        component: PublisherManagement
      },
      {
        path: 'genre-management',
        component: GenreManagement
      },
      {
        path: 'book-borrowing-management',
        component: BookBorrowingManagement
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
