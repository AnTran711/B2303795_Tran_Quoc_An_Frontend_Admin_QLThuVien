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
import Dashboard from '@/views/Dashboard.vue';

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/',
    component: DefaultLayout,
    children: [
      {
        path: 'dashboard',
        component: Dashboard
      },
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
    // Nếu người dùng Back/Forward → trả về vị trí cũ
    if (savedPosition) {
      return savedPosition;
    }

    // Nếu chỉ thay đổi query → KHÔNG scroll-top
    if (to.path === from.path && to.fullPath !== from.fullPath) {
      return false;
    }

    // Nếu đổi trang thật sự (home -> detail chẳng hạn)
    return { top: 0 };
  }
});

// Guard toàn cục
router.beforeEach((to, from, next) => {
  const employeeStore = useEmployeeStore();
  const loggedIn = !!employeeStore?.employee;
  const isAdmin = employeeStore?.employee?.CHUCVU === 'Quản lý';
  const allowedPathsForStaff = ['/', '/login', '/dashboard', '/change-password', '/book-borrowing-management'];

  if (!loggedIn && to.path !== '/login') return next('/login');
  if (loggedIn && to.path === '/login') return next('/');
  if (!isAdmin && !allowedPathsForStaff.includes(to.path)) return next('/');

  next();
});

export default router;
