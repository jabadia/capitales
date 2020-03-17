<template>
    <div class="flex flex-row w-full">
        <div class="p-2 w-1/2">
            <div>
                <div>Intentos: {{attempts}}</div>
                <div class="correct-score">Aciertos: {{correct}}</div>
                <div class="wrong-score">Fallos: {{wrong}}</div>
            </div>
            <div>
                <div class="current-country border-2 border-gray-300 rounded-lg my-2 py-2 px-4 block w-full leading-normal text-center">{{currentCountry}}</div>
                <div>
                    <input
                        class="bg-white focus:outline-none focus:shadow-outline border-2 border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal text-center"
                        type="text" @keyup.enter="proceed" v-model='tryCapital' ref="theInput"/>
                </div>
            </div>
            <div v-if="answerWasCorrect !== undefined" class="text-center py-2">
                <div class="correct-answer text-green" v-if="answerWasCorrect === true">¡Correcto!</div>
                <div class="wrong-answer text-red" v-if="answerWasCorrect === false">¡Incorrecto! era {{ currentCapital }}</div>
            </div>
            <div v-else class="text-center">
                <button class="btn btn-blue m-2" @click="proceed">Aceptar</button>
                <button class="btn btn-blue m-2" @click="reset">Volver a Empezar</button>
            </div>
        </div>
        <div class="py-2 px-8 w-1/2">
            <table class="border-collapse table-fixed w-full">
                <tbody>
                <tr class="py-1" v-for="attempt in history" :key="attempt.country">
                    <td class="px-1 w-1/3">
                        {{attempt.country}}
                    </td>
                    <td class="px-1 w-1/3">
                        {{attempt.capital}}
                    </td>
                    <td class="px-1">
                        <span :class="attempt.answerWasCorrect? 'text-green' : 'text-red'">
                            {{attempt.answerWasCorrect ? '✔' : '✖' }}
                        </span>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
    // @ is an alias to /src
    // import HelloWorld from '@/components/HelloWorld.vue';
    import { CAPITALS } from '@/assets/capitals.const.js';

    const DELAY = 1500;

    export default {
        name: 'Home',
        data: () => ({
            correct: 0,
            wrong: 0,
            tryCapital: '',
            currentIndex: 0,
            answerWasCorrect: false,
            history: [],
        }),
        computed: {
            currentCountry() {
                return CAPITALS[this.currentIndex].country;
            },
            currentCapital() {
                return CAPITALS[this.currentIndex].capital;
            },
            attempts() {
                return this.correct + this.wrong;
            },
        },
        methods: {
            deburr(s) {
                return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            },
            isCorrectAnswer(expected, actual) {
                if (!Array.isArray(expected)) {
                    expected = [expected];
                }
                return expected.some(expectedAnswer => {
                    expectedAnswer = this.deburr(expectedAnswer.toLowerCase());
                    actual = this.deburr(actual.toLowerCase());
                    return expectedAnswer === actual;
                });
            },
            proceed() {
                this.answerWasCorrect = this.isCorrectAnswer(this.currentCapital, this.tryCapital);
                setTimeout(() => {
                    if (this.answerWasCorrect) {
                        this.correct += 1;
                    } else {
                        this.wrong += 1;
                    }
                    this.history.push({
                        index: this.currentIndex,
                        ...CAPITALS[this.currentIndex],
                        answerWasCorrect: this.answerWasCorrect,
                    });
                    this.pickRandom();
                }, DELAY);
            },
            reset() {
                this.wrong = 0;
                this.correct = 0;
                this.history = [];
                this.pickRandom();
            },
            pickRandom() {
                do {
                    this.currentIndex = Math.floor(Math.random() * CAPITALS.length);
                } while (this.history.map(attempt => attempt.index).includes(this.currentIndex));
                this.answerWasCorrect = undefined;
                this.tryCapital = '';
                this.$nextTick(() => {
                    this.$refs.theInput.focus();
                });
            },
        },
        components: {},
        mounted() {
            this.pickRandom();
        },
    };
</script>

<style>
    .btn-blue {
        @apply bg-blue text-white font-bold py-2 px-4 rounded
    }

    .btn-blue:hover {
        @apply bg-blue-light
    }
</style>
