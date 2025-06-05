import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

// Vuetify
import vuetify from "./plugins/vuetify";
import "@mdi/font/css/materialdesignicons.css"; // Ícones padrão do Vuetify (opcional)
import "vuetify/styles"; // Estilos básicos
import './assets/fonts.css'

createApp(App).use(router).use(vuetify).mount("#app");
