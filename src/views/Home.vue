<template>
    <div>
        <div>
            <div>Intentos: {{attempts}}</div>
            <div class="correct-score">Aciertos: {{correct}}</div>
            <div class="wrong-score">Fallos: {{wrong}}</div>
        </div>
        <div>
            <div v-for="attempt in history" :key="attempt.country">
                {{attempt.country}}: {{attempt.capital}} <span>{{attempt.answerWasCorrect}}</span>
            </div>
        </div>
        <div>
            <div class="current-country">{{currentCountry}}</div>
            <div><input type="text" @keyup.enter="proceed" v-model='tryCapital' ref="theInput"/></div>
            <div class="correct-answer" v-if="answerWasCorrect === true">¡Correcto!</div>
            <div class="wrong-answer" v-if="answerWasCorrect === false">¡Incorrecto! era {{ currentCapital }}</div>
        </div>
        <div v-if="answerWasCorrect === undefined">
            <button @click="proceed">Aceptar</button>
            <button @click="reset">Volver a Empezar</button>
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
                expected = this.deburr(expected.toLowerCase());
                actual = this.deburr(actual.toLowerCase());
                return expected === actual;
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
