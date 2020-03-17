<template>
    <div class="text-4xl">{{remaining}}</div>
</template>

<script>
    export default {
        props: {
            duration: Number,
        },
        data() {
            return {
                remaining: 0,
                timer: null,
            };
        },
        methods: {
            start() {
                this.remaining = this.duration;
                this.timer = setInterval(this.tick, 1000);
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
            this.start();
        },
        beforeDestroy() {
            clearInterval(this.timer);
        },
    };
</script>

<style>
</style>
