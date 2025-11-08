import { createRouter, createWebHistory } from 'vue-router';

import DefaultLayout from '@/layouts/DefaultLayout.vue';
import BookManagement from '@/views/BookManagement.vue';
import PublisherManagement from '@/views/PublisherManagement.vue';
import NotFound from '@/views/NotFound.vue';
import GenreManagement from '@/views/GenreManagement.vue';
import BookBorrowingManagement from '@/views/BookBorrowingManagement.vue';
import Login from '@/views/Login.vue';
import Register from '@/views/Register.vue';
import { useEmployeeStore } from '@/stores/useEmployeeStore';
import ChangePassword from '@/views/ChangePassword.vue';

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
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/register',
    component: Register
  },
  {
    path: '/change-password',
    component: ChangePassword
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

// Guard toàn cục
router.beforeEach((to, from, next) => {
  const employeeStore = useEmployeeStore();
  const loggedIn = !!employeeStore.employee;

  if (!loggedIn && to.path !== '/login') {
    next('/login');
  } else if (loggedIn && to.path === '/login') {
    next('/');
  } else {
    next();
  }
});

export default router;
