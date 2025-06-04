import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import CadastrarPersonagemView from "@/views/CadastroPersonagemView.vue";
import MeuPersonagemView from "@/views/MeuPersonagemView.vue";
import CadastrarItemView from "@/views/CadastroItemView.vue";
import ItensGrupoView from "@/views/ItensGrupoView.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomeView,
  },
  {
    path: "/cadastrar-personagem",
    name: "CadastrarPersonagem",
    component: CadastrarPersonagemView,
  },
  {
    path: "/meu-personagem",
    name: "MeuPersonagem",
    component: MeuPersonagemView,
  },
  {
    path: "/cadastrar-item",
    name: "CadastrarItem",
    component: CadastrarItemView,
  },
  {
    path: "/itens-grupo",
    name: "ItensGrupo",
    component: ItensGrupoView,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
