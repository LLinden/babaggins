<template>
    <v-container class="fill-height d-flex flex-column align-center justify-center">
        <v-row justify="center">
            <v-col cols="12" class="text-center">
                <h1>BaBaggins</h1>
            </v-col>
        </v-row>

        <v-row justify="center" class="mb-4" dense>
            <v-col cols="6" class="text-center">
                <v-btn class="home-button" color="primary" outlined @click="goTo('MeuPersonagem')">
                    Meu Personagem
                </v-btn>
            </v-col>
            <v-col cols="6" class="text-center">
                <v-btn class="home-button" color="primary" outlined @click="goTo('ItensGrupo')">
                    Itens do Grupo
                </v-btn>
            </v-col>
        </v-row>

        <v-row justify="center" class="mb-4" dense>
            <v-col cols="6" class="text-center">
                <v-btn class="home-button" color="primary" outlined @click="goTo('DistribuiDinheiro')">
                    Distribuir<br />Dinheiro
                </v-btn>
            </v-col>
            <v-col cols="6" class="text-center">
                <v-btn class="home-button" color="primary" outlined @click="goTo('CadastrarItem')">
                    Cadastrar<br />Item
                </v-btn>
            </v-col>
        </v-row>

        <v-row justify="center" dense>
            <v-col cols="6" class="text-center">
                <v-btn class="home-button" color="primary" outlined @click="goTo('CadastrarPersonagem')">
                    Cadastrar<br />Personagem
                </v-btn>
            </v-col>
            <v-col cols="6" class="text-center">
                <!-- Espaço vazio para alinhar -->
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
    min-width: 140px;
    min-height: 50px;
    font-size: 1rem;
    text-transform: none;
    padding: 8px 12px;
}

.v-row {
    margin-left: -4px;
    margin-right: -4px;
    flex: none;
}

.v-col {
    padding-left: 4px;
    padding-right: 4px;
    margin-bottom: 8px;
}
</style>
