<template>
  <v-container class="py-10">
    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <h1>📜 Itens do Grupo</h1>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col cols="12" md="10">
        <v-data-table
          :headers="headers"
          :items="itens"
          class="elevation-1"
          dense
          :items-per-page="10"
        >
          <template #no-data>
            Nenhum item encontrado.
          </template>
        </v-data-table>
      </v-col>
    </v-row>

    <v-row justify="center" class="mt-6">
      <v-col cols="auto">
        <v-btn color="secondary" @click="voltar">Voltar</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getItensGrupoApi } from '../api/api'

const router = useRouter()

const headers = [
  { title: 'Item', key: 'nome' },
  { title: 'Quantidade', value: 'quantidade' },
  { title: 'Descrição', value: 'descricao' },
  { title: 'Personagem', value: 'personagemNome' },
]

const itens = ref([])

function voltar() {
  router.push({ name: 'Home' })
}

onMounted(async () => {
  try {
    itens.value = await getItensGrupoApi()
  } catch (error) {
    console.error('Erro ao carregar itens:', error)
    alert('Erro ao carregar itens.')
  }
})
</script>
