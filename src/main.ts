import './assets/main.css';

import { createApp } from 'vue';
import PrimeVue from 'primevue/config';
import { definePreset } from '@primevue/themes';
import Aura from '@primevue/themes/aura';
import router from '@/router/index';
import App from './App.vue';
import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';

import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import {
  Avatar,
  Button,
  Card,
  ConfirmDialog,
  Divider,
  InputText,
  Message,
  Password,
  ProgressSpinner,
  Tag,
  Toast
} from 'primevue';

const MyPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{violet.50}',
      100: '{violet.100}',
      200: '{violet.200}',
      300: '{violet.300}',
      400: '{violet.400}',
      500: '{violet.500}',
      600: '{violet.600}',
      700: '{violet.700}',
      800: '{violet.800}',
      900: '{violet.900}',
      950: '{violet.950}'
    }
  }
});

const app = createApp(App);
app
  .use(PrimeVue, {
    theme: {
      preset: MyPreset,
      options: {
        darkModeSelector: '.my-app-dark',
        cssLayer: false
      }
    }
  })
  .use(router)
  .use(ToastService)
  .use(ConfirmationService)

  .component('Avatar', Avatar)
  .component('Button', Button)
  .component('Card', Card)
  .component('ConfirmDialog', ConfirmDialog)
  .component('Divider', Divider)
  .component('InputText', InputText)
  .component('Message', Message)
  .component('Password', Password)
  .component('ProgressSpinner', ProgressSpinner)
  .component('Tag', Tag)
  .component('Toast', Toast)

  .mount('#app');
