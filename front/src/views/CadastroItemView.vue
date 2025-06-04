<template>
    <v-container class="fill-height d-flex flex-column align-center justify-center">
        <v-row justify="center" class="mb-6">
            <v-col cols="12" class="text-center">
                <h2>Cadastro de Item</h2>
            </v-col>
        </v-row>

        <v-form v-model="valid" @submit.prevent="cadastrarItem">
            <v-row class="align-center mb-3" justify="center">
                <v-col cols="auto">
                    <label for="nome">Nome do item:</label>
                </v-col>
                <v-col cols="auto">
                    <v-text-field id="nome" v-model="nome" :rules="nomeRules" maxlength="50" hide-details="auto"
                        dense variant="outlined" class="input-field" />
                </v-col>
            </v-row>

            <v-row class="align-center mb-3" justify="center">
                <v-col cols="auto">
                    <label for="descricao">Descrição:</label>
                </v-col>
                <v-col cols="auto">
                    <v-text-field id="descricao" v-model="descricao" :rules="descricaoRules" maxlength="250"
                        hide-details="auto" dense variant="outlined" class="input-field" />
                </v-col>
            </v-row>

            <v-row class="align-center mb-5" justify="center">
                <v-col cols="auto">
                    <label for="quantidade">Quantidade:</label>
                </v-col>
                <v-col cols="auto">
                    <v-text-field id="quantidade" v-model="quantidade" :rules="quantidadeRules" maxlength="50"
                        hide-details="auto" dense variant="outlined" class="input-field" />
                </v-col>
            </v-row>

            <v-row class="align-center mb-3" justify="center">
                <v-col cols="auto">
                    <label for="personagem">Está com qual personagem?</label>
                </v-col>
                <v-col cols="auto">
                    <v-text-field id="personagem" v-model="personagem" :rules="personagemRules" maxlength="50"
                        hide-details="auto" dense variant="outlined" class="input-field" />
                </v-col>
            </v-row>

            <v-row justify="center" class="mb-2">
                <v-col cols="auto">
                    <v-btn color="primary" class="form-button" outlined type="submit">
                        Cadastrar
                    </v-btn>
                </v-col>
            </v-row>

            <v-row justify="center">
                <v-col cols="auto">
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
        // Buscar todos os personagens para enviar o id do personagem dono do item
        const res = await axios.get('http://localhost:3000/personagens')
        const encontrado = res.data.find(p => p.nome.toLowerCase().trim() === personagem.value.toLowerCase().trim())

        if (!encontrado) {
            alert('Personagem não encontrado.')
            return
        }

        await axios.post('http://localhost:3000/itens', {
            personagem_id: encontrado.id,
            nome_item: nome.value,
            descricao: descricao.value,
            quantidade: quantidade.value
        })

        alert('Item cadastrado com sucesso!')
        router.push({ name: 'Home' })
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
