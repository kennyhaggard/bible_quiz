<template>
  <div id="app">
    <!-- Show QuizSetup if no quiz is active, else show Quiz -->
    <QuizSetup v-if="!quizStarted" />
    <Quiz v-else />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useQuizStore } from './store/quizStore';
import QuizSetup from './components/QuizSetup.vue';
import Quiz from './components/Quiz.vue';

const quizStore = useQuizStore();
// Determine if a quiz has started by checking if selectedQuestions array is not empty.
const quizStarted = computed(() => quizStore.selectedQuestions.length > 0);
</script>

<style>
/* Global styles, if needed */
</style>