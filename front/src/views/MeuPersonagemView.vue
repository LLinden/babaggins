<template>
    <v-container class="fill-height d-flex flex-column align-center justify-start pt-10">
        <v-row justify="center">
            <v-col cols="12" class="text-center">
                <h2>Meu Personagem</h2>
            </v-col>
        </v-row>
        <v-row justify="center" class="mb-4">
            <v-col cols="8" class="text-center">
                <v-text-field label="Nome do Personagem" v-model="nomeBusca" @keyup.enter="buscarPersonagem" outlined
                    dense />
            </v-col>
            <v-col cols="auto">
                <v-btn color="primary" @click="buscarPersonagem">Buscar</v-btn>
            </v-col>
        </v-row>

        <v-row justify="center" v-if="personagem && personagem.nome">
            <v-col cols="auto">
                <p><strong>Nome:</strong> {{ personagem.nome }}</p>
                <p><strong>Dinheiro:</strong> {{ personagem.dinheiro }}</p>
                <p><strong>Itens:</strong></p>
                <ul>
                    <li v-for="item in itens" :key="item.id">{{ item.nome }}</li>
                </ul>
            </v-col>
        </v-row>

        <v-row justify="center" class="mt-8">
            <v-col cols="8" class="text-center">
                <v-btn color="secondary" @click="voltar">Voltar</v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

const nomeBusca = ref('')
const personagem = ref(null)
const itens = ref([])

function voltar() {
    router.push({ name: 'Home' })
}

async function buscarPersonagem() {
    personagem.value = null
    itens.value = []

    try {
        // Passo 1: Buscar todos os personagens
        const res = await axios.get('http://localhost:3000/personagens')
        const encontrado = res.data.find(p => p.nome.toLowerCase() === nomeBusca.value.trim().toLowerCase())

        if (!encontrado) {
            alert('Personagem não encontrado.')
            return
        }

        // Passo 2: Buscar os dados completos do personagem pelo ID
        const personagemRes = await axios.get(`http://localhost:3000/personagens/${encontrado.id}`)
        personagem.value = personagemRes.data[0]

        // Passo 3: Buscar itens do personagem
        const itensRes = await axios.get(`http://localhost:3000/itens/${encontrado.id}`)
        itens.value = itensRes.data
    } catch (error) {
        console.error(error)
        alert('Erro ao buscar personagem.')
    }
}
</script>
