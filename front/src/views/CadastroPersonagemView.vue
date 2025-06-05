<template>
  <v-container class="fill-height d-flex flex-column align-center justify-start pt-10">
    <v-row justify="center" class="mb-2">
      <v-col cols="12" class="text-center">
        <h1>👤 Cadastro de Personagem</h1>
      </v-col>
    </v-row>

    <v-form v-model="valid" @submit.prevent="cadastrarPersonagem">
      <v-row justify="center">
        <v-col cols="12" class="mx-auto" style="max-width: 500px;">
          <v-text-field label="Nome" v-model="nome" :rules="nomeRules" maxlength="50" hide-details="auto" dense
            variant="outlined" class="input-field" />
        </v-col>
      </v-row>

      <v-row justify="center">
        <v-col cols="12" class="mx-auto" style="max-width: 500px;">
          <v-text-field label="Dinheiro Inicial" v-model="dinheiro" :rules="dinheiroRules" maxlength="50"
            hide-details="auto" dense variant="outlined" class="input-field" />
        </v-col>
      </v-row>

      <v-row justify="center" class="mb-2">
        <v-col cols="auto" class="d-flex" style="gap: 8px;">
          <v-btn color="primary" class="form-button" outlined type="submit">
            Cadastrar
          </v-btn>
          <v-btn color="secondary" class="form-button" outlined @click="voltar">
            Voltar
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const nome = ref('')
const dinheiro = ref('')
const valid = ref(false)

const nomeRules = [
  v => !!v || 'Nome é obrigatório',
  v => v.length <= 50 || 'Máximo de 50 caracteres',
]

const dinheiroRules = [
  v => !!v || 'Dinheiro é obrigatório',
  v => /^[0-9]+$/.test(v) || 'Somente números inteiros',
  v => v.length <= 50 || 'Máximo de 50 caracteres',
]

function voltar() {
  router.push({ name: 'Home' })
}

async function cadastrarPersonagem() {
  if (!valid.value) return

  try {
    await axios.post('http://localhost:3000/personagens', {
      nome: nome.value,
      dinheiro: parseInt(dinheiro.value, 10),
    })

    alert('Personagem cadastrado com sucesso!')
    router.push({ name: 'Home' })
  } catch (error) {
    alert('Erro ao cadastrar personagem.')
    console.error(error)
  }
}
</script>

<style scoped>
.input-field {
  width: 100%;
}

.form-button {
  min-width: 140px;
  min-height: 40px;
  font-size: 0.95rem;
  text-transform: none;
  padding: 6px 12px;
}

.v-row {
  flex: none;
  margin-top: 0px;
}
</style>
