<script setup>
  import { nextTick, onMounted, reactive, ref } from 'vue';
  import { toast } from 'vue3-toastify';
  import { useRoute, useRouter } from 'vue-router';
  import { rules } from '@/utils/rules.js';
  import { useEmployeeStore } from '@/stores/useEmployeeStore';

  // Store
  const employeeStore = useEmployeeStore();

  // Router
  const router = useRouter();

  // Xử lí hiện toast khi đăng ký thành công
  const route = useRoute();

  // Xử lý gửi thông tin

  //Instance của form
  const formRef = ref(null);

  // Object chứa dữ liệu người dùng nhập
  const employeeLogin = reactive({
    DIENTHOAI: null,
    MATKHAU: null
  });

  // Hàm xử lý gửi form
  const login = async () => {
    // Kiểm tra dữ liệu có hợp lệ hay không
    const { valid } = await formRef.value.validate();

    if (!valid) {
      toast.error('Vui lòng kiểm tra lại thông tin nhập');
      return;
    }

    await employeeStore.login(employeeLogin);

    router.push('/');
  }

  // Xử lý ẩn/hiện mật khẩu
  const showPwd = ref(false);
  const pwdField = ref(null);

  async function togglePwd() {
    // Lấy thẻ input
    const input = pwdField.value?.$el?.querySelector('input');
    if(!input) return;

    // Lưu vị trí con trỏ hiện tại
    const pos = (typeof input.selectionStart === 'number') ? input.selectionStart : input.value.length;

    // Toggle trạng thái của password
    showPwd.value = !showPwd.value;

    // Đợi vue cập nhật lại DOM sau ghi toggle trạng thái
    await nextTick();

    // Lấy thẻ input sau khi DOM cập nhật lại
    const newInput = pwdField.value?.$el?.querySelector('input');
    if(!newInput) return;

    // Đợi thêm 1 frame để DOM render ổn định, đảm bảo browser đã vẽ xong input mới
    requestAnimationFrame(() => {
      // Focus vào thẻ input
      newInput.focus({ preventScroll: true })
      // Đặt con trỏ lại vị trí cũ
      const newPos = Math.min(pos, newInput.value.length);
      newInput.setSelectionRange(newPos, newPos);
    });
  }
</script>

<template>
  <v-app>
    <div class="app">
      <v-container class="d-flex justify-center align-center zoom-in">
        <!-- div bọc v-row để v-row không bung ra theo v-container -->
        <div style="width: 800px;">
          <v-row class="login-container rounded-xl" no-gutters>
            <!-- Phần hình ảnh trang trí -->
            <v-col cols="6" class="pa-8 image-panel">
              <v-img :width="400" src="/imgs/logo_ten.png"></v-img>
            </v-col>
        
            <!-- Phần form đăng nhập -->
            <v-col cols="6" class="form-panel">
              <v-card
                class="pa-8 rounded-0"
                max-width="400"
                width="400"
                elevation="0"
              >
                <v-card-title class="text-center">
                  <h1>Đăng nhập</h1>
                </v-card-title>
                <v-card-text class="pt-4">
                  <!-- form đăng nhập -->
                  <v-form ref="formRef" @keyup.enter="login">
                    <!-- Dùng số điện thoại để đăng nhập thay cho username -->
                    <v-text-field
                      v-model="employeeLogin.DIENTHOAI"
                      label="Số điện thoại"
                      variant="outlined"
                      prepend-inner-icon="mdi-phone"
                      density="comfortable"
                      clearable
                      :rules="[rules.required]"
                    />
                    <v-text-field
                      v-model="employeeLogin.MATKHAU"
                      ref="pwdField"
                      class="mt-2"
                      label="Mật khẩu"
                      variant="outlined"
                      density="comfortable"
                      prepend-inner-icon="mdi-lock-outline"
                      :append-inner-icon="showPwd ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="showPwd ? 'text' : 'password'"
                      @click:append-inner="togglePwd"
                      clearable
                      :rules="[rules.required]"
                    />
                  </v-form>
                </v-card-text>
                <v-card-actions class="pa-4 pt-0 d-flex flex-column ga-8">
                  <!-- Nút đăng nhập -->
                  <v-btn
                    height="50"
                    class="w-100"
                    color="primary"
                    variant="elevated"
                    @click="login"
                  >
                    Đăng nhập
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </v-container>
    </div>
  </v-app>
</template>

<style scoped>
  .app {
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: url('/public/imgs/tu_sach.png');
    background-size: cover;
    background-position: center;
  }

  /* CSS zoom form đăng ký và đăng nhập */
  .zoom-in {
    animation: zoomIn 0.5s ease forwards;
  }

  @keyframes zoomIn {
    from {
      scale: 0.5;
      opacity: 0;
    }
    to {
      scale: 1;
      opacity: 1;
    }
  }

  /* Phần bọc 2 panel hình ảnh và form */
  .login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80vh;
    overflow: hidden;
  }

  /* Phần panel hình ảnh và form */
  .image-panel,
  .form-panel {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .image-panel {
    background-color: rgba(var(--v-theme-primary), 0.9);
  }

  .form-panel {
    background-color: #fff;
  }
</style>