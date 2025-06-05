<template>
    <v-container class="fill-height d-flex flex-column align-center justify-center">
        <v-row justify="center">
            <v-col cols="12" class="text-center">
                <h1 class="titulo">💰 BaBaggins 💰</h1>
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
    min-width: 160px;
    min-height: 60px;
    font-size: 0.8rem;
    text-transform: none;
    padding: 8px 12px;
    line-height: 1.3rem;
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

@media (max-width: 600px) {
    .home-button {
        font-size: 0.63rem;
        line-height: 1rem;
    }
}

.titulo {
    font-size: 3em;
    font-weight: bold;
    background: linear-gradient(90deg, #fff, #f0f, #0ff, #fff);
    background-size: 200% auto;
    color: transparent;
    background-clip: text;
    -webkit-background-clip: text;
    animation: brilharGradiente 2s linear infinite;
}

@keyframes brilharGradiente {
    0% {
        background-position: 0% center;
    }

    100% {
        background-position: 200% center;
    }
}
</style>
