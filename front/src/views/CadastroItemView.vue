<template>
    <v-container class="fill-height d-flex flex-column align-center justify-start pt-10">
        <v-row justify="center" class="mb-6">
            <v-col cols="12" class="text-center">
                <h1>🔮 Cadastro de Item 🗡️</h1>
            </v-col>
        </v-row>

        <v-form v-model="valid" @submit.prevent="cadastrarItem">
            <v-row justify="center">
                <v-col cols="12">
                    <v-text-field class="input-field" label="Nome do item" v-model="nome" :rules="nomeRules"
                        maxlength="50" hide-details="auto" dense variant="outlined" />
                </v-col>
            </v-row>

            <v-row justify="center">
                <v-col cols="12">
                    <v-text-field class="input-field" label="Descrição" v-model="descricao" :rules="descricaoRules"
                        maxlength="250" hide-details="auto" dense variant="outlined" />
                </v-col>
            </v-row>

            <v-row justify="center">
                <v-col cols="12">
                    <v-text-field class="input-field" label="Quantidade" v-model="quantidade" :rules="quantidadeRules"
                        maxlength="50" hide-details="auto" dense variant="outlined" />
                </v-col>
            </v-row>

            <v-row justify="center">
                <v-col cols="12">
                    <v-text-field class="input-field" label="Personagem" v-model="personagem" :rules="personagemRules"
                        maxlength="50" hide-details="auto" dense variant="outlined" />
                </v-col>
            </v-row>

            <v-row justify="center" class="mb-3">
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
import { cadastrarItemApi } from '../api/api'

const router = useRouter()
const nome = ref('')
const descricao = ref('')
const quantidade = ref('')
const personagem = ref('')
const valid = ref(false)

const nomeRules = [
    v => !!v || 'Nome é obrigatório',
    v => v.length <= 50 || 'Máximo de 50 caracteres',
]

const descricaoRules = [
    v => v.length <= 250 || 'Máximo de 50 caracteres',
]

const quantidadeRules = [
    v => !!v || 'Quantidade é obrigatório',
    v => v.length <= 50 || 'Máximo de 50 caracteres',
]

const personagemRules = [
    v => !!v || 'Personagem é obrigatório',
    v => v.length <= 50 || 'Máximo de 50 caracteres',
]

function voltar() {
    router.push({ name: 'Home' })
}

async function cadastrarItem() {
    if (!valid.value) return

    try {
        await cadastrarItemApi({
            personagemNome: personagem.value,
            nome: nome.value,
            descricao: descricao.value,
            quantidade: quantidade.value
        })

        alert('Item cadastrado com sucesso!')
        router.push({ name: 'Home' })
    } catch (error) {
        alert(error.message || 'Erro ao cadastrar personagem.')
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
}
</style>
