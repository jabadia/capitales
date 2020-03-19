<template>
    <table class="border-collapse table-fixed w-2/5">
        <tbody>
        <tr class="py-1" v-for="attempt in history" :key="attempt.country">
            <td class="px-1 w-2/5">
                {{attempt.country}}
            </td>
            <td class="px-1 w-2/5">
                {{Array.isArray(attempt.capital) ? attempt.capital[0] : attempt.capital}}
            </td>
            <td class="px-1 text-center">
                <span :class="attempt.answerWasCorrect? 'text-green' : 'text-red'">
                    {{attempt.answerWasCorrect ? '✔' : '✖' }}
                </span>
            </td>
        </tr>
        </tbody>
    </table>
</template>
<script>
    export default {
        name: 'history-table',
        props: {
            history: Array,
        },
    };
</script>
