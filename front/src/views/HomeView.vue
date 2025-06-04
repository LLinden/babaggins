<template>
  <v-container class="fill-height d-flex flex-column align-center justify-center">
    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <h1>BaBaggins</h1>
      </v-col>
    </v-row>

    <v-row class="mb-4" justify="center">
      <v-col cols="auto">
        <v-btn
          class="home-button"
          color="primary"
          outlined
          @click="goTo('MeuPersonagem')"
        >
          Meu Personagem
        </v-btn>
      </v-col>
    </v-row>

    <v-row class="mb-4" justify="center">
      <v-col cols="auto">
        <v-btn
          class="home-button"
          color="primary"
          outlined
          @click="goTo('itens-grupo')"
        >
          Itens do Grupo
        </v-btn>
      </v-col>
    </v-row>

    <v-row justify="center" class="mt-4">
      <v-col cols="auto">
        <v-btn
          class="home-button"
          color="primary"
          outlined
          @click="goTo('CadastrarItem')"
        >
          Cadastrar<br />Item
        </v-btn>
      </v-col>

      <v-col cols="auto">
        <v-btn
          class="home-button"
          color="primary"
          outlined
          @click="goTo('CadastrarPersonagem')"
        >
          Cadastrar<br />Personagem
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function goTo(routeName) {
  router.push({ name: routeName })
}
</script>

<style scoped>
.home-button {
  min-width: 200px;
  min-height: 80px;
  font-size: 1.2rem;
  text-transform: none;
}
</style>
