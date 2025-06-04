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
                    <li v-for="item in itens" :key="item.id">
                        Nome: {{ item.nome_item }}, Quantidade: {{ item.quantidade }}, Descrição: {{ item.descricao }}
                        <v-icon color="red" class="ml-2 cursor-pointer"
                            @click="abrirModal(item)">mdi-minus-circle</v-icon>
                    </li>
                </ul>

                <!-- Modal de confirmação -->
                <v-dialog v-model="dialog" max-width="400">
                    <v-card>
                        <v-card-title class="headline">Remover Itens</v-card-title>
                        <v-card-text>
                            Quantas unidades deseja remover de <strong>{{ itemSelecionado?.nome_item }}</strong>?
                            <v-text-field v-model.number="quantidadeARemover" type="number" min="1"
                                :max="itemSelecionado?.quantidade" label="Quantidade" dense />
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer />
                            <v-btn text @click="dialog = false">Cancelar</v-btn>
                            <v-btn color="red" @click="removerItem">Remover</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
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
const dialog = ref(false)
const itemSelecionado = ref(null)
const quantidadeARemover = ref(1)

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

function abrirModal(item) {
  itemSelecionado.value = item
  quantidadeARemover.value = 1
  dialog.value = true
}

async function removerItem() {
  const item = itemSelecionado.value
  const novaQuantidade = item.quantidade - quantidadeARemover.value

  try {
    if (novaQuantidade <= 0) {
      // Remove o item
      await axios.delete(`http://localhost:3000/itens/${item.id}`)
      itens.value = itens.value.filter(i => i.id !== item.id)
    } else {
      // Atualiza quantidade do item
      await axios.put(`http://localhost:3000/itens/${item.id}`, {
        ...item,
        quantidade: novaQuantidade
      })
      const i = itens.value.findIndex(i => i.id === item.id)
      if (i !== -1) itens.value[i].quantidade = novaQuantidade
    }

    dialog.value = false
  } catch (error) {
    console.error('Erro ao remover item:', error)
    alert('Erro ao remover item.')
  }
}
</script>
