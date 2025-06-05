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
                <p><strong>Dinheiro:</strong> {{ personagem.dinheiro }}
                    <v-icon color="green" class="ml-2 cursor-pointer"
                        @click="abrirDialogDinheiro(true)">mdi-plus-circle</v-icon>
                    <v-icon color="red" class="ml-2 cursor-pointer"
                        @click="abrirDialogDinheiro(false)">mdi-minus-circle</v-icon>
                </p>
                <p><strong>Itens:</strong></p>
                <ul>
                    <li v-for="item in itens" :key="item.id">
                        Nome: {{ item.nome_item }}, Quantidade: {{ item.quantidade }}, Descrição: {{ item.descricao }}
                        <v-icon color="green" class="ml-2 cursor-pointer"
                            @click="aumentarQuantidade(item)">mdi-plus-circle</v-icon>
                        <v-icon color="red" class="ml-2 cursor-pointer"
                            @click="diminuirQuantidade(item)">mdi-minus-circle</v-icon>
                    </li>
                </ul>

                <!-- Modal de confirmação -->
                <v-dialog v-model="dialog" max-width="400">
                    <v-card>
                        <v-card-title class="headline">Remover Itens</v-card-title>
                        <v-card-text>
                            Deseja realmente remover <strong>{{ itemSelecionado?.nome_item }}</strong>?
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer />
                            <v-btn text @click="dialog = false">Cancelar</v-btn>
                            <v-btn color="red" @click="removerItem">Remover</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>

                <!-- Modal de atualização de dinheiro -->
                <v-dialog v-model="dialogDinheiro" max-width="400">
                    <v-card>
                        <v-card-title class="headline">
                            {{ somandoDinheiro ? 'Adicionar Dinheiro' : 'Remover Dinheiro' }}
                        </v-card-title>
                        <v-card-text>
                            <v-text-field v-model.number="valorDinheiro" type="number" :min="1" label="Valor" dense />
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer />
                            <v-btn text @click="dialogDinheiro = false">Cancelar</v-btn>
                            <v-btn color="primary" @click="alterarDinheiro">
                                {{ somandoDinheiro ? 'Adicionar' : 'Remover' }}
                            </v-btn>
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
const dialogDinheiro = ref(false)
const somandoDinheiro = ref(true)
const valorDinheiro = ref(1)

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

function abrirDialogDinheiro(somar) {
    somandoDinheiro.value = somar
    valorDinheiro.value = 1
    dialogDinheiro.value = true
}

async function alterarDinheiro() {
    if (!personagem.value) return

    // Validação: apenas inteiros positivos
    if (!Number.isInteger(valorDinheiro.value) || valorDinheiro.value <= 0) {
        alert('Digite um valor inteiro positivo.')
        return
    }

    const valor = somandoDinheiro.value
        ? valorDinheiro.value
        : -valorDinheiro.value

    const novoValor = personagem.value.dinheiro + valor

    // Validação: não deixar o dinheiro ficar negativo
    if (novoValor < 0) {
        alert('Dinheiro não pode ser negativo.')
        return
    }

    try {
        const res = await axios.put(`http://localhost:3000/personagens/${personagem.value.id}/dinheiro`, {
            valor
        })

        personagem.value.dinheiro = res.data.dinheiro
        dialogDinheiro.value = false
    } catch (error) {
        console.error('Erro ao atualizar dinheiro:', error)
        alert('Erro ao atualizar dinheiro.')
    }
}

function diminuirQuantidade(item) {
    if (item.quantidade <= 1) {
        itemSelecionado.value = item
        quantidadeARemover.value = 1
        dialog.value = true
    } else {
        // Diminui diretamente
        const novaQuantidade = item.quantidade - 1
        axios.put(`http://localhost:3000/itens/${item.id}`, {
            ...item,
            quantidade: novaQuantidade
        })
            .then(() => {
                const i = itens.value.findIndex(i => i.id === item.id)
                if (i !== -1) itens.value[i].quantidade = novaQuantidade
            })
            .catch(error => {
                console.error('Erro ao diminuir item:', error)
                alert('Erro ao diminuir item.')
            })
    }
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

async function aumentarQuantidade(item) {
    try {
        const novaQuantidade = item.quantidade + 1

        await axios.put(`http://localhost:3000/itens/${item.id}`, {
            ...item,
            quantidade: novaQuantidade
        })

        const i = itens.value.findIndex(i => i.id === item.id)
        if (i !== -1) itens.value[i].quantidade = novaQuantidade
    } catch (error) {
        console.error('Erro ao aumentar item:', error)
        alert('Erro ao aumentar item.')
    }
}
</script>
