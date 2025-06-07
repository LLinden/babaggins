<template>
    <v-container class="fill-height d-flex flex-column align-center justify-start pt-10">
        <v-row justify="center" class="mb-6">
            <v-col cols="12" class="text-center">
                <h1>🪙 Distribuir Dinheiro</h1>
                <br /><br />
                <p>Há {{ tamanhoGrupo }} membros no grupo</p>
            </v-col>
        </v-row>

        <v-form v-model="valid" @submit.prevent="distribuirDinheiro">
            <v-row justify="center">
                <v-col cols="12">
                    <v-text-field class="input-field" label="Quantidade de dinheiro à distribuir"
                        v-model="valorDistribuir" :rules="distribuirDinheiroRules" maxlength="50" hide-details="auto"
                        dense variant="outlined" type="number" min="1" />
                </v-col>
            </v-row>

            <v-row justify="center" class="mb-3">
                <v-col cols="auto" class="d-flex" style="gap: 8px;">
                    <v-btn color="primary" class="form-button" outlined type="submit">
                        Distribuir
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
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getPersonagensApi, distribuirDinheiroApi } from '../api/api'

const router = useRouter()
const tamanhoGrupo = ref(0)
const personagens = ref([])
const valid = ref(false)
const valorDistribuir = ref('')

const distribuirDinheiroRules = [
    v => !!v || 'Valor é obrigatório',
    v => /^[0-9]+$/.test(v) || 'Somente números inteiros',
    v => v.length <= 50 || 'Máximo de 50 caracteres',
]

function voltar() {
    router.push({ name: 'Home' })
}

onMounted(async () => {
    try {
        const personagensData = await getPersonagensApi()
        personagens.value = personagensData
        tamanhoGrupo.value = personagens.value.length
    } catch (error) {
        console.error('Erro ao buscar personagens:', error)
        tamanhoGrupo.value = 0
    }
})

async function distribuirDinheiro() {
    if (!valid.value) return

    const valorTotal = parseInt(valorDistribuir.value, 10) // valor digitado no input
    if (isNaN(valorTotal) || valorTotal <= 0) {
        alert('Digite um valor válido e positivo.')
        return
    }

    try {
        await distribuirDinheiroApi(valorTotal)
        alert('Dinheiro distribuído com sucesso!')
        router.push({ name: 'Home' })
    } catch (error) {
        alert(error.message || 'Erro ao distribuir dinheiro.')
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