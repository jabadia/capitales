<template>
    <div class="p-4 text-4xl text-center">{{remaining}}</div>
</template>

<script>
    export default {
        props: {
            duration: Number,
            paused: Boolean,
        },
        data() {
            return {
                remaining: 0,
            };
        },
        watch: {
            paused: {
                handler(newPaused) {
                    const running = !newPaused;
                    if (running) {
                        this.start();
                    } else {
                        this.pause();
                    }
                },
                immediate: true,
            },
        },
        methods: {
            start() {
                this.timer = setInterval(this.tick, 1000);
            },
            pause() {
                clearInterval(this.timer);
            },
            tick() {
                this.remaining -= 1;
                if (this.remaining <= 0) {
                    clearInterval(this.timer);
                    this.$emit('end-time');
                }
            },
        },
        mounted() {
            this.remaining = this.duration;
            // this.start();
        },
        beforeDestroy() {
            clearInterval(this.timer);
        },
    };
</script>

<style>
</style>
