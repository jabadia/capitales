<template>
    <div class="home bg-blue-lighter h-screen text-grey-darkest">
        <div class="flex flex-row flex-wrap w-full">
            <europe-map class="w-full md:w-1/2" :selected-country="currentCountryCode" />
            <div class="flex-1 text-right">
                <button class="btn btn-blue m-2" @click="pause()">Pausa</button>
            </div>
        </div>
        <div class="flex flex-row w-full flex-wrap">
            <div class="p-2 w-full md:w-1/2">
                <div class="flex flex-row w-full">
                    <!--<span class="flex-1 text-center">Intentos: {{attempts}}</span>-->
                    <span class="flex-1 text-center correct-score">Aciertos: {{correct}}</span>
                    <span class="flex-1 text-center wrong-score">Fallos: {{wrong}}</span>
                </div>
                <countdown-timer
                    :paused="paused"
                    :duration="timerDuration"
                    :key="currentIndex"
                    @end-time="countdownEnded"
                    @tick="timerTick"
                />
                <div>
                    <div
                        class="current-country bg-white border-2 border-gray-300 rounded-lg my-2 py-2 px-4 block w-full leading-normal text-center text-xl">
                        {{currentCountry}}
                    </div>
                    <div>
                        <input
                            placeholder="capital"
                            class="bg-white focus:outline-none focus:shadow-outline border-2 border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal text-center text-xl"
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
            <div class="p-2 w-full md:w-1/2">
                <history-table :history="history"/>
            </div>
        </div>
        <div v-if="paused" class="flex flex-col fixed pin bg-grey items-center ">
            <div class="flex-grow flex items-center justify-center w-full">
                <h2 class="w-3/4 text-center">
                    <span v-if="firstTime">Tienes que acertar 10 capitales lo más rápido posible.<br><br>¡Solo se admiten 3 fallos!</span>
                    <span v-else>{{lastOutcome[0]}}<br>{{lastOutcome[1]}}</span>
                </h2>
            </div>
            <div class="flex justify-center">
            <button class="btn btn-blue m-2" @click="resume">
                <span v-if="firstTime">Empezar</span>
                <span v-else>Reanudar</span>
            </button>
            <button v-if="!firstTime" class="btn btn-blue m-2" @click="reset">Volver a Empezar</button>
            </div>
            <div class="flex-grow"/>
        </div>
    </div>
</template>

<script>
    // TODO: better appearance
    // TODO: instructions and you won, you lost messages
    // TODO: keep track of scores (in local storage)
    // TODO: ask your name?

    // @ is an alias to /src
    import CountdownTimer from '@/components/CountdownTimer';
    import HistoryTable from '@/components/HistoryTable';
    import EuropeMap from '@/components/EuropeMap';
    import { CAPITALS } from '@/assets/capitals.const';

    const DELAY = 1500;
    const MAX_MISTAKES = 3;
    const TARGET = 10;

    export default {
        name: 'Home',
        data: () => ({
            // TODO: instead of counting failures, let's have a number of "lives" and substract from that until we get to 0
            correct: 0,
            wrong: 0,
            tryCapital: '',
            currentIndex: 0,
            answerWasCorrect: false,
            history: [],
            timerDuration: 10,
            paused: true,
            firstTime: true,
            lastOutcome: '',
        }),
        computed: {
            currentQuestion() {
                return CAPITALS[this.currentIndex];
            },
            currentCountry() {
                return this.currentQuestion.country;
            },
            currentCapital() {
                return this.currentQuestion.capital;
            },
            currentCountryCode() {
                return this.currentQuestion.code;
            },
        },
        methods: {
            deburr(s) {
                return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            },
            countdownEnded() {
                // this.proceed();
                // TODO: message to say you lost
                this.lastOutcome = ['¡Se acabó el tiempo! ¡Has perdido!', '¿Quiéres volver a intentarlo?'];
                this.reset();
                this.paused = true;
            },
            timerTick(remaining) {
                this.timerDuration = remaining;
            },
            isCorrectAnswer(expected, actual) {
                if (!Array.isArray(expected)) {
                    expected = [expected];
                }
                actual = this.deburr(actual.toLowerCase().trim());
                return expected.some(expectedAnswer => {
                    expectedAnswer = this.deburr(expectedAnswer.toLowerCase());
                    return expectedAnswer === actual;
                });
            },
            proceed() {
                this.answerWasCorrect = this.isCorrectAnswer(this.currentCapital, this.tryCapital);
                setTimeout(() => {
                    if (this.answerWasCorrect) {
                        this.correct += 1;
                        this.timerDuration += 10; // + this.correct - this.wrong;
                    } else {
                        this.wrong += 1;
                        this.timerDuration += 5; // + this.correct - this.wrong;
                    }
                    if (this.wrong >= MAX_MISTAKES) {
                        this.lastOutcome = ['¡Demasiados fallos, has perdido!', '¿Quiéres volver a intentarlo?'];
                        this.reset();
                        this.paused = true;
                        return;
                    }
                    if (this.correct >= TARGET) {
                        // TODO: message to say you won
                        this.lastOutcome = [
                            `¡Enhorabuena, Buen Trabajo! Te han sobrado ${this.timerDuration} segundos`,
                            '¿Otro intento?',
                        ];
                        this.reset();
                        this.paused = true;
                        return;
                    }
                    this.history.push({
                        index: this.currentIndex,
                        ...this.currentQuestion,
                        answerWasCorrect: this.answerWasCorrect,
                    });
                    this.pickNextQuestion();
                }, DELAY);
            },
            pause() {
                this.lastOutcome = '';
                this.paused = true;
            },
            reset() {
                this.wrong = 0;
                this.correct = 0;
                this.timerDuration = 10;
                this.history = [];
                this.paused = false;
                this.pickNextQuestion();
            },
            resume() {
                this.paused = false;
                this.firstTime = false;
                this.$nextTick(() => {
                    this.$refs.theInput.focus();
                });
            },
            pickNextQuestion() {
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
        components: {
            EuropeMap,
            HistoryTable,
            CountdownTimer,
        },
        mounted() {
            this.pickNextQuestion();
        },
    };
</script>

<style>
    .home {
        font-family: 'Cabin', sans-serif;
    }
    .btn-blue {
        @apply bg-blue text-white font-bold py-2 px-4 rounded
    }

    .btn-blue:hover {
        @apply bg-blue-light
    }
</style>
