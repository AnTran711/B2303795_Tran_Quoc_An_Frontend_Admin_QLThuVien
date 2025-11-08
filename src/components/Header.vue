<script setup>
  import { useEmployeeStore } from '@/stores/useEmployeeStore';
  import { useRouter } from 'vue-router';

  const emit = defineEmits(['toggle-drawer']);

  const employeeStore = useEmployeeStore();
  const router = useRouter();

  // Hàm đăng xuất
  const logout = async () => {
    if(employeeStore.employee) {
      await employeeStore.logout();
      router.push('/login');
    }
  }
</script>

<template>
  <v-app-bar color="primary">
    <v-container fluid>
      <v-row no-gutters>
        <v-col cols="6" class="d-flex align-center">
          <v-app-bar-nav-icon @click="emit('toggle-drawer')" class="mr-1" />
          <!-- Logo và tên -->
          <router-link to="/" class="logo-link">
            <v-sheet class="d-flex align-center bg-primary">
              <v-img src="/imgs/logo.png" width="60" contain />
              <span class="font-weight-bold text-white text-h5">AnLib</span>
            </v-sheet>
          </router-link>
        </v-col>

        <v-col cols="6" class="d-flex align-center justify-end">
          <!-- Nút đăng nhập hoặc User Menu -->
          <div v-if="!employeeStore.employee" class="d-flex align-center">
            <v-btn
              to="/login"
              variant="outlined"
              rounded="lg"
              class="login-btn px-6"
              prepend-icon="mdi-login"
            >
              Đăng nhập
            </v-btn>
          </div>

          <!-- User Menu -->
          <div v-else class="d-flex align-center">
            <v-chip class="bg-white text-primary font-weight-bold" variant="flat">
              {{ employeeStore.employee.CHUCVU }}
            </v-chip>

            <v-menu offset-y>
              <!-- Kích hoạt menu user -->
              <template #activator="{ props }" >
                <v-btn
                  v-bind="props"
                  variant="text"
                  rounded="xl"
                  class="pa-4 ml-8 d-flex justify-center align-center user-menu-btn"
                >
                  <span class="mr-2">{{ employeeStore.getFullName() }}</span>
                  <v-icon>mdi-chevron-down</v-icon>
                </v-btn>
              </template>

              <!-- Danh sách chức năng -->
              <v-list>
                <v-list-item to="/change-password" prepend-icon="mdi-lock-reset" title="Đổi mật khẩu" />
                <v-divider></v-divider>
                <v-list-item @click="logout" prepend-icon="mdi-logout" title="Đăng xuất" />
              </v-list>
            </v-menu>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-app-bar>
</template>

<style scoped>
/* logo */
.logo-link {
  text-decoration: none;
  transition: tranform 0.3s ease;
}

.logo-link:hover {
  transform: scale(1.05);
}

/* Nút đăng nhập */
.login-btn {
  color: #fff;
  transition: all 0.3s ease;
}

.login-btn:hover {
  background-color: #fff;
  color: rgb(var(--v-theme-primary));
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

/* User menu */
.user-menu-btn {
  text-transform: none;
  font-weight: 500;
  transition: all 0.3s ease;
}

.user-menu-btn:hover {
  background: #fff;
  color: rgb(var(--v-theme-primary));
}
</style>
