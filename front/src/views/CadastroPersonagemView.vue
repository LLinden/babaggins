<template>
  <v-container class="fill-height d-flex flex-column align-center justify-center">
    <v-row justify="center" class="mb-6">
      <v-col cols="12" class="text-center">
        <h2>Cadastro de Personagem</h2>
      </v-col>
    </v-row>

    <v-form v-model="valid" @submit.prevent="cadastrarPersonagem">
      <v-row class="align-center mb-3" justify="center">
        <v-col cols="auto">
          <label for="nome">Nome:</label>
        </v-col>
        <v-col cols="auto">
          <v-text-field
            id="nome"
            v-model="nome"
            :rules="nomeRules"
            maxlength="50"
            hide-details="auto"
            dense
            variant="outlined"
            class="input-field"
          />
        </v-col>
      </v-row>

      <v-row class="align-center mb-5" justify="center">
        <v-col cols="auto">
          <label for="dinheiro">Dinheiro Inicial:</label>
        </v-col>
        <v-col cols="auto">
          <v-text-field
            id="dinheiro"
            v-model="dinheiro"
            :rules="dinheiroRules"
            maxlength="50"
            hide-details="auto"
            dense
            variant="outlined"
            class="input-field"
          />
        </v-col>
      </v-row>

      <v-row justify="center" class="mb-2">
        <v-col cols="auto">
          <v-btn
            color="primary"
            class="form-button"
            outlined
            type="submit"
          >
            Cadastrar
          </v-btn>
        </v-col>
      </v-row>

      <v-row justify="center">
        <v-col cols="auto">
          <v-btn
            color="secondary"
            class="form-button"
            outlined
            @click="voltar"
          >
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
    router.push({ name: 'home' })
  } catch (error) {
    alert('Erro ao cadastrar personagem.')
    console.error(error)
  }
}
</script>

<style scoped>
.input-field {
  width: 250px;
}

.form-button {
  min-width: 200px;
  min-height: 60px;
  font-size: 1.1rem;
  text-transform: none;
}
</style>
