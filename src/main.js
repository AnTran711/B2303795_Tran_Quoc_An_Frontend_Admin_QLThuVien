import { createApp } from 'vue';
import App from './App.vue';

// Vuetify
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
// icon
import '@mdi/font/css/materialdesignicons.css';
// fonts
import 'unfonts.css';

// router
import router from './router/index.js';

// pinia
import { createPinia } from 'pinia';

const pinia = createPinia();

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light'
  },
  icons: {
    defaultSet: 'mdi'
  }
});

createApp(App)
  .use(router)
  .use(vuetify)
  .use(pinia)
  .mount('#app');
