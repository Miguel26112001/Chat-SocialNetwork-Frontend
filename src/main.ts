import './assets/design-tokens.css';
import './assets/main.css';

import { createApp } from 'vue';
import PrimeVue from 'primevue/config';
import { definePreset } from '@primevue/themes';
import Aura from '@primevue/themes/aura';
import router from '@/router/index';
import App from './App.vue';
import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';
import Tooltip from 'primevue/tooltip';

import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import {
  Avatar,
  Badge,
  Button,
  Card,
  ConfirmDialog,
  Divider,
  FloatLabel,
  IconField,
  InputIcon,
  InputText,
  Message,
  Password,
  ProgressSpinner,
  Skeleton,
  Tag,
  Textarea,
  Toast
} from 'primevue';

const MyPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{indigo.50}',
      100: '{indigo.100}',
      200: '{indigo.200}',
      300: '{indigo.300}',
      400: '{indigo.400}',
      500: '{indigo.500}',
      600: '{indigo.600}',
      700: '{indigo.700}',
      800: '{indigo.800}',
      900: '{indigo.900}',
      950: '{indigo.950}'
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
  .component('Badge', Badge)
  .component('Button', Button)
  .component('Card', Card)
  .component('ConfirmDialog', ConfirmDialog)
  .component('Divider', Divider)
  .component('FloatLabel', FloatLabel)
  .component('IconField', IconField)
  .component('InputIcon', InputIcon)
  .component('InputText', InputText)
  .component('Message', Message)
  .component('Password', Password)
  .component('ProgressSpinner', ProgressSpinner)
  .component('Skeleton', Skeleton)
  .component('Tag', Tag)
  .component('Textarea', Textarea)
  .component('Toast', Toast)

  .directive('tooltip', Tooltip)

  .mount('#app');
